import { Router } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { CourseEnrollmentRequest } from '../models/CourseEnrollmentRequest';
import { JobApplication } from '../models/JobApplication';
import { ContactMessage } from '../models/ContactMessage';
import { UserAuditLog } from '../models/UserAuditLog';
import { authenticate, type AuthRequest } from '../middleware/auth';
import { sendTemplateEmail } from '../utils/emailService';
import { sendVerification } from './auth';
import { verificationSendAvailable } from '../utils/emailVerification';

const router = Router(); router.use(authenticate);
const validStatuses = ['active', 'suspended', 'disabled'];

router.get('/admin', async (req, res) => {
  const filter: any = {};
  if (validStatuses.includes(String(req.query.status))) filter.status = req.query.status;
  if (req.query.verified === 'true') filter.emailVerified = true; if (req.query.verified === 'false') filter.emailVerified = false;
  if (req.query.search) { const safe = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const regex = new RegExp(safe, 'i'); filter.$or = [{ name: regex }, { username: regex }, { email: regex }]; }
  const page = Math.max(1, Number(req.query.page || 1)); const limit = Math.min(100, Math.max(1, Number(req.query.limit || 50)));
  try {
    const [items, total] = await Promise.all([User.aggregate([{ $match: filter }, { $sort: { createdAt: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit }, { $lookup: { from: 'courseenrollmentrequests', localField: '_id', foreignField: 'userId', as: 'enrollments' } }, { $lookup: { from: 'jobapplications', localField: '_id', foreignField: 'userId', as: 'applications' } }, { $project: { _id: 1, name: 1, email: 1, username: 1, avatar: 1, authProvider: 1, emailVerified: 1, emailVerifiedAt: 1, emailVerificationLastSentAt: 1, status: 1, role: 1, lastLoginAt: 1, createdAt: 1, enrollmentCount: { $size: '$enrollments' }, applicationCount: { $size: '$applications' } } }]), User.countDocuments(filter)]);
    res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch { res.status(500).json({ success: false, message: 'Could not fetch public users' }); }
});

router.get('/admin/:id', async (req, res) => { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid user id' }); const user: any = await User.findById(req.params.id).select('-password -emailVerificationTokenHash -passwordResetTokenHash').lean(); if (!user) return res.status(404).json({ success: false, message: 'User not found' }); const [enrollments, applications, messages] = await Promise.all([CourseEnrollmentRequest.find({ userId: user._id }).sort({ createdAt: -1 }).lean(), JobApplication.find({ userId: user._id }).sort({ createdAt: -1 }).select('-resumePath -paymentScreenshotPath').lean(), ContactMessage.find({ userId: user._id }).sort({ createdAt: -1 }).lean()]); res.json({ success: true, data: { user, enrollments, applications, messages } }); });

router.patch('/admin/:id/status', async (req: AuthRequest, res) => { if (!mongoose.isValidObjectId(req.params.id) || !validStatuses.includes(req.body.status)) return res.status(400).json({ success: false, message: 'Invalid user or status' }); const user: any = await User.findById(req.params.id); if (!user) return res.status(404).json({ success: false, message: 'User not found' }); const previous = user.status; user.status = req.body.status; if (req.body.status === 'active') user.lockedUntil = undefined; user.sessionVersion = (user.sessionVersion || 0) + 1; await user.save(); await UserAuditLog.create({ userId: user._id, adminId: req.user?.id, action: `status_${req.body.status}`, details: `Changed from ${previous}` }); if (req.body.status === 'suspended') void sendTemplateEmail({ to: user.email, recipientName: user.name, templateKey: 'user_account_suspended', data: { name: user.name, username: user.username }, relatedEntityType: 'User', relatedEntityId: String(user._id), sentBy: req.user?.id, category: 'authentication' }).catch(() => undefined); if (previous === 'suspended' && req.body.status === 'active') void sendTemplateEmail({ to: user.email, recipientName: user.name, templateKey: 'user_account_reactivated', data: { name: user.name, username: user.username }, relatedEntityType: 'User', relatedEntityId: String(user._id), sentBy: req.user?.id, category: 'authentication' }).catch(() => undefined); res.json({ success: true, data: { user: user.toObject({ transform: (_doc: any, ret: any) => { delete ret.password; delete ret.emailVerificationTokenHash; delete ret.passwordResetTokenHash; return ret; } }) } }); });

router.post('/admin/:id/resend-verification', async (req: AuthRequest, res) => { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid user id' }); const user: any = await User.findById(req.params.id); if (!user) return res.status(404).json({ success: false, message: 'User not found' }); if (user.emailVerified) return res.status(400).json({ success: false, message: 'Email is already verified' }); const availability = verificationSendAvailable(user); if (!availability.available || availability.exhausted) return res.status(429).json({ success: false, message: 'Please wait before requesting another verification email.' }); const result = await sendVerification(user, 'user_verification_resend'); await UserAuditLog.create({ userId: user._id, adminId: req.user?.id, action: 'verification_email_resend', details: result.success ? 'Verification email sent' : 'Verification email delivery failed' }).catch(() => undefined); res.status(result.success ? 200 : 503).json({ success: result.success, message: result.success ? 'Verification email sent' : 'Verification email could not be sent' }); });

export default router;
