import mongoose from "mongoose";
import { Router } from "express";
import { Product } from "../models/Product";
import { authenticate } from "../middleware/auth";
import { isLocalUpload, isPersistentUpload, normalizeImagePath, removeStoredUpload } from "../utils/uploads";

const router = Router();
const productImage = (item: any) => normalizeImagePath(item?.image || item?.thumbnail, "products");
const publicProduct = (item: any) => ({ ...item, image: productImage(item), thumbnail: productImage(item) });

async function imageIsReferenced(image: string, excludeId: string) {
  if (!isLocalUpload(image, "products") && !isPersistentUpload(image)) return true;
  const normalized = normalizeImagePath(image, "products");
  return Boolean(await Product.exists({ _id: { $ne: excludeId }, $or: [{ image: { $in: [image, normalized] } }, { thumbnail: { $in: [image, normalized] } }] }));
}

router.get("/", async (_req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: items.map(publicProduct) });
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
  res.json({ success: true, data: publicProduct(item) });
});

router.post("/", authenticate, async (req, res) => {
  try {
    const image = normalizeImagePath(req.body.image || req.body.thumbnail, "products");
    const item = await Product.create({ ...req.body, image, thumbnail: image });
    res.status(201).json({ success: true, message: "Product created", data: publicProduct(item) });
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
    const oldImage = current.image || current.thumbnail || "";
    if (body.image !== undefined || body.thumbnail !== undefined) {
      body.image = normalizeImagePath(body.image || body.thumbnail, "products");
      body.thumbnail = body.image;
    }
    const item = await Product.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Product not found" });
    if ((body.image !== undefined && normalizeImagePath(oldImage, "products") !== normalizeImagePath(item.image, "products")) && !await imageIsReferenced(oldImage, req.params.id)) void removeStoredUpload(oldImage, "products");
    res.json({ success: true, message: "Product updated", data: publicProduct(item) });
  } catch (error: any) {
    res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.code === 11000 ? "Slug already exists" : error?.message || "Invalid product data" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid product id" });
  const item = await Product.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Product not found" });
  if (item.image || item.thumbnail) {
    try {
      if (!await imageIsReferenced(item.image || item.thumbnail || "", req.params.id)) void removeStoredUpload(item.image || item.thumbnail, "products");
    } catch (error) {
      console.warn("Product deleted but image cleanup failed:", error);
    }
  }
  res.json({ success: true, message: "Product deleted" });
});

export default router;
