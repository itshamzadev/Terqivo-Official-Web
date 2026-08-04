import { Router } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { CourseEnrollmentRequest } from '../models/CourseEnrollmentRequest';
import { JobApplication } from '../models/JobApplication';
import { ContactMessage } from '../models/ContactMessage';
import { requireUser, type AuthRequest } from '../middleware/auth';
import { sendVerification } from './auth';
import { verificationSendAvailable } from '../utils/emailVerification';

const router = Router();
const usernamePattern = /^[a-z0-9_.]{3,30}$/;

router.use(requireUser);

router.get('/', async (req: AuthRequest, res) => {
  const user: any = await User.findById(req.user?.id).lean(); if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const [enrollments, applications] = await Promise.all([CourseEnrollmentRequest.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).select('-paymentScreenshot').lean(), JobApplication.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).select('applicationNumber jobTitleSnapshot paymentStatus applicationStatus status createdAt').lean()]);
  res.json({ success: true, data: { user: { id: String(user._id), name: user.name, email: user.email, username: user.username, avatar: user.avatar, emailVerified: user.emailVerified, status: user.status, role: user.role, createdAt: user.createdAt, lastLoginAt: user.lastLoginAt }, recentEnrollments: enrollments, recentApplications: applications, allEnrollments: enrollments, allApplications: applications } });
});

router.patch('/profile', async (req: AuthRequest, res) => {
  const user: any = await User.findById(req.user?.id); if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (req.body.email !== undefined) return res.status(400).json({ success: false, message: 'Email changes are not available without reverification' });
  if (req.body.name !== undefined) { const name = String(req.body.name).trim().replace(/\s+/g, ' '); if (name.length < 2 || name.length > 100) return res.status(400).json({ success: false, message: 'Name must be between 2 and 100 characters' }); user.name = name; }
  if (req.body.username !== undefined) { const username = String(req.body.username).trim().toLowerCase(); if (!usernamePattern.test(username)) return res.status(400).json({ success: false, message: 'Invalid username' }); if (await User.exists({ username, _id: { $ne: user._id } })) return res.status(409).json({ success: false, message: 'Username is already in use' }); user.username = username; }
  await user.save(); res.json({ success: true, data: { user: { id: String(user._id), name: user.name, email: user.email, username: user.username, avatar: user.avatar, emailVerified: user.emailVerified, status: user.status, role: 'user', createdAt: user.createdAt } } });
});

router.post('/resend-verification', async (req: AuthRequest, res) => { const user: any = await User.findById(req.user?.id); if (!user) return res.status(404).json({ success: false, message: 'User not found' }); if (user.emailVerified) return res.status(400).json({ success: false, message: 'Email is already verified' }); const availability = verificationSendAvailable(user); if (!availability.available || availability.exhausted) return res.status(429).json({ success: false, message: 'Please wait before requesting another verification email.' }); const result = await sendVerification(user, 'user_verification_resend'); res.status(result.success ? 200 : 503).json({ success: result.success, message: result.success ? 'Verification email sent' : 'Verification email could not be sent. Please try again later.' }); });

router.get('/enrollments', async (req: AuthRequest, res) => { const items = await CourseEnrollmentRequest.find({ userId: req.user?.id }).sort({ createdAt: -1 }).select('-paymentScreenshot').lean(); res.json({ success: true, data: items }); });
router.get('/job-applications', async (req: AuthRequest, res) => { const items = await JobApplication.find({ userId: req.user?.id }).sort({ createdAt: -1 }).select('-resumePath -paymentScreenshotPath').lean(); res.json({ success: true, data: items }); });
router.get('/contact-messages', async (req: AuthRequest, res) => { const items = await ContactMessage.find({ userId: req.user?.id }).sort({ createdAt: -1 }).lean(); res.json({ success: true, data: items }); });

export default router;
