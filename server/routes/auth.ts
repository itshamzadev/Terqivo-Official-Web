import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser';
import { User } from '../models/User';
import { authenticate, requireUser, signUserToken, type AuthRequest } from '../middleware/auth';
import { createRateLimiter } from '../middleware/rateLimit';
import { sendTemplateEmail } from '../utils/emailService';
import { clearVerificationFields, issueVerification, safeHashMatches, verificationSendAvailable, VERIFICATION_CODE_ATTEMPT_LIMIT, VERIFICATION_CODE_LOCK_MS } from '../utils/emailVerification';

const router = Router();
const tokenSecret = () => process.env.JWT_SECRET || 'your_jwt_secret';
const normalizeEmail = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const normalizeUsername = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validUsername = (value: string) => /^[a-z0-9_.]{3,30}$/.test(value);
const validPassword = (value: string) => value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
const hashToken = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
const safeUser = (user: any) => ({ id: String(user._id), name: user.name, email: user.email, username: user.username, avatar: user.avatar || '', authProvider: user.authProvider || 'local', emailVerified: Boolean(user.emailVerified), status: user.status, role: 'user', createdAt: user.createdAt, lastLoginAt: user.lastLoginAt });
const cookieOptions = (maxAge: number) => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, maxAge });

export async function sendVerification(user: any, templateKey = 'user_email_verification') {
  return issueVerification(user, templateKey);
}

async function sendPasswordReset(user: any) {
  const token = crypto.randomBytes(32).toString('hex'); user.passwordResetTokenHash = crypto.createHash('sha256').update(token).digest('hex'); user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000); await user.save();
  const appUrl = /^https?:\/\//i.test(process.env.APP_URL || '') ? String(process.env.APP_URL).replace(/\/$/, '') : '';
  return sendTemplateEmail({ to: user.email, recipientName: user.name, templateKey: 'user_password_reset_request', data: { name: user.name, username: user.username, email: user.email, resetUrl: `${appUrl}/reset-password?token=${encodeURIComponent(token)}`, expiresIn: '1 hour' }, relatedEntityType: 'User', relatedEntityId: String(user._id), category: 'authentication' });
}

router.post('/signup', createRateLimiter(5, 15 * 60 * 1000), async (req, res) => {
  try {
    const name = String(req.body.name || '').trim().replace(/\s+/g, ' '); const email = normalizeEmail(req.body.email); const username = normalizeUsername(req.body.username); const password = String(req.body.password || ''); const confirmPassword = String(req.body.confirmPassword || '');
    if (name.length < 2 || name.length > 100) return res.status(400).json({ success: false, message: 'Full name must be between 2 and 100 characters' });
    if (!validEmail(email)) return res.status(400).json({ success: false, message: 'Enter a valid email address' });
    if (!validUsername(username)) return res.status(400).json({ success: false, message: 'Username must be 3-30 characters using letters, numbers, underscores, or dots' });
    if (!validPassword(password)) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters and contain a letter and a number' });
    if (password !== confirmPassword) return res.status(400).json({ success: false, message: 'Passwords do not match' });
    if (await User.exists({ $or: [{ email }, { username }] })) return res.status(409).json({ success: false, message: 'An account with that email or username already exists' });
    const user = new User({ name, email, username, password: await bcrypt.hash(password, 12), authProvider: 'local', role: 'user', status: 'active' }); await user.save();
    void sendTemplateEmail({ to: user.email, recipientName: user.name, templateKey: 'user_signup_welcome', data: { name: user.name, username: user.username, email: user.email }, relatedEntityType: 'User', relatedEntityId: String(user._id), category: 'authentication' }).catch(() => undefined);
    const emailResult = await sendVerification(user).catch((error) => ({ success: false, status: 'failed', message: error?.message || 'Verification email failed' }));
    res.cookie('user_token', signUserToken(user), cookieOptions(24 * 60 * 60 * 1000));
    res.status(201).json({ success: true, message: 'Account created. Please verify your email.', data: { user: safeUser(user), verificationEmailSent: Boolean(emailResult.success), emailMessage: emailResult.success ? undefined : 'Your account was created, but the verification email could not be sent. You can resend it later.' } });
  } catch (error: any) { res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.code === 11000 ? 'An account with that email or username already exists' : 'Could not create account' }); }
});

