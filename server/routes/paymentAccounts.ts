import { Router } from "express";
import mongoose from "mongoose";
import { PaymentAccount } from "../models/PaymentAccount";
import { CourseEnrollmentRequest } from "../models/CourseEnrollmentRequest";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/active", async (_req, res) => {
  const items = await PaymentAccount.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
  res.json({ success: true, data: items });
});

router.get("/", authenticate, async (_req, res) => {
  const items = await PaymentAccount.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  res.json({ success: true, data: items });
});

router.post("/", authenticate, async (req, res) => {
  try {
    const item = await PaymentAccount.create(req.body);
    res.status(201).json({ success: true, data: item, message: "Payment account created" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message || "Invalid payment account" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid payment account id" });
  const item = await PaymentAccount.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: "Payment account not found" });
  res.json({ success: true, data: item, message: "Payment account updated" });
});

router.delete("/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid payment account id" });
  if (await CourseEnrollmentRequest.exists({ paymentAccountId: req.params.id, status: "pending" })) return res.status(409).json({ success: false, message: "Cannot delete an account used by a pending request" });
  const item = await PaymentAccount.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Payment account not found" });
  res.json({ success: true, message: "Payment account deleted" });
});

export default router;
