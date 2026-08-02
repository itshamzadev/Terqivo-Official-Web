import { Router } from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/auth";
import { EmailTemplate } from "../models/EmailTemplate";
import { EmailLog } from "../models/EmailLog";
import { SiteSettings } from "../models/SiteSettings";
import { ensureDefaultEmailTemplates, getTemplateDefinitions, renderTemplate, sendEmail, sendTemplateEmail, verifyEmailTransport } from "../utils/emailService";

const router = Router();
const validEmail = (value: unknown) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const safeKey = (value: unknown) => typeof value === "string" && /^[a-z0-9_]{3,100}$/.test(value);

const emailSettingFields = ['emailEnabled', 'senderName', 'senderEmail', 'replyToEmail', 'adminNotificationEmail', 'companyName', 'companyLogo', 'websiteUrl', 'supportPhone', 'supportWhatsApp', 'emailFooterText', 'emailSignature', 'sendAdminNotifications', 'sendApplicantConfirmations', 'sendCourseEnrollmentEmails', 'sendJobApplicationEmails', 'sendContactFormEmails', 'sendPaymentStatusEmails'];

router.get("/settings", authenticate, async (_req, res) => { const settings = await SiteSettings.getSettings(); res.json({ success: true, data: settings.email }); });
router.patch("/settings", authenticate, async (req, res) => { const settings: any = await SiteSettings.getSettings(); const safeEmail = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => emailSettingFields.includes(key))); settings.email = { ...settings.email, ...safeEmail }; await settings.save(); res.json({ success: true, data: settings.email, message: "Email settings updated" }); });

router.get("/templates", authenticate, async (_req, res) => {
  await ensureDefaultEmailTemplates();
  const items = await EmailTemplate.find().sort({ category: 1, key: 1 }).lean();
  res.json({ success: true, data: items });
});

router.get("/templates/:idOrKey", authenticate, async (req, res) => {
  const item = mongoose.isValidObjectId(req.params.idOrKey) ? await EmailTemplate.findById(req.params.idOrKey).lean() : await EmailTemplate.findOne({ key: req.params.idOrKey }).lean();
  if (!item) return res.status(404).json({ success: false, message: "Email template not found" }); res.json({ success: true, data: item });
});

router.patch("/templates/:id", authenticate, async (req: any, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid template id" });
  const item: any = await EmailTemplate.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: "Email template not found" });
  for (const field of ["subject", "htmlBody", "textBody", "name", "description"]) if (typeof req.body[field] === "string") item[field] = req.body[field];
  if (typeof req.body.enabled === "boolean") item.enabled = req.body.enabled;
  await item.save(); res.json({ success: true, data: item });
});

router.post("/templates/:id/preview", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid template id" });
  const item: any = await EmailTemplate.findById(req.params.id).lean(); if (!item) return res.status(404).json({ success: false, message: "Email template not found" });
  const data = typeof req.body.data === "object" && req.body.data ? req.body.data : {}; res.json({ success: true, data: { subject: renderTemplate(item.subject, data), html: renderTemplate(item.htmlBody, data), text: renderTemplate(item.textBody, data) } });
});

router.post("/templates/:id/test", authenticate, async (req: any, res) => {
  if (!mongoose.isValidObjectId(req.params.id) || !validEmail(req.body.recipient)) return res.status(400).json({ success: false, message: "Valid template and recipient are required" });
  const item: any = await EmailTemplate.findById(req.params.id).lean(); if (!item) return res.status(404).json({ success: false, message: "Email template not found" });
  const result = await sendEmail({ to: req.body.recipient.trim(), subject: renderTemplate(item.subject, req.body.data || {}), html: renderTemplate(item.htmlBody, req.body.data || {}), text: renderTemplate(item.textBody, req.body.data || {}), category: item.category, templateKey: item.key, sentBy: req.user?.id });
  res.status(result.success ? 200 : 503).json({ success: result.success, message: result.success ? "Test email sent" : result.message, data: result });
});

router.post("/templates/:id/reset", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid template id" });
  const item: any = await EmailTemplate.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: "Email template not found" });
  const definition = getTemplateDefinitions().find((entry) => entry.key === item.key); if (!definition) return res.status(404).json({ success: false, message: "Default template not found" });
  item.subject = definition.subject; item.htmlBody = `<p>Hello {{applicantName}},</p><p>{{body}}</p><p>Regards,<br>{{companyName}}</p>`; item.textBody = `Hello {{applicantName}},\n\n{{body}}\n\nRegards,\n{{companyName}}`; item.enabled = true; await item.save(); res.json({ success: true, data: item });
});

router.get("/logs", authenticate, async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1)); const limit = Math.min(100, Math.max(1, Number(req.query.limit || 25))); const filter: any = {};
  if (["pending", "sent", "failed", "skipped", "disabled"].includes(String(req.query.status))) filter.status = req.query.status;
  if (req.query.category) filter.category = String(req.query.category); if (req.query.recipient) filter.recipient = new RegExp(String(req.query.recipient).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const [items, total] = await Promise.all([EmailLog.find(filter).select("-htmlSnapshot -textSnapshot").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), EmailLog.countDocuments(filter)]);
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

router.get("/logs/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid email log id" }); const item = await EmailLog.findById(req.params.id).select("-htmlSnapshot -textSnapshot").lean(); if (!item) return res.status(404).json({ success: false, message: "Email log not found" }); res.json({ success: true, data: item });
});

router.post("/logs/:id/resend", authenticate, async (req: any, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid email log id" }); const item: any = await EmailLog.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: "Email log not found" }); if (item.status !== "failed") return res.status(409).json({ success: false, message: "Only failed emails can be resent" });
  const result = await sendEmail({ to: item.recipient, subject: item.subject, html: item.htmlSnapshot, text: item.textSnapshot, category: item.category, templateKey: item.templateKey, relatedEntityType: item.relatedEntityType, relatedEntityId: item.relatedEntityId ? String(item.relatedEntityId) : undefined, sentBy: req.user?.id }); res.status(result.success ? 200 : 503).json({ success: result.success, message: result.success ? "Email resent" : result.message, data: result });
});

router.post("/test", authenticate, async (req: any, res) => {
  if (!validEmail(req.body.recipient)) return res.status(400).json({ success: false, message: "A valid recipient email is required" });
  const result = await sendTemplateEmail({ to: req.body.recipient.trim(), templateKey: "test_email", data: { recipient: req.body.recipient.trim(), body: "This is a test email from the Terqivo admin dashboard." }, sentBy: req.user?.id, category: "system" }); res.status(result.success ? 200 : 503).json({ success: result.success, message: result.success ? "Test email sent" : result.message, data: result });
});

router.get("/verify", authenticate, async (_req, res) => { const result = await verifyEmailTransport(); res.status(result.success ? 200 : 503).json({ success: result.success, message: result.message, data: result }); });

export default router;
