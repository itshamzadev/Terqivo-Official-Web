import { Router } from "express";
import mongoose from "mongoose";
import { Course } from "../models/Course";
import { Currency } from "../models/Currency";
import { PaymentAccount } from "../models/PaymentAccount";
import { CourseEnrollmentRequest } from "../models/CourseEnrollmentRequest";
import { authenticate, optionalUser, type AuthRequest } from "../middleware/auth";
import { createPrivateUpload, parsePrivateUploadReference, privateUploadPath, localUploadFilePath, persistUploadedFile, removePrivateUpload, removeStoredUpload, sendStoredUpload, validateUploadedImage } from "../utils/uploads";
import { sendTemplateEmail } from "../utils/emailService";
import { User } from "../models/User";
import { SiteSettings } from "../models/SiteSettings";
import crypto from "crypto";
import { formatWhatsAppMessage, sendAdminWhatsApp } from "../utils/whatsappService";

const router = Router();
const screenshotUpload = createPrivateUpload("course-payment-screenshots", 5 * 1024 * 1024);
const idIsValid = (id: string) => mongoose.isValidObjectId(id);

router.post("/", optionalUser, (req, res, next) => {
  screenshotUpload.single("paymentScreenshot")(req, res, (error) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    next();
  });
}, async (req: AuthRequest, res) => {
  let screenshotReference = "";
  const cleanup = () => {
    if (screenshotReference.startsWith("private/gridfs/")) void removeStoredUpload(screenshotReference);
    else if (req.file) removePrivateUpload(`private/course-payment-screenshots/${req.file.filename}`);
  };
  const fail = (status: number, message: string) => { cleanup(); return res.status(status).json({ success: false, message }); };
  try {
    const courseId = req.body.courseId || req.body.selectedCourse;
    const paymentAccountId = req.body.paymentAccountId || req.body.selectedPaymentAccount;
    const { fullName, email, phone, transactionId, message } = req.body;
    const settings = await SiteSettings.getSettings();
    const accountUser: any = req.user?.kind === "user" ? await User.findById(req.user.id) : null;
    if (settings.userAccess?.requireAccountForCourseEnrollment && !accountUser) return fail(401, "Please log in before submitting a course enrollment request");
    if (settings.userAccess?.requireVerifiedEmailForCourseEnrollment && accountUser && !accountUser.emailVerified) { cleanup(); return res.status(403).json({ success: false, code: "EMAIL_VERIFICATION_REQUIRED", message: "Please verify your email before continuing." }); }
    const authoritativeName = accountUser?.name || String(fullName || "").trim();
    const authoritativeEmail = accountUser?.email || String(email || "").trim().toLowerCase();
    if (!idIsValid(courseId) || !idIsValid(paymentAccountId)) return fail(400, "Course and payment account are required");
    if (!req.file) return fail(400, "Payment screenshot is required");
    if (!await validateUploadedImage(req.file)) {
      removePrivateUpload(`private/course-payment-screenshots/${req.file.filename}`);
      return fail(400, "The payment screenshot is not a valid JPG, PNG, or WEBP image.");
    }
    screenshotReference = (await persistUploadedFile(req.file, "course-payment-screenshots", "private")).reference;
    if (!authoritativeName || !/^\S+@\S+\.\S+$/.test(authoritativeEmail) || !phone?.trim()) return fail(400, "Name, email, and phone are required");

    const [course, account] = await Promise.all([Course.findOne({ _id: courseId, $or: [{ published: true }, { published: { $exists: false }, status: { $in: ["active", "published"] } }] }), PaymentAccount.findOne({ _id: paymentAccountId, isActive: true })]);
    if (!course) return fail(404, "Course not found or unavailable");
    if (!account) return fail(404, "Payment account is not active");
    if (account.requiresTransactionId && !transactionId?.trim()) return fail(400, "Transaction/reference number is required for this payment method");
    if (course.enrollmentStatus !== "open") return fail(409, "Enrollment is closed for this course");
    if (course.limitedSeats && course.remainingSeats !== undefined && course.remainingSeats <= 0) return fail(409, "No seats are currently available");
    if (await CourseEnrollmentRequest.exists({ courseId, email: authoritativeEmail, transactionId: String(transactionId).trim(), status: "pending" })) return fail(409, "This enrollment request has already been submitted");

    let currency: any = null;
    if (course.currencyId) currency = await Currency.findById(course.currencyId).lean();
    if (!currency) currency = await Currency.findOne({ isDefault: true, isActive: true }).lean();
    const paymentValues = [account.bankName, account.accountNumber, account.iban, account.walletNumber].filter(Boolean).join(" | ");
    const item = await CourseEnrollmentRequest.create({
      requestNumber: `ENR-${new Date().getFullYear()}-${crypto.randomBytes(5).toString("hex").toUpperCase()}`,
      courseId, userId: accountUser?._id, courseTitleSnapshot: course.title, applicantName: authoritativeName, applicantNameSnapshot: authoritativeName, applicantEmailSnapshot: authoritativeEmail, applicantUsernameSnapshot: accountUser?.username || "", email: authoritativeEmail, phone: String(phone).trim(),
      paymentAccountId, paymentMethodSnapshot: account.paymentMethod, paymentAccountSnapshot: `${account.accountTitle}${paymentValues ? `: ${paymentValues}` : ""}`,
      amountSnapshot: course.salePrice ?? course.price ?? 0,
      currencySnapshot: currency ? { name: currency.name, code: currency.code, symbol: currency.symbol, prefix: currency.prefix, suffix: currency.suffix } : {},
      transactionId: String(transactionId || "N/A").trim(), paymentScreenshot: screenshotReference, message: String(message || "").trim(), status: "pending",
    });
    void notifyCourseRequest(item).catch((error) => console.warn("Course enrollment email notification failed:", error?.message || "unknown error"));
    res.status(201).json({ success: true, message: "Enrollment request submitted", data: { requestNumber: item.requestNumber } });
  } catch (error: any) {
    cleanup();
    res.status(400).json({ success: false, message: error?.message || "Could not submit enrollment request" });
  }
});

