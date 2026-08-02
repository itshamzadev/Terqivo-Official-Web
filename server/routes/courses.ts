import { Router } from "express";
import mongoose from "mongoose";
import { Course } from "../models/Course";
import { Currency } from "../models/Currency";
import { authenticate } from "../middleware/auth";
import { isLocalUpload, normalizeImagePath, removeLocalUpload } from "../utils/uploads";

const router = Router();
const objectId = (value: string) => mongoose.isValidObjectId(value);
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);

async function uniqueSlug(value: string, excludeId?: string) {
  const base = slugify(value) || `course-${Date.now()}`;
  let slug = base;
  let index = 2;
  while (await Course.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) slug = `${base}-${index++}`;
  return slug;
}

async function imageIsReferenced(image: string, excludeId: string) {
  if (!isLocalUpload(image, "courses")) return true;
  const normalized = normalizeImagePath(image, "courses");
  return Boolean(await Course.exists({ _id: { $ne: excludeId }, $or: [{ image: { $in: [image, normalized] } }, { coverImage: { $in: [image, normalized] } }, { thumbnail: { $in: [image, normalized] } }] }));
}

function publicCourseQuery(): any {
  return { $or: [{ published: true }, { published: { $exists: false }, status: { $in: ["active", "published"] } }] };
}

async function withCurrency(course: any) {
  const data = course.toObject ? course.toObject() : course;
  data.image = normalizeImagePath(data.image || data.coverImage || data.thumbnail, "courses");
  data.coverImage = data.image;
  data.thumbnail = data.image;
  if (data.currencyId) data.currency = await Currency.findById(data.currencyId).lean();
  return data;
}

router.get("/", async (_req, res) => {
  try {
    const courses = await Course.find(publicCourseQuery()).sort({ featured: -1, createdAt: -1 }).lean();
    const currencies = await Currency.find({ isActive: true }).lean();
    const currencyMap = new Map(currencies.map((currency) => [String(currency._id), currency]));
    res.json({ success: true, data: courses.map((course) => ({ ...course, currency: course.currencyId ? currencyMap.get(String(course.currencyId)) : undefined })) });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
});

router.get("/admin", authenticate, async (_req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    const currencies = await Currency.find().lean();
    const currencyMap = new Map(currencies.map((currency) => [String(currency._id), currency]));
    res.json({ success: true, data: courses.map((course) => ({ ...course, currency: course.currencyId ? currencyMap.get(String(course.currencyId)) : undefined })) });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
});

router.get("/admin/:id", authenticate, async (req, res) => {
  if (!objectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid course id" });
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  res.json({ success: true, data: await withCurrency(course) });
});

router.get("/:idOrSlug", async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const filter = objectId(idOrSlug) ? { _id: idOrSlug, ...publicCourseQuery() } : { slug: idOrSlug, ...publicCourseQuery() };
    const course = await Course.findOne(filter);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, data: await withCurrency(course) });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch course" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const body = { ...req.body };
    body.title = String(body.title || "").trim();
    if (!body.title) return res.status(400).json({ success: false, message: "Course title is required" });
    body.slug = await uniqueSlug(body.slug || body.title);
    body.shortDescription = body.shortDescription ?? body.summary ?? "";
    body.fullDescription = body.fullDescription ?? body.description ?? "";
    body.image = normalizeImagePath(body.image ?? body.coverImage ?? body.thumbnail, "courses");
    body.summary = body.shortDescription;
    body.description = body.fullDescription;
    body.coverImage = body.image;
    body.thumbnail = body.image;
    body.format = body.format ?? body.learningMode ?? "";
    body.learningMode = body.format;
    body.published = body.published === undefined ? ["published", "active"].includes(body.status) : Boolean(body.published);
    body.status = body.published ? "published" : (body.status || "draft");
    const item = await Course.create(body);
    res.status(201).json({ success: true, message: "Course created", data: await withCurrency(item) });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.code === 11000 ? "Slug already exists" : error?.message || "Invalid course data" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  if (!objectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid course id" });
  try {
    const current = await Course.findById(req.params.id);
    if (!current) return res.status(404).json({ success: false, message: "Course not found" });
    const body = { ...req.body };
    if (body.title) body.title = String(body.title).trim();
    if (body.slug || body.title) body.slug = await uniqueSlug(body.slug || body.title, req.params.id);
    if (body.shortDescription !== undefined) body.summary = body.shortDescription;
    if (body.fullDescription !== undefined) body.description = body.fullDescription;
    const oldImage = current.image || current.coverImage || current.thumbnail || "";
    if (body.image !== undefined) {
      body.image = normalizeImagePath(body.image, "courses");
      body.coverImage = body.image;
      body.thumbnail = body.image;
    }
    if (body.format !== undefined) body.learningMode = body.format;
    if (body.published !== undefined) body.status = body.published ? "published" : "draft";
    const item = await Course.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Course not found" });
    if (body.image !== undefined && normalizeImagePath(oldImage, "courses") !== normalizeImagePath(item.image, "courses") && !await imageIsReferenced(oldImage, req.params.id)) removeLocalUpload(oldImage, "courses");
    res.json({ success: true, message: "Course updated", data: await withCurrency(item) });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.code === 11000 ? "Slug already exists" : error?.message || "Invalid course data" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  if (!objectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid course id" });
  const item = await Course.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Course not found" });
  const image = item.image || item.coverImage || item.thumbnail || "";
  try {
    if (image && !await imageIsReferenced(image, req.params.id)) removeLocalUpload(image, "courses");
  } catch (error) {
    console.warn("Course deleted but image cleanup failed:", error);
  }
  res.json({ success: true, message: "Course deleted" });
});

export default router;