router.post('/login', createRateLimiter(10, 15 * 60 * 1000), async (req, res) => {
  try {
    const identifier = String(req.body.identifier || req.body.email || '').trim(); const password = String(req.body.password || '');
    const adminEmail = normalizeEmail(identifier); const admin = await AdminUser.findOne({ email: adminEmail });
    if (admin && req.body.accountType !== 'user') {
      const valid = await bcrypt.compare(password, admin.password); if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      const token = jwt.sign({ id: String(admin._id), role: admin.role, type: 'admin' }, tokenSecret(), { expiresIn: '1d' }); res.cookie('admin_token', token, cookieOptions(24 * 60 * 60 * 1000)); return res.json({ success: true, message: 'Login successful', data: { user: { id: String(admin._id), name: admin.name, email: admin.email, role: admin.role } } });
    }
    const username = normalizeUsername(identifier); const user: any = await User.findOne({ $or: [{ email: adminEmail }, { username }] }).select('+password');
    if (!user || user.status !== 'active' || (user.lockedUntil && user.lockedUntil.getTime() > Date.now())) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const valid = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!valid) { user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1; if (user.failedLoginAttempts >= 5) { user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); user.failedLoginAttempts = 0; } await user.save(); return res.status(401).json({ success: false, message: 'Invalid credentials' }); }
    user.failedLoginAttempts = 0; user.lockedUntil = undefined; user.lastLoginAt = new Date(); user.lastLoginIp = req.ip || ''; await user.save(); const token = signUserToken(user, Boolean(req.body.rememberMe)); res.cookie('user_token', token, cookieOptions(req.body.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)); res.json({ success: true, message: 'Login successful', data: { user: safeUser(user) } });
  } catch { res.status(401).json({ success: false, message: 'Invalid credentials' }); }
});

router.post('/logout', (req, res) => { const type = req.body?.type || req.query.type || 'admin'; if (type === 'user') res.clearCookie('user_token', cookieOptions(0)); else res.clearCookie('admin_token', cookieOptions(0)); res.json({ success: true, message: 'Logged out successfully' }); });

router.get('/me', async (req, res) => {
  try {
    if (req.query.type === 'admin' || (!req.query.type && req.cookies?.admin_token)) { const decoded: any = jwt.verify(req.cookies.admin_token, tokenSecret()); const admin = await AdminUser.findById(decoded.id).select('-password'); if (!admin) return res.status(401).json({ success: false, message: 'Admin session expired' }); return res.json({ success: true, data: { user: { id: String(admin._id), name: admin.name, email: admin.email, role: admin.role }, accountType: 'admin' } }); }
    const token = req.cookies?.user_token; if (!token) return res.status(401).json({ success: false, message: 'Authentication required' }); const decoded: any = jwt.verify(token, tokenSecret()); const user: any = await User.findById(decoded.id); if (!user || user.status !== 'active' || decoded.type !== 'user' || decoded.sessionVersion !== (user.sessionVersion || 0)) return res.status(401).json({ success: false, message: 'User session expired' }); res.json({ success: true, data: { user: safeUser(user), accountType: 'user' } });
  } catch { res.status(401).json({ success: false, message: 'Authentication required' }); }
});

router.post('/refresh', requireUser, async (req: AuthRequest, res) => { const user: any = await User.findById(req.user?.id); if (!user) return res.status(401).json({ success: false, message: 'Session expired' }); res.cookie('user_token', signUserToken(user), cookieOptions(24 * 60 * 60 * 1000)); res.json({ success: true, data: { user: safeUser(user) } }); });

async function completeEmailVerification(user: any) {
  user.emailVerified = true;
  user.emailVerifiedAt = new Date();
  clearVerificationFields(user);
  await user.save();
  void sendTemplateEmail({ to: user.email, recipientName: user.name, templateKey: 'user_email_verified', data: { name: user.name, username: user.username, email: user.email }, relatedEntityType: 'User', relatedEntityId: String(user._id), category: 'authentication' }).catch(() => undefined);
}

async function verifyEmailLink(req: any, res: any) {
  const token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
  if (!token) return res.status(400).json({ success: false, message: 'Verification token is required' });
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user: any = await User.findOne({ emailVerified: { $ne: true }, emailVerificationTokenHash: tokenHash, $or: [{ emailVerificationTokenExpiresAt: { $gt: new Date() } }, { emailVerificationExpiresAt: { $gt: new Date() } }] }).select('+emailVerificationTokenHash +emailVerificationCodeHash +emailVerificationTokenExpiresAt +emailVerificationExpiresAt +emailVerificationCodeExpiresAt');
  if (!user || !safeHashMatches(token, user.emailVerificationTokenHash)) return res.status(400).json({ success: false, message: 'This verification link is invalid or expired' });
  await completeEmailVerification(user);
  return res.json({ success: true, message: 'Email verified successfully' });
}

const verifyLinkLimiter = createRateLimiter(10, 15 * 60 * 1000);
router.post('/verify-email-link', verifyLinkLimiter, verifyEmailLink);
// Backward-compatible POST endpoint used by earlier frontend builds. GET never changes state.
router.post('/verify-email', verifyLinkLimiter, verifyEmailLink);