async function notifyCourseRequest(item: any) {
  const linkedUser: any = item.userId ? await User.findById(item.userId).lean() : null;
  const recipient = linkedUser?.email || item.applicantEmailSnapshot || item.email;
  const data = { applicantName: item.applicantName, email: item.email, phone: item.phone, courseTitle: item.courseTitleSnapshot, requestNumber: item.requestNumber, amount: item.amountSnapshot, currency: item.currencySnapshot?.code || "", paymentMethod: item.paymentMethodSnapshot, transactionId: item.transactionId, status: item.status, adminUrl: `${process.env.APP_URL || ""}/admin/enrollments` };
  void sendAdminWhatsApp({
    eventType: "course",
    relatedEntityType: "CourseEnrollmentRequest",
    relatedEntityId: String(item._id),
    message: formatWhatsAppMessage("New Course Enrollment / Order", [
      ["Applicant", item.applicantName], ["Email", item.email], ["Phone", item.phone], ["Course", item.courseTitleSnapshot],
      ["Amount", `${item.amountSnapshot || 0} ${item.currencySnapshot?.code || ""}`], ["Payment method", item.paymentMethodSnapshot],
      ["Transaction ID", item.transactionId], ["Status", item.status], ["Reference", item.requestNumber], ["Message", item.message],
    ], data.adminUrl),
  }).catch((error) => console.warn("WhatsApp course notification failed:", error?.message || "unknown error"));
  const settings = await (await import("../models/SiteSettings")).SiteSettings.getSettings();
  if (settings.email?.sendCourseEnrollmentEmails === false) return;
  const applicant = await sendTemplateEmail({ to: recipient, templateKey: "course_enrollment_received", data, relatedEntityType: "CourseEnrollmentRequest", relatedEntityId: String(item._id), category: "course" });
  if (settings.email?.sendAdminNotifications !== false) await sendTemplateEmail({ to: settings.email?.adminNotificationEmail || process.env.ADMIN_NOTIFICATION_EMAIL || "support@terqivo.com", templateKey: "course_enrollment_admin_notification", data, relatedEntityType: "CourseEnrollmentRequest", relatedEntityId: String(item._id), category: "course" });
  await CourseEnrollmentRequest.updateOne({ _id: item._id }, { $push: { emailHistory: { subject: "Course enrollment received", templateKey: "course_enrollment_received", recipient, sentAt: new Date(), status: applicant.status, errorSummary: applicant.message || "" } }, $set: { lastEmailSentAt: new Date() } }).catch(() => undefined);
}

