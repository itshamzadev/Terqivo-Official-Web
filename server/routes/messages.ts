import { Router } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { ContactMessage } from '../models/ContactMessage';
import { SiteSettings } from '../models/SiteSettings';
import { authenticate } from '../middleware/auth';
import { sendTemplateEmail } from '../utils/emailService';
import { createRateLimiter } from '../middleware/rateLimit';

const router = Router();
const emailIsValid = (value: unknown) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const clean = (value: unknown) => typeof value === 'string' ? value.trim() : '';

router.post('/', createRateLimiter(5, 15 * 60 * 1000), async (req, res) => {
  try {
    const fullName = clean(req.body.fullName || req.body.name); const email = clean(req.body.email).toLowerCase(); const subject = clean(req.body.subject); const message = clean(req.body.message);
    if (fullName.length < 2 || !emailIsValid(email) || subject.length < 2 || message.length < 5) return res.status(400).json({ success: false, message: 'Name, valid email, subject, and message are required' });
    const item = await ContactMessage.create({ fullName, email, phone: clean(req.body.phone), company: clean(req.body.company), subject, message, referenceNumber: `MSG-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}` });
    const settings = await SiteSettings.getSettings();
    if (settings.email?.sendContactFormEmails !== false) {
      void sendTemplateEmail({ to: email, templateKey: 'contact_message_received', data: { applicantName: fullName, subject, referenceNumber: item.referenceNumber }, relatedEntityType: 'ContactMessage', relatedEntityId: String(item._id), category: 'contact' }).catch(() => undefined);
      void sendTemplateEmail({ to: settings.email?.adminNotificationEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'support@terqivo.com', templateKey: 'contact_admin_notification', data: { applicantName: fullName, email, subject, message, adminUrl: `${process.env.APP_URL || ''}/admin/messages` }, relatedEntityType: 'ContactMessage', relatedEntityId: String(item._id), category: 'contact' }).catch(() => undefined);
    }
    res.status(201).json({ success: true, message: 'Message sent successfully', data: { referenceNumber: item.referenceNumber } });
  } catch (error: any) { res.status(400).json({ success: false, message: error?.message || 'Could not submit message' }); }
});

router.get('/', authenticate, async (req, res) => {
  const filter: any = {}; if (['unread', 'read', 'resolved', 'archived'].includes(String(req.query.status))) filter.status = req.query.status;
  const items = await ContactMessage.find(filter).sort({ createdAt: -1 }); res.json({ success: true, data: items });
});

router.get('/:id', authenticate, async (req, res) => { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid message id' }); const item = await ContactMessage.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Message not found' }); res.json({ success: true, data: item }); });

router.put('/:id/read', authenticate, async (req, res) => { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid message id' }); const item = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status === 'resolved' ? 'resolved' : 'read' }, { new: true }); if (!item) return res.status(404).json({ success: false, message: 'Not found' }); res.json({ success: true, message: 'Message updated', data: item }); });
router.patch('/:id/status', authenticate, async (req, res) => { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid message id' }); if (!['unread', 'read', 'resolved', 'archived'].includes(req.body.status)) return res.status(400).json({ success: false, message: 'Invalid status' }); const item = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }); if (!item) return res.status(404).json({ success: false, message: 'Not found' }); res.json({ success: true, data: item }); });

router.post('/:id/reply', authenticate, async (req: any, res) => { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid message id' }); const item: any = await ContactMessage.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Message not found' }); const reply = clean(req.body.message); if (!reply) return res.status(400).json({ success: false, message: 'Reply message is required' }); const result = await sendTemplateEmail({ to: item.email, templateKey: 'contact_custom_reply', data: { applicantName: item.fullName, subject: item.subject, adminReply: reply }, relatedEntityType: 'ContactMessage', relatedEntityId: String(item._id), sentBy: req.user?.id, category: 'contact' }); item.replyHistory.push({ subject: clean(req.body.subject) || `Re: ${item.subject}`, messageSummary: reply.slice(0, 200), recipient: item.email, sentAt: new Date(), sentBy: req.user?.id, status: result.status, errorSummary: result.message || '' }); item.status = 'resolved'; await item.save(); res.status(result.success ? 200 : 503).json({ success: result.success, message: result.success ? 'Reply sent' : result.message, data: item }); });

router.delete('/:id', authenticate, async (req, res) => { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid message id' }); const item = await ContactMessage.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Not found' }); res.json({ success: true, message: 'Deleted successfully' }); });

export default router;
