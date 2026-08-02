import { Router } from "express";
import mongoose from "mongoose";
import { Course } from "../models/Course";
import { Currency } from "../models/Currency";
import { PaymentAccount } from "../models/PaymentAccount";
import { CourseEnrollmentRequest } from "../models/CourseEnrollmentRequest";
import { authenticate } from "../middleware/auth";
import { createImageUpload, uploadUrl } from "../utils/uploads";
import crypto from "crypto";

const router = Router();
const screenshotUpload = createImageUpload("payment-screenshots", 5 * 1024 * 1024);
const idIsValid = (id: string) => mongoose.isValidObjectId(id);

router.post("/", (req, res, next) => {
  screenshotUpload.single("paymentScreenshot")(req, res, (error) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    next();
  });
}, async (req, res) => {
  try {
    const courseId = req.body.courseId || req.body.selectedCourse;
    const paymentAccountId = req.body.paymentAccountId || req.body.selectedPaymentAccount;
    const { fullName, email, phone, transactionId, message } = req.body;
    if (!idIsValid(courseId) || !idIsValid(paymentAccountId)) return res.status(400).json({ success: false, message: "Course and payment account are required" });
    if (!req.file) return res.status(400).json({ success: false, message: "Payment screenshot is required" });
    if (!fullName?.trim() || !/^\S+@\S+\.\S+$/.test(String(email)) || !phone?.trim()) return res.status(400).json({ success: false, message: "Name, email, and phone are required" });

    const [course, account] = await Promise.all([Course.findOne({ _id: courseId, $or: [{ published: true }, { published: { $exists: false }, status: { $in: ["active", "published"] } }] }), PaymentAccount.findOne({ _id: paymentAccountId, isActive: true })]);
    if (!course) return res.status(404).json({ success: false, message: "Course not found or unavailable" });
    if (!account) return res.status(404).json({ success: false, message: "Payment account is not active" });
    if (account.requiresTransactionId && !transactionId?.trim()) return res.status(400).json({ success: false, message: "Transaction/reference number is required for this payment method" });
    if (course.enrollmentStatus !== "open") return res.status(409).json({ success: false, message: "Enrollment is closed for this course" });
    if (course.limitedSeats && course.remainingSeats !== undefined && course.remainingSeats <= 0) return res.status(409).json({ success: false, message: "No seats are currently available" });
    if (await CourseEnrollmentRequest.exists({ courseId, email: String(email).trim().toLowerCase(), transactionId: String(transactionId).trim(), status: "pending" })) return res.status(409).json({ success: false, message: "This enrollment request has already been submitted" });

    let currency: any = null;
    if (course.currencyId) currency = await Currency.findById(course.currencyId).lean();
    if (!currency) currency = await Currency.findOne({ isDefault: true, isActive: true }).lean();
    const paymentValues = [account.bankName, account.accountNumber, account.iban, account.walletNumber].filter(Boolean).join(" | ");
    const item = await CourseEnrollmentRequest.create({
      requestNumber: `ENR-${new Date().getFullYear()}-${crypto.randomBytes(5).toString("hex").toUpperCase()}`,
      courseId, courseTitleSnapshot: course.title, applicantName: String(fullName).trim(), email: String(email).trim().toLowerCase(), phone: String(phone).trim(),
      paymentAccountId, paymentMethodSnapshot: account.paymentMethod, paymentAccountSnapshot: `${account.accountTitle}${paymentValues ? `: ${paymentValues}` : ""}`,
      amountSnapshot: course.salePrice ?? course.price ?? 0,
      currencySnapshot: currency ? { name: currency.name, code: currency.code, symbol: currency.symbol, prefix: currency.prefix, suffix: currency.suffix } : {},
      transactionId: String(transactionId || "N/A").trim(), paymentScreenshot: uploadUrl("payment-screenshots", req.file.filename), message: String(message || "").trim(), status: "pending",
    });
    res.status(201).json({ success: true, message: "Enrollment request submitted", data: { requestNumber: item.requestNumber } });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message || "Could not submit enrollment request" });
  }
});

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
  res.json({ success: true, data: current, message: `Request ${status}` });
});

export default router;