async function notifyCourseEvent(item: any, templateKey: string, data: Record<string, unknown>, sentBy?: string) {
  const linkedUser: any = item.userId ? await User.findById(item.userId).lean() : null; const recipient = linkedUser?.email || item.applicantEmailSnapshot || item.email;
  void sendAdminWhatsApp({
    eventType: templateKey.includes("payment") ? "payment" : "course",
    relatedEntityType: "CourseEnrollmentRequest",
    relatedEntityId: String(item._id),
    message: formatWhatsAppMessage(`Course ${templateKey.includes("approved") ? "Approved" : templateKey.includes("rejected") ? "Rejected" : "Updated"}`, [
      ["Applicant", item.applicantName], ["Email", item.email], ["Course", item.courseTitleSnapshot], ["Reference", item.requestNumber],
      ["Status", item.status], ["Admin note", item.adminNote],
    ], `${process.env.APP_URL || ""}/admin/enrollments`),
  }).catch((error) => console.warn("WhatsApp course event notification failed:", error?.message || "unknown error"));
  const result = await sendTemplateEmail({ to: recipient, templateKey, data, relatedEntityType: "CourseEnrollmentRequest", relatedEntityId: String(item._id), sentBy, category: templateKey.includes("payment") ? "payment" : "course" });
  await CourseEnrollmentRequest.updateOne({ _id: item._id }, { $push: { emailHistory: { subject: templateKey, templateKey, recipient, sentAt: new Date(), sentBy, status: result.status, errorSummary: result.message || "" } }, $set: { lastEmailSentAt: new Date() } }).catch(() => undefined);
  return result;
}

router.get("/", authenticate, async (req, res) => {
  const { status, search } = req.query;
  const filter: any = {};
  if (["pending", "approved", "rejected"].includes(String(status))) filter.status = status;
  if (search) {
    const regex = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ requestNumber: regex }, { applicantName: regex }, { email: regex }, { phone: regex }, { courseTitleSnapshot: regex }];
  }
  const items = await CourseEnrollmentRequest.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: items });
});

router.get("/:id", authenticate, async (req, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid request id" });
  const item = await CourseEnrollmentRequest.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ success: false, message: "Enrollment request not found" });
  res.json({ success: true, data: item });
});

router.get("/:id/payment-screenshot", authenticate, async (req, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid request id" });
  const item: any = await CourseEnrollmentRequest.findById(req.params.id).lean();
  if (!item?.paymentScreenshot) return res.status(404).json({ success: false, message: "Payment screenshot not found" });
  if (await sendStoredUpload(item.paymentScreenshot, res)) return;
  const parsed = parsePrivateUploadReference(item.paymentScreenshot);
  const file = parsed ? privateUploadPath(parsed.folder, parsed.filename) : localUploadFilePath(item.paymentScreenshot, "payment-screenshots");
  if (!file) return res.status(404).json({ success: false, message: "Payment screenshot not found" });
  res.sendFile(file);
});

router.patch("/:id/status", authenticate, async (req: any, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid request id" });
  const status = req.body.status;
  if (!["pending", "approved", "rejected"].includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });
  const current = await CourseEnrollmentRequest.findById(req.params.id);
  if (!current) return res.status(404).json({ success: false, message: "Enrollment request not found" });
  if (current.status !== "pending" && current.status !== status && !req.body.allowFinalizedUpdate) return res.status(409).json({ success: false, message: "Finalized requests require an explicit controlled update" });
  current.status = status;
  current.adminNote = typeof req.body.adminNote === "string" ? req.body.adminNote.trim() : current.adminNote;
  current.reviewedBy = req.user?.id;
  current.reviewedAt = new Date();
  await current.save();
  void notifyCourseEvent(current, status === "approved" ? "course_enrollment_approved" : "course_enrollment_rejected", { applicantName: current.applicantName, courseTitle: current.courseTitleSnapshot, requestNumber: current.requestNumber, adminNote: current.adminNote }, req.user?.id).catch(() => undefined);
  res.json({ success: true, data: current, message: `Request ${status}` });
});

export default router;
