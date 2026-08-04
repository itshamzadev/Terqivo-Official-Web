import { Router, type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { Service } from "../models/Service";
import { authenticate } from "../middleware/auth";
import {
  createImageUpload,
  isLocalUpload,
  isPersistentUpload,
  isValidImageReference,
  normalizeImagePath,
  persistUploadedFile,
  removeLocalUpload,
  removeStoredUpload,
  uploadUrl,
  validateUploadedImage,
} from "../utils/uploads";

const router = Router();
const serviceUpload = createImageUpload("services");
const publicFilter: any = { $or: [{ published: true }, { published: { $exists: false }, status: "published" }] };

function idIsValid(id: string) {
  return mongoose.isValidObjectId(id);
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

async function uniqueSlug(value: string, excludeId?: string) {
  const base = slugify(value) || `service-${Date.now()}`;
  let slug = base;
  let suffix = 2;
  while (await Service.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) slug = `${base}-${suffix++}`;
  return slug;
}

function parseFormValue(value: unknown) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseBoolean(value: unknown, fallback = false) {
  if (value === undefined) return fallback;
  return value === true || value === "true" || value === "1";
}

function normalizeService(service: any) {
  const data = service?.toObject ? service.toObject() : service;
  return { ...data, image: normalizeImagePath(data?.image || data?.imageUrl, "services"), published: Boolean(data?.published || data?.status === "published") };
}

async function serviceImageIsReferenced(image: string, excludeId: string) {
  if (!isLocalUpload(image, "services") && !isPersistentUpload(image)) return true;
  const normalized = normalizeImagePath(image, "services");
  return Boolean(await Service.exists({ _id: { $ne: excludeId }, $or: [{ image: { $in: [image, normalized] } }, { imageUrl: { $in: [image, normalized] } }] }));
}

function handleServiceUpload(req: Request, res: Response, next: NextFunction) {
  serviceUpload.single("image")(req, res, (error) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    next();
  });
}

async function validateRequestImage(req: Request, res: Response) {
  if (!req.file) return true;
  if (await validateUploadedImage(req.file)) return true;
  removeLocalUpload(uploadUrl("services", req.file.filename), "services");
  res.status(400).json({ success: false, message: "The uploaded file is not a valid JPG, PNG, or WEBP image." });
  return false;
}

router.get("/", async (_req, res) => {
  try {
    const items = await Service.find(publicFilter).sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: items.map(normalizeService) });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch services", data: [] });
  }
});

router.get("/admin", authenticate, async (_req, res) => {
  try {
    const items = await Service.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: items.map(normalizeService) });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
});

router.get("/admin/:id", authenticate, async (req, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid service id" });
  const item = await Service.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Service not found" });
  res.json({ success: true, data: normalizeService(item) });
});

router.get("/:idOrSlug", async (req, res) => {
  try {
    const filter = idIsValid(req.params.idOrSlug)
      ? { _id: req.params.idOrSlug, ...publicFilter }
      : { slug: req.params.idOrSlug, ...publicFilter };
    const item = await Service.findOne(filter);
    if (!item) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: normalizeService(item) });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch service" });
  }
});

router.post("/", authenticate, handleServiceUpload, async (req, res) => {
  let newImage = "";
  try {
    if (!await validateRequestImage(req, res)) return;
    const body = { ...req.body };
    body.title = String(body.title || "").trim();
    if (!body.title) return res.status(400).json({ success: false, message: "Service title is required" });
    body.slug = await uniqueSlug(body.slug || body.title);
    body.features = parseFormValue(body.features) || [];
    body.process = parseFormValue(body.process) || [];
    body.featured = parseBoolean(body.featured);
    body.published = body.published === undefined ? body.status === "published" : parseBoolean(body.published);
    body.status = body.published ? "published" : "draft";
    body.sortOrder = Number(body.sortOrder) || 0;
    if (req.file) {
      const stored = await persistUploadedFile(req.file, "services", "public");
      newImage = stored.url;
      body.image = newImage;
    } else if (body.removeImage === "true") {
      body.image = "";
    } else if (body.image !== undefined || body.imageUrl !== undefined) {
      const imageValue = body.image ?? body.imageUrl;
      if (!isValidImageReference(imageValue, "services")) return res.status(400).json({ success: false, message: "Please provide a valid image URL or upload an image file." });
      body.image = normalizeImagePath(imageValue, "services");
    }
    if (body.image !== undefined) body.imageUrl = "";
    const item = await Service.create(body);
    res.status(201).json({ success: true, message: "Service created", data: normalizeService(item) });
  } catch (error: any) {
    if (newImage) await removeStoredUpload(newImage, "services");
    res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.code === 11000 ? "Slug already exists" : error?.message || "Invalid service data" });
  }
});

