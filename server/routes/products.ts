import mongoose from "mongoose";
import { Router } from "express";
import { Product } from "../models/Product";
import { authenticate } from "../middleware/auth";
import { removeLocalUpload } from "../utils/uploads";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: items.map((item) => ({ ...item, image: item.image || item.thumbnail || "" })) });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch products", data: [] });
  }
});

router.get("/:idOrSlug", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.idOrSlug) && !req.params.idOrSlug.trim()) return res.status(400).json({ success: false, message: "Invalid product reference" });
  const item = mongoose.isValidObjectId(req.params.idOrSlug)
    ? await Product.findById(req.params.idOrSlug).lean()
    : await Product.findOne({ slug: req.params.idOrSlug }).lean();
  if (!item) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, data: { ...item, image: item.image || item.thumbnail || "" } });
});

router.post("/", authenticate, async (req, res) => {
  try {
    const item = await Product.create({ ...req.body, image: req.body.image || req.body.thumbnail || "", thumbnail: req.body.thumbnail || req.body.image || "" });
    res.status(201).json({ success: true, message: "Product created", data: item });
  } catch (error: any) {
    res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.code === 11000 ? "Slug already exists" : error?.message || "Invalid product data" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid product id" });
  const current = await Product.findById(req.params.id);
  if (!current) return res.status(404).json({ success: false, message: "Product not found" });
  try {
    const body = { ...req.body };
    if (body.image !== undefined || body.thumbnail !== undefined) {
      body.image = body.image || body.thumbnail || "";
      body.thumbnail = body.image;
      if (body.image !== (current.image || current.thumbnail)) removeLocalUpload(current.image || current.thumbnail);
    }
    const item = await Product.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    res.json({ success: true, message: "Product updated", data: item });
  } catch (error: any) {
    res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.code === 11000 ? "Slug already exists" : error?.message || "Invalid product data" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid product id" });
  const item = await Product.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Product not found" });
  removeLocalUpload(item.image || item.thumbnail);
  res.json({ success: true, message: "Product deleted" });
});

export default router;