router.post('/verify-email-code', createRateLimiter(20, 15 * 60 * 1000), async (req, res) => {
  const email = normalizeEmail(req.body.email); const code = typeof req.body.code === 'string' ? req.body.code.trim() : '';
  if (!validEmail(email) || !/^\d{6}$/.test(code)) return res.status(400).json({ success: false, message: 'The verification code is invalid or expired' });
  const user: any = await User.findOne({ email, emailVerified: { $ne: true } }).select('+emailVerificationCodeHash +emailVerificationTokenHash +emailVerificationCodeExpiresAt +emailVerificationTokenExpiresAt +emailVerificationExpiresAt');
  const now = Date.now();
  if (!user) return res.status(400).json({ success: false, message: 'The verification code is invalid or expired' });
  if (user.emailVerificationLockedUntil && new Date(user.emailVerificationLockedUntil).getTime() > now) return res.status(429).json({ success: false, code: 'EMAIL_VERIFICATION_LOCKED', message: 'Verification is temporarily locked. Please try again later.' });
  if (!user.emailVerificationCodeExpiresAt || new Date(user.emailVerificationCodeExpiresAt).getTime() <= now || !safeHashMatches(code, user.emailVerificationCodeHash)) {
    user.emailVerificationCodeAttempts = Number(user.emailVerificationCodeAttempts || 0) + 1;
    if (user.emailVerificationCodeAttempts >= VERIFICATION_CODE_ATTEMPT_LIMIT) { user.emailVerificationLockedUntil = new Date(now + VERIFICATION_CODE_LOCK_MS); user.emailVerificationCodeAttempts = 0; }
    await user.save();
    return res.status(400).json({ success: false, message: 'The verification code is invalid or expired' });
  }
  await completeEmailVerification(user);
  return res.json({ success: true, message: 'Email verified successfully' });
});

const resendVerificationLimiter = createRateLimiter(5, 60 * 60 * 1000);
router.post('/resend-verification', resendVerificationLimiter, async (req, res) => {
  const generic = 'If an unverified account exists, a new verification email will be sent. Please wait at least 60 seconds between requests.';
  const email = normalizeEmail(req.body.email);
  if (!validEmail(email)) return res.json({ success: true, message: generic });
  const user: any = await User.findOne({ email, emailVerified: { $ne: true } });
  if (!user) return res.json({ success: true, message: generic });
  const availability = verificationSendAvailable(user);
  if (!availability.available || availability.exhausted) return res.json({ success: true, message: generic });
  await sendVerification(user, 'user_verification_resend').catch(() => undefined);
  return res.json({ success: true, message: generic });
});

router.post('/forgot-password', createRateLimiter(3, 15 * 60 * 1000), async (req, res) => { const email = normalizeEmail(req.body.email); const user: any = await User.findOne({ email, status: 'active' }); if (user) void sendPasswordReset(user).catch(() => undefined); res.json({ success: true, message: 'If an account exists for that email, password reset instructions will be sent.' }); });

router.post('/reset-password', createRateLimiter(5, 15 * 60 * 1000), async (req, res) => { const token = String(req.body.token || ''); const password = String(req.body.password || ''); const confirmPassword = String(req.body.confirmPassword || ''); if (!validPassword(password) || password !== confirmPassword) return res.status(400).json({ success: false, message: 'Passwords must match and contain at least 8 characters, a letter, and a number' }); const user: any = await User.findOne({ passwordResetTokenHash: hashToken(token), passwordResetExpiresAt: { $gt: new Date() } }).select('+passwordResetTokenHash'); if (!user) return res.status(400).json({ success: false, message: 'This reset link is invalid or expired' }); user.password = await bcrypt.hash(password, 12); user.passwordResetTokenHash = ''; user.passwordResetExpiresAt = undefined; user.sessionVersion = (user.sessionVersion || 0) + 1; await user.save(); void sendTemplateEmail({ to: user.email, recipientName: user.name, templateKey: 'user_password_reset_success', data: { name: user.name, username: user.username, email: user.email }, relatedEntityType: 'User', relatedEntityId: String(user._id), category: 'authentication' }).catch(() => undefined); res.json({ success: true, message: 'Password reset successfully' }); });

router.patch('/change-password', requireUser, async (req: AuthRequest, res) => { const currentPassword = String(req.body.currentPassword || ''); const password = String(req.body.password || ''); const confirmPassword = String(req.body.confirmPassword || ''); if (!validPassword(password) || password !== confirmPassword) return res.status(400).json({ success: false, message: 'New passwords must match and contain at least 8 characters, a letter, and a number' }); const user: any = await User.findById(req.user?.id).select('+password'); if (!user?.password || !await bcrypt.compare(currentPassword, user.password)) return res.status(400).json({ success: false, message: 'Current password is incorrect' }); user.password = await bcrypt.hash(password, 12); user.sessionVersion = (user.sessionVersion || 0) + 1; await user.save(); void sendTemplateEmail({ to: user.email, recipientName: user.name, templateKey: 'user_password_changed', data: { name: user.name, username: user.username, email: user.email }, relatedEntityType: 'User', relatedEntityId: String(user._id), category: 'authentication' }).catch(() => undefined); res.json({ success: true, message: 'Password changed successfully. Please sign in again.' }); });

export default router;
