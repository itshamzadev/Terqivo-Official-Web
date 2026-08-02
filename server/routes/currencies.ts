import { Router } from "express";
import mongoose from "mongoose";
import { Currency } from "../models/Currency";
import { Course } from "../models/Course";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/active", async (_req, res) => {
  const items = await Currency.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
  res.json({ success: true, data: items });
});

router.get("/", authenticate, async (_req, res) => {
  const items = await Currency.find().sort({ sortOrder: 1, name: 1 }).lean();
  res.json({ success: true, data: items });
});

router.post("/", authenticate, async (req, res) => {
  try {
    if (req.body.isDefault) await Currency.updateMany({}, { $set: { isDefault: false } });
    const item = await Currency.create(req.body);
    res.status(201).json({ success: true, data: item, message: "Currency created" });
  } catch (error: any) {
    res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.code === 11000 ? "Currency code already exists" : error?.message || "Invalid currency" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid currency id" });
  try {
    if (req.body.isDefault) await Currency.updateMany({ _id: { $ne: req.params.id } }, { $set: { isDefault: false } });
    const item = await Currency.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Currency not found" });
    res.json({ success: true, data: item, message: "Currency updated" });
  } catch (error: any) {
    res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.message || "Invalid currency" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid currency id" });
  if (await Course.exists({ currencyId: req.params.id })) return res.status(409).json({ success: false, message: "Reassign this currency from courses before deleting it" });
  const item = await Currency.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Currency not found" });
  res.json({ success: true, message: "Currency deleted" });
});

export default router;
