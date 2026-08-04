import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; kind: 'admin' | 'user'; emailVerified?: boolean };
}

const secret = () => process.env.JWT_SECRET || 'your_jwt_secret';

function readToken(req: Request, cookieName: string) {
  return req.cookies?.[cookieName] || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '');
}

export function signUserToken(user: { _id: unknown; sessionVersion?: number; emailVerified?: boolean }, remember = false) {
  return jwt.sign({ id: String(user._id), role: 'user', type: 'user', sessionVersion: user.sessionVersion || 0, emailVerified: Boolean(user.emailVerified) }, secret(), { expiresIn: remember ? '30d' : '1d' });
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = readToken(req, 'admin_token');
  if (!token) { res.status(401).json({ message: 'Authentication required' }); return; }
  try {
    const decoded = jwt.verify(token, secret()) as { id: string; role: string; type?: string };
    if (decoded.type === 'user') { res.status(403).json({ message: 'Admin authentication required' }); return; }
    req.user = { id: decoded.id, role: decoded.role, kind: 'admin' };
    next();
  } catch { res.status(401).json({ message: 'Invalid token' }); }
};

async function resolvePublicUser(req: AuthRequest) {
  const token = readToken(req, 'user_token');
  if (!token) return null;
  const decoded = jwt.verify(token, secret()) as { id: string; role: string; type?: string; sessionVersion?: number };
  if (decoded.type !== 'user' || decoded.role !== 'user') return null;
  const user: any = await User.findById(decoded.id).select('+emailVerificationTokenHash +passwordResetTokenHash');
  if (!user || user.status !== 'active' || (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) || (decoded.sessionVersion ?? 0) !== (user.sessionVersion || 0)) return null;
  return user;
}

export const optionalUser = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  try { const user: any = await resolvePublicUser(req); if (user) req.user = { id: String(user._id), role: 'user', kind: 'user', emailVerified: user.emailVerified }; next(); }
  catch { next(); }
};

export const requireUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user: any = await resolvePublicUser(req);
    if (!user) { res.status(401).json({ success: false, message: 'User authentication required' }); return; }
    req.user = { id: String(user._id), role: 'user', kind: 'user', emailVerified: user.emailVerified }; next();
  } catch { res.status(401).json({ success: false, message: 'Invalid or expired user session' }); }
};

export const requireVerifiedUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  await requireUser(req, res, () => {
    if (!req.user?.emailVerified) { res.status(403).json({ success: false, code: 'EMAIL_VERIFICATION_REQUIRED', message: 'Please verify your email before continuing.' }); return; }
    next();
  });
};
