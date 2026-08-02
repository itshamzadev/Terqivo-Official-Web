import { Router } from "express";
import { Enrollment } from "../models/Enrollment";
import { authenticate } from "../middleware/auth";

const router = Router();

// Legacy enrollment endpoint retained for existing integrations and records.
router.post("/", async (req, res) => {
  try {
    const item = await Enrollment.create(req.body);
    res.status(201).json({ success: true, message: "Submitted successfully", data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message || "Invalid enrollment" });
  }
});

router.get("/", authenticate, async (_req, res) => {
  const items = await Enrollment.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});

router.put("/:id", authenticate, async (req, res) => {
  const item = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: item });
});

router.delete("/:id", authenticate, async (req, res) => {
  const item = await Enrollment.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, message: "Deleted successfully" });
});

export default router;
