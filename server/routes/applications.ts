import { Router } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import { JobApplication } from "../models/JobApplication";
import { Job } from "../models/Job";
import { Currency } from "../models/Currency";
import { PaymentAccount } from "../models/PaymentAccount";
import { authenticate } from "../middleware/auth";
import { createPrivateApplicationUpload, parsePrivateUploadReference, persistUploadedFile, privateUploadPath, removePrivateUpload, removeStoredUpload, sendStoredUpload, validateUploadedImage } from "../utils/uploads";
import { sendTemplateEmail } from "../utils/emailService";
import { createRateLimiter } from "../middleware/rateLimit";
import { optionalUser, type AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { SiteSettings } from "../models/SiteSettings";
import { formatWhatsAppMessage, sendAdminWhatsApp } from "../utils/whatsappService";

const router = Router();
const applicationUpload = createPrivateApplicationUpload(10 * 1024 * 1024);
const idIsValid = (id: string) => mongoose.isValidObjectId(id);
const emailIsValid = (value: unknown) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const makeApplicationNumber = () => `APP-${new Date().getFullYear()}-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;

function field(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function bool(value: unknown) { return value === true || value === "true" || value === "1"; }

async function sendApplicationEmails(item: any) {
  const linkedUser: any = item.userId ? await User.findById(item.userId).lean() : null; const recipient = linkedUser?.email || item.email;
  const data = { applicantName: item.applicantName || item.name, email: recipient, phone: item.phone, jobTitle: item.jobTitleSnapshot, applicationNumber: item.applicationNumber, status: item.applicationStatus || item.status, paymentStatus: item.paymentStatus, amount: item.paymentAmountSnapshot, currency: item.currencySnapshot?.code || "", transactionId: item.transactionId, adminUrl: `${process.env.APP_URL || ""}/admin/applications` };
  void sendAdminWhatsApp({
    eventType: "job",
    relatedEntityType: "JobApplication",
    relatedEntityId: String(item._id),
    message: formatWhatsAppMessage("New Job Application", [
      ["Applicant", item.applicantName || item.name], ["Email", item.email], ["Phone", item.phone], ["City", item.currentCity],
      ["Job", item.jobTitleSnapshot], ["Application #", item.applicationNumber], ["Payment", item.paymentStatus],
      ["Transaction ID", item.transactionId], ["Cover letter", item.coverLetter],
    ], data.adminUrl),
  }).catch((error) => console.warn("WhatsApp job notification failed:", error?.message || "unknown error"));
  const settingsEmail = (await import("../models/SiteSettings")).SiteSettings;
  const settings = await settingsEmail.getSettings();
  if (settings.email?.sendJobApplicationEmails === false) return;
  const applicant = settings.email?.sendApplicantConfirmations === false ? { status: "skipped", message: "Applicant confirmations are disabled" } : await sendTemplateEmail({ to: recipient, templateKey: "job_application_received", data, relatedEntityType: "JobApplication", relatedEntityId: String(item._id), category: "job" });
  if (settings.email?.sendAdminNotifications !== false) {
    const adminEmail = settings.email?.adminNotificationEmail || process.env.ADMIN_NOTIFICATION_EMAIL || "support@terqivo.com";
    await sendTemplateEmail({ to: adminEmail, templateKey: "job_application_admin_notification", data, relatedEntityType: "JobApplication", relatedEntityId: String(item._id), category: "job" });
  }
  if (item.paymentStatus === "submitted") await sendApplicationEventEmail(item, "job_payment_received", data);
  const entries = [applicant].filter((result) => result && result.status !== "skipped").map((result) => ({ recipient, templateKey: "job_application_received", subject: "Job application received", sentAt: new Date(), status: result.status, errorSummary: result.message || "" }));
  if (entries.length) await JobApplication.updateOne({ _id: item._id }, { $push: { emailHistory: { $each: entries } }, $set: { lastEmailSentAt: new Date() } }).catch(() => undefined);
}

async function sendApplicationEventEmail(item: any, templateKey: string, data: Record<string, unknown>, sentBy?: string) {
  const settings = await (await import("../models/SiteSettings")).SiteSettings.getSettings();
  if (templateKey.includes("payment") && settings.email?.sendPaymentStatusEmails === false) return { success: false, status: "skipped" as const, message: "Payment emails are disabled" };
  const linkedUser: any = item.userId ? await User.findById(item.userId).lean() : null; const recipient = linkedUser?.email || item.email;
  void sendAdminWhatsApp({
    eventType: templateKey.includes("payment") ? "payment" : "job",
    relatedEntityType: "JobApplication",
    relatedEntityId: String(item._id),
    message: formatWhatsAppMessage(`Job Application ${templateKey.includes("payment") ? "Payment Update" : "Status Update"}`, [
      ["Applicant", item.applicantName || item.name], ["Email", item.email], ["Job", item.jobTitleSnapshot],
      ["Application #", item.applicationNumber], ["Application status", item.applicationStatus], ["Payment status", item.paymentStatus],
      ["Amount", `${item.paymentAmountSnapshot || 0} ${item.currencySnapshot?.code || ""}`], ["Transaction ID", item.transactionId],
      ["Admin note", item.adminNote],
    ], `${process.env.APP_URL || ""}/admin/applications`),
  }).catch((error) => console.warn("WhatsApp job event notification failed:", error?.message || "unknown error"));
  const result = await sendTemplateEmail({ to: recipient, templateKey, data, relatedEntityType: "JobApplication", relatedEntityId: String(item._id), sentBy, category: templateKey.includes("payment") ? "payment" : "job" });
  await JobApplication.updateOne({ _id: item._id }, { $push: { emailHistory: { subject: templateKey, templateKey, recipient, sentAt: new Date(), sentBy, status: result.status, errorSummary: result.message || "" } }, $set: { lastEmailSentAt: new Date() } }).catch(() => undefined);
  return result;
}

router.post("/", createRateLimiter(5, 15 * 60 * 1000), optionalUser, (req, res, next) => {
  applicationUpload.fields([{ name: "resume", maxCount: 1 }, { name: "paymentScreenshot", maxCount: 1 }])(req, res, (error) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    next();
  });
}, async (req: AuthRequest & any, res) => {
  const files = (req.files || {}) as Record<string, Express.Multer.File[]>;
  const resume = files.resume?.[0];
  const screenshot = files.paymentScreenshot?.[0];
  let resumeReference = "";
  let screenshotReference = "";
  const cleanupUploadedFiles = () => {
    if (resumeReference.startsWith("private/gridfs/")) void removeStoredUpload(resumeReference);
    else if (resume) removePrivateUpload(resumeReference || `private/job-resumes/${resume.filename}`);
    if (screenshotReference.startsWith("private/gridfs/")) void removeStoredUpload(screenshotReference);
    else if (screenshot) removePrivateUpload(screenshotReference || `private/job-payment-screenshots/${screenshot.filename}`);
  };
  const fail = (status: number, message: string, code?: string) => { cleanupUploadedFiles(); return res.status(status).json({ success: false, ...(code ? { code } : {}), message }); };
  try {
    const jobId = field(req.body.jobId);
    if (!idIsValid(jobId)) return fail(400, "A valid job is required");
    const job = await Job.findOne({ _id: jobId, status: "open", applicationsOpen: { $ne: false } });
    if (!job) return fail(404, "This job is no longer accepting applications");
    if (job.applicationDeadline && new Date(job.applicationDeadline).getTime() < Date.now()) return fail(409, "The application deadline has passed");
    if (job.maxApplications && await JobApplication.countDocuments({ jobId }) >= job.maxApplications) return fail(409, "The maximum number of applications has been reached");

    const settings = await SiteSettings.getSettings(); const accountUser: any = req.user?.kind === "user" ? await User.findById(req.user.id) : null;
    if (settings.userAccess?.requireAccountForJobApplication && !accountUser) return fail(401, "Please log in before submitting a job application");
    if (settings.userAccess?.requireVerifiedEmailForJobApplication && accountUser && !accountUser.emailVerified) return fail(403, "Please verify your email before continuing.", "EMAIL_VERIFICATION_REQUIRED");
    const applicantName = accountUser?.name || field(req.body.fullName || req.body.name);
    const email = accountUser?.email || field(req.body.email).toLowerCase();
    const phone = field(req.body.phone);
    if (applicantName.length < 2 || !emailIsValid(email) || phone.length < 5 || field(req.body.currentCity).length < 2 || field(req.body.coverLetter).length < 10) return fail(400, "Name, email, phone, city, and cover letter are required");
    if (!resume && !field(req.body.cvUrl)) return fail(400, "A resume upload or resume URL is required");
    if (await JobApplication.exists({ jobId, email, createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) } })) return fail(409, "A recent application for this job already exists");

    const paymentSelected = job.applicationFeeEnabled && (job.applicationFeeRequired || bool(req.body.wantsToPay));
    let currency: any = null;
    if (job.applicationFeeCurrencyId) currency = await Currency.findOne({ _id: job.applicationFeeCurrencyId, isActive: true }).lean();
    if (!currency) currency = await Currency.findOne({ isDefault: true, isActive: true }).lean();
    let account: any = null;
    if (paymentSelected) {
      const accountId = field(req.body.paymentAccountId);
      if (!idIsValid(accountId)) return fail(400, "Select an active payment account");
      const allowedIds = (job.allowedPaymentAccountIds || []).map(String);
      if (allowedIds.length && !allowedIds.includes(accountId)) return fail(400, "That payment account is not available for this job");
      account = await PaymentAccount.findOne({ _id: accountId, isActive: true }).lean();
      if (!account) return fail(400, "Selected payment account is not active");
      const transactionRequired = job.requireTransactionId || account.requiresTransactionId;
      if (transactionRequired && !field(req.body.transactionId)) return fail(400, "Transaction/reference number is required");
      if ((job.requirePaymentScreenshot || job.applicationFeeRequired) && !screenshot) return fail(400, "Payment screenshot is required");
      if (screenshot && !await validateUploadedImage(screenshot)) return fail(400, "Payment screenshot is not a valid image");
    }

    if (resume) resumeReference = (await persistUploadedFile(resume, "job-resumes", "private")).reference;
    if (paymentSelected && screenshot) screenshotReference = (await persistUploadedFile(screenshot, "job-payment-screenshots", "private")).reference;
    else if (screenshot) removePrivateUpload(`private/job-payment-screenshots/${screenshot.filename}`);

    const values = [account?.bankName, account?.accountNumber, account?.iban, account?.walletNumber].filter(Boolean).join(" | ");
    const paymentStatus = paymentSelected ? "submitted" : job.applicationFeeEnabled ? "unpaid" : "not-required";
    const item = await JobApplication.create({
      applicationNumber: makeApplicationNumber(), jobId, userId: accountUser?._id, jobTitleSnapshot: job.title, applicantName, applicantUsernameSnapshot: accountUser?.username || "", name: applicantName, email, phone,
      currentCity: field(req.body.currentCity), country: field(req.body.country), coverLetter: field(req.body.coverLetter), applicantMessage: field(req.body.applicantMessage),
      portfolioUrl: field(req.body.portfolioUrl), linkedInUrl: field(req.body.linkedInUrl), githubUrl: field(req.body.githubUrl), cvUrl: field(req.body.cvUrl),
      resumePath: resumeReference, paymentRequiredSnapshot: Boolean(job.applicationFeeEnabled && job.applicationFeeRequired), paymentAmountSnapshot: paymentSelected ? Number(job.applicationFeeAmount || 0) : 0,
      currencySnapshot: currency ? { name: currency.name, code: currency.code, symbol: currency.symbol, prefix: currency.prefix, suffix: currency.suffix } : {}, paymentAccountId: account?._id,
      paymentAccountSnapshot: account ? `${account.accountTitle}${values ? `: ${values}` : ""}` : "", transactionId: paymentSelected ? field(req.body.transactionId) : "", paymentScreenshotPath: screenshotReference, paymentStatus,
      status: "pending", applicationStatus: "submitted",
    });
    void sendApplicationEmails(item).catch((error) => console.warn("Job application email notification failed:", error?.message || "unknown error"));
    res.status(201).json({ success: true, message: "Application submitted successfully", data: { applicationNumber: item.applicationNumber, paymentStatus: item.paymentStatus } });
  } catch (error: any) {
    cleanupUploadedFiles();
    res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.code === 11000 ? "Could not generate a unique application number" : error?.message || "Could not submit application" });
  }
});

router.get("/", authenticate, async (req, res) => {
  const filter: any = {};
  if (["submitted", "under-review", "shortlisted", "interview", "selected", "hired", "rejected", "withdrawn"].includes(String(req.query.applicationStatus))) filter.applicationStatus = req.query.applicationStatus;
  if (["not-required", "unpaid", "submitted", "verified", "rejected"].includes(String(req.query.paymentStatus))) filter.paymentStatus = req.query.paymentStatus;
  if (req.query.jobId && idIsValid(String(req.query.jobId))) filter.jobId = req.query.jobId;
  if (req.query.search) { const regex = new RegExp(String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"); filter.$or = [{ applicationNumber: regex }, { applicantName: regex }, { name: regex }, { email: regex }, { phone: regex }, { jobTitleSnapshot: regex }]; }
  const page = Math.max(1, Number(req.query.page || 1)); const limit = Math.min(100, Math.max(1, Number(req.query.limit || 50)));
  const [items, total] = await Promise.all([JobApplication.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), JobApplication.countDocuments(filter)]);
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

router.get("/:id/resume", authenticate, async (req: any, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid application id" });
  const item: any = await JobApplication.findById(req.params.id).lean();
  if (!item?.resumePath) return res.status(404).json({ success: false, message: "Resume not found" });
  if (await sendStoredUpload(item.resumePath, res)) return;
  const parsed = parsePrivateUploadReference(item.resumePath); const file = parsed ? privateUploadPath(parsed.folder, parsed.filename) : null;
  if (!file) return res.status(404).json({ success: false, message: "Resume not found" });
  res.sendFile(file);
});

router.get("/:id/payment-screenshot", authenticate, async (req: any, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid application id" });
  const item: any = await JobApplication.findById(req.params.id).lean();
  if (await sendStoredUpload(item?.paymentScreenshotPath, res)) return;
  const parsed = parsePrivateUploadReference(item?.paymentScreenshotPath); const file = parsed ? privateUploadPath(parsed.folder, parsed.filename) : null;
  if (!file) return res.status(404).json({ success: false, message: "Payment screenshot not found" });
  res.sendFile(file);
});

router.get("/:id", authenticate, async (req, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid application id" });
  const item = await JobApplication.findById(req.params.id).lean(); if (!item) return res.status(404).json({ success: false, message: "Application not found" }); res.json({ success: true, data: item });
});

const applicationStatuses = ["submitted", "under-review", "shortlisted", "interview", "selected", "hired", "rejected", "withdrawn"];
const paymentStatuses = ["not-required", "unpaid", "submitted", "verified", "rejected"];

router.patch("/:id", authenticate, async (req: any, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid application id" });
  const item: any = await JobApplication.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: "Application not found" });
  const oldPaymentStatus = item.paymentStatus; const oldStatus = item.applicationStatus;
  if (req.body.applicationStatus && !applicationStatuses.includes(req.body.applicationStatus)) return res.status(400).json({ success: false, message: "Invalid application status" });
  if (req.body.paymentStatus && !paymentStatuses.includes(req.body.paymentStatus)) return res.status(400).json({ success: false, message: "Invalid payment status" });
  if (req.body.applicationStatus) { item.applicationStatus = req.body.applicationStatus; item.status = req.body.applicationStatus === "hired" ? "hired" : req.body.applicationStatus === "rejected" ? "rejected" : req.body.applicationStatus === "interview" ? "interviewing" : req.body.applicationStatus === "submitted" ? "pending" : "reviewed"; }
  if (req.body.paymentStatus) item.paymentStatus = req.body.paymentStatus;
  if (typeof req.body.adminNote === "string") item.adminNote = req.body.adminNote.trim();
  if (typeof req.body.internalNote === "string") item.internalNote = req.body.internalNote.trim();
  if (typeof req.body.applicantReply === "string") item.applicantReply = req.body.applicantReply.trim();
  item.reviewedBy = req.user?.id; item.reviewedAt = new Date(); await item.save();
  if (item.paymentStatus !== oldPaymentStatus && ["verified", "rejected"].includes(item.paymentStatus)) void sendApplicationEventEmail(item, item.paymentStatus === "verified" ? "job_payment_verified" : "job_payment_rejected", { applicantName: item.applicantName || item.name, applicationNumber: item.applicationNumber, jobTitle: item.jobTitleSnapshot, amount: item.paymentAmountSnapshot, adminReply: item.adminNote }, req.user?.id).catch(() => undefined);
  if (item.applicationStatus !== oldStatus && item.applicationStatus !== "submitted") void sendApplicationEventEmail(item, `job_application_${item.applicationStatus === "under-review" ? "under_review" : item.applicationStatus}`, { applicantName: item.applicantName || item.name, applicationNumber: item.applicationNumber, jobTitle: item.jobTitleSnapshot, adminReply: item.applicantReply }, req.user?.id).catch(() => undefined);
  res.json({ success: true, message: "Application updated", data: item });
});

router.put("/:id", authenticate, async (req: any, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid application id" });
  const item: any = await JobApplication.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: "Application not found" });
  const mapped = req.body.applicationStatus || ({ pending: "submitted", reviewed: "under-review", interviewing: "interview", hired: "hired", rejected: "rejected" } as Record<string, string>)[req.body.status];
  if (mapped && !applicationStatuses.includes(mapped)) return res.status(400).json({ success: false, message: "Invalid application status" });
  if (mapped) { item.applicationStatus = mapped; item.status = mapped === "hired" ? "hired" : mapped === "rejected" ? "rejected" : mapped === "interview" ? "interviewing" : mapped === "submitted" ? "pending" : "reviewed"; }
  if (req.body.paymentStatus && !paymentStatuses.includes(req.body.paymentStatus)) return res.status(400).json({ success: false, message: "Invalid payment status" });
  if (req.body.paymentStatus) item.paymentStatus = req.body.paymentStatus;
  for (const key of ["adminNote", "internalNote", "applicantReply"]) if (typeof req.body[key] === "string") item[key] = req.body[key].trim();
  item.reviewedBy = req.user?.id; item.reviewedAt = new Date(); await item.save(); res.json({ success: true, message: "Application updated", data: item });
});

router.post("/:id/custom-reply", authenticate, async (req: any, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid application id" });
  const item: any = await JobApplication.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: "Application not found" });
  const message = field(req.body.message); if (!message) return res.status(400).json({ success: false, message: "Reply message is required" });
  const linkedUser: any = item.userId ? await User.findById(item.userId).lean() : null; const recipient = linkedUser?.email || item.email;
  const result = await sendTemplateEmail({ to: recipient, templateKey: "job_application_custom_reply", data: { applicantName: item.applicantName || item.name, applicationNumber: item.applicationNumber, jobTitle: item.jobTitleSnapshot, adminReply: message }, relatedEntityType: "JobApplication", relatedEntityId: String(item._id), sentBy: req.user?.id, category: "job" });
  item.applicantReply = message; item.emailHistory.push({ subject: "Reply from Terqivo", messageSummary: message.slice(0, 200), templateKey: "job_application_custom_reply", recipient, sentAt: new Date(), sentBy: req.user?.id, status: result.status, errorSummary: result.message || "" }); await item.save();
  res.json({ success: result.success, message: result.success ? "Reply sent" : result.message || "Reply could not be sent", data: item });
});

router.delete("/:id", authenticate, async (req, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid application id" });
  const item: any = await JobApplication.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: "Application not found" });
  await removeStoredUpload(item.resumePath); await removeStoredUpload(item.paymentScreenshotPath); res.json({ success: true, message: "Application deleted" });
});

export default router;
