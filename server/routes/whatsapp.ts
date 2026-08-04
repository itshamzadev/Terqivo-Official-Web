import { Router } from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/auth";
import { SiteSettings } from "../models/SiteSettings";
import { WhatsAppLog } from "../models/WhatsAppLog";
import { getWhatsAppStatus, sendAdminWhatsApp } from "../utils/whatsappService";

const router = Router();
const allowedFields = ["enabled", "adminPhone", "notifyOnContact", "notifyOnCourseEnrollment", "notifyOnJobApplication", "notifyOnPayment", "notifyOnEmail"];

router.get("/settings", authenticate, async (_req, res) => {
  const status = await getWhatsAppStatus();
  res.json({ success: true, data: status });
});

router.patch("/settings", authenticate, async (req, res) => {
  try {
    const settings: any = await SiteSettings.getSettings();
    const safe = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowedFields.includes(key)));
    settings.whatsapp = { ...settings.whatsapp, ...safe };
    await settings.save();
    res.json({ success: true, data: await getWhatsAppStatus(), message: "WhatsApp settings updated" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Could not update WhatsApp settings" });
  }
});

router.post("/test", authenticate, async (req: any, res) => {
  const result = await sendAdminWhatsApp({
    eventType: "system",
    message: "*Terqivo WhatsApp test*\n\nYour admin WhatsApp notification integration is working.",
    relatedEntityType: "WhatsAppTest",
  });
  res.status(result.success ? 200 : 503).json({ success: result.success, message: result.message, data: result });
});

router.get("/logs", authenticate, async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 50)));
  const filter: any = {};
  if (["sent", "failed", "skipped"].includes(String(req.query.status))) filter.status = req.query.status;
  if (req.query.eventType) filter.eventType = String(req.query.eventType);
  const [items, total] = await Promise.all([
    WhatsAppLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    WhatsAppLog.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

router.get("/logs/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid WhatsApp log id" });
  const item = await WhatsAppLog.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ success: false, message: "WhatsApp log not found" });
  res.json({ success: true, data: item });
});

export default router;
