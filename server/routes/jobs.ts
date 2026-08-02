import { Router } from "express";
import mongoose from "mongoose";
import { Job } from "../models/Job";
import { Currency } from "../models/Currency";
import { PaymentAccount } from "../models/PaymentAccount";
import { JobApplication } from "../models/JobApplication";
import { authenticate } from "../middleware/auth";

const router = Router();
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);

async function uniqueSlug(value: string, id?: string) {
  const base = slugify(value) || `job-${Date.now()}`;
  let slug = base;
  let count = 1;
  while (await Job.exists({ slug, ...(id ? { _id: { $ne: id } } : {}) })) slug = `${base}-${count++}`;
  return slug;
}

function cleanList(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  return undefined;
}

function normalizeJobPayload(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  const fields = ["title", "department", "location", "workType", "experienceLevel", "description", "applicationInstructions", "applicationWhatsAppNumber", "applicationWhatsAppMessage"];
  for (const field of fields) if (body[field] !== undefined) payload[field] = String(body[field] ?? "").trim();
  if (body.status !== undefined) payload.status = String(body.status);
  for (const field of ["applicationFeeEnabled", "applicationFeeRequired", "allowWhatsAppApplication", "requirePaymentScreenshot", "requireTransactionId", "applicationsOpen"]) {
    if (body[field] !== undefined) payload[field] = typeof body[field] === "boolean" ? body[field] : String(body[field]) === "true";
  }
  for (const field of ["applicationFeeAmount", "maxApplications"]) {
    if (body[field] !== undefined && body[field] !== "") payload[field] = Number(body[field]);
  }
  for (const field of ["deadline", "applicationDeadline"]) if (body[field] !== undefined && body[field] !== "") payload[field] = new Date(String(body[field]));
  const responsibilities = cleanList(body.responsibilities);
  const requirements = cleanList(body.requirements);
  if (responsibilities) payload.responsibilities = responsibilities;
  if (requirements) payload.requirements = requirements;
  if (body.applicationFeeCurrencyId !== undefined) payload.applicationFeeCurrencyId = body.applicationFeeCurrencyId || undefined;
  if (body.allowedPaymentAccountIds !== undefined) {
    const value = Array.isArray(body.allowedPaymentAccountIds) ? body.allowedPaymentAccountIds : String(body.allowedPaymentAccountIds).split(",");
    payload.allowedPaymentAccountIds = value.filter((id) => mongoose.isValidObjectId(String(id))).map(String);
  }
  return payload;
}

async function validatePaymentConfig(payload: Record<string, unknown>) {
  if (!payload.applicationFeeEnabled) return;
  if (Number(payload.applicationFeeAmount || 0) < 0) throw new Error("Application fee cannot be negative");
  if (payload.applicationFeeCurrencyId && !mongoose.isValidObjectId(String(payload.applicationFeeCurrencyId))) throw new Error("Invalid application fee currency");
  if (payload.applicationFeeCurrencyId) {
    const currency = await Currency.findOne({ _id: payload.applicationFeeCurrencyId, isActive: true });
    if (!currency) throw new Error("Selected currency is not active");
  }
  const ids = Array.isArray(payload.allowedPaymentAccountIds) ? payload.allowedPaymentAccountIds : [];
  if (ids.length) {
    const count = await PaymentAccount.countDocuments({ _id: { $in: ids }, isActive: true });
    if (count !== ids.length) throw new Error("All selected payment accounts must be active");
  }
}

router.get("/", async (_req, res) => {
  try {
    const items = await Job.find({ status: "open", applicationsOpen: { $ne: false } }).populate("applicationFeeCurrencyId", "name code symbol prefix suffix").sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: items });
  } catch { res.status(500).json({ success: false, message: "Could not fetch jobs" }); }
});

router.get("/admin", authenticate, async (_req, res) => {
  const items = await Job.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: items });
});

router.get("/admin/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid job id" });
  const item = await Job.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ success: false, message: "Job not found" });
  res.json({ success: true, data: item });
});

router.get("/:idOrSlug", async (req, res) => {
  try {
    const item = mongoose.isValidObjectId(req.params.idOrSlug) ? await Job.findOne({ _id: req.params.idOrSlug, status: "open" }).populate("applicationFeeCurrencyId", "name code symbol prefix suffix").lean() : await Job.findOne({ slug: req.params.idOrSlug, status: "open" }).populate("applicationFeeCurrencyId", "name code symbol prefix suffix").lean();
    if (!item) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, data: item });
  } catch { res.status(400).json({ success: false, message: "Invalid job reference" }); }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const payload = normalizeJobPayload(req.body);
    if (!payload.title) return res.status(400).json({ success: false, message: "Job title is required" });
    await validatePaymentConfig(payload);
    const item = await Job.create({ ...payload, slug: await uniqueSlug(String(req.body.slug || payload.title)) });
    res.status(201).json({ success: true, message: "Job created successfully", data: item });
  } catch (error: any) {
    res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.code === 11000 ? "Slug already exists" : error?.message || "Invalid job" });
  }
});

async function updateJob(req: any, res: any) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid job id" });
    const payload = normalizeJobPayload(req.body);
    await validatePaymentConfig(payload);
    if (req.body.slug !== undefined || req.body.title !== undefined) payload.slug = await uniqueSlug(String(req.body.slug || req.body.title || "job"), req.params.id);
    const item = await Job.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, message: "Job updated successfully", data: item });
  } catch (error: any) { res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.code === 11000 ? "Slug already exists" : error?.message || "Invalid job" }); }
}

router.put("/:id", authenticate, updateJob);
router.patch("/:id", authenticate, updateJob);

router.delete("/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid job id" });
  const item = await Job.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Job not found" });
  res.json({ success: true, message: "Job deleted successfully" });
});

export default router;