async function updateService(req: Request, res: Response) {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid service id" });
  let newImage = "";
  try {
    if (!await validateRequestImage(req, res)) return;
    const current = await Service.findById(req.params.id);
    if (!current) return res.status(404).json({ success: false, message: "Service not found" });
    const body = { ...req.body };
    if (body.title) body.title = String(body.title).trim();
    if (body.slug || body.title) body.slug = await uniqueSlug(body.slug || body.title, req.params.id);
    if (body.features !== undefined) body.features = parseFormValue(body.features) || [];
    if (body.process !== undefined) body.process = parseFormValue(body.process) || [];
    if (body.featured !== undefined) body.featured = parseBoolean(body.featured);
    if (body.published !== undefined) body.published = parseBoolean(body.published);
    if (body.published !== undefined) body.status = body.published ? "published" : "draft";
    if (body.sortOrder !== undefined) body.sortOrder = Number(body.sortOrder) || 0;
    const oldImage = current.image || current.imageUrl || "";
    if (req.file) {
      const stored = await persistUploadedFile(req.file, "services", "public");
      newImage = stored.url;
      body.image = newImage;
    } else if (body.removeImage === "true") {
      body.image = "";
    } else if (body.image !== undefined || body.imageUrl !== undefined) {
      const imageValue = body.image ?? body.imageUrl;
      if (!isValidImageReference(imageValue, "services")) return res.status(400).json({ success: false, message: "Please provide a valid image URL or upload an image file." });
      body.image = normalizeImagePath(imageValue, "services");
    }
    if (body.image !== undefined) body.imageUrl = "";
    delete body.removeImage;
    const item = await Service.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!item) {
      if (newImage) await removeStoredUpload(newImage, "services");
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    if (newImage || body.image === "") {
      if (oldImage && normalizeImagePath(oldImage, "services") !== normalizeImagePath(item.image, "services") && !await serviceImageIsReferenced(oldImage, req.params.id)) void removeStoredUpload(oldImage, "services");
    }
    res.json({ success: true, message: "Service updated", data: normalizeService(item) });
  } catch (error: any) {
    if (newImage) await removeStoredUpload(newImage, "services");
    res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error?.code === 11000 ? "Slug already exists" : error?.message || "Invalid service data" });
  }
}

router.put("/:id", authenticate, handleServiceUpload, updateService);
router.patch("/:id", authenticate, handleServiceUpload, updateService);

router.patch("/:id/publish", authenticate, async (req, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid service id" });
  const published = parseBoolean(req.body.published);
  const item = await Service.findByIdAndUpdate(req.params.id, { published, status: published ? "published" : "draft" }, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: "Service not found" });
  res.json({ success: true, data: normalizeService(item), message: published ? "Service published" : "Service unpublished" });
});

router.delete("/:id", authenticate, async (req, res) => {
  if (!idIsValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid service id" });
  const item = await Service.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Service not found" });
  try {
    const image = item.image || item.imageUrl || "";
    if (image && !await serviceImageIsReferenced(image, req.params.id)) void removeStoredUpload(image, "services");
  } catch (error) {
    console.warn("Service deleted but image cleanup failed:", error);
  }
  res.json({ success: true, message: "Service deleted" });
});

export default router;
