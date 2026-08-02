import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createImageUpload, normalizeImagePath, removeLocalUpload, uploadUrl, validateUploadedImage } from "../utils/uploads";
import { Product } from "../models/Product";
import { Course } from "../models/Course";
import { Service } from "../models/Service";
import { BlogPost } from "../models/BlogPost";
import { CourseEnrollmentRequest } from "../models/CourseEnrollmentRequest";

const router = Router();
const uploadFolders = {
  product: "products",
  course: "courses",
  service: "services",
  insight: "insights",
  payment: "payment-screenshots",
  general: "general",
} as const;
const uploaders = {
  product: createImageUpload(uploadFolders.product),
  course: createImageUpload(uploadFolders.course),
  service: createImageUpload(uploadFolders.service),
  insight: createImageUpload(uploadFolders.insight),
  payment: createImageUpload(uploadFolders.payment, 5 * 1024 * 1024),
  general: createImageUpload(uploadFolders.general),
};
const isUploadType = (value: unknown): value is keyof typeof uploaders => typeof value === "string" && Object.prototype.hasOwnProperty.call(uploaders, value);

router.post("/", authenticate, (req, res, next) => {
  const type = isUploadType(req.query.type) ? req.query.type : "general";
  uploaders[type].single("file")(req, res, (error) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    next();
  });
}, async (req, res) => {
  const type = isUploadType(req.query.type) ? req.query.type : "general";
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  try {
    const folder = uploadFolders[type];
    if (!await validateUploadedImage(req.file)) {
      removeLocalUpload(uploadUrl(folder, req.file.filename), folder);
      return res.status(400).json({ success: false, message: "The uploaded file is not a valid JPG, PNG, or WEBP image." });
    }
    res.status(201).json({ success: true, data: { url: uploadUrl(folder, req.file.filename) } });
  } catch {
    removeLocalUpload(uploadUrl(uploadFolders[type], req.file.filename), uploadFolders[type]);
    res.status(400).json({ success: false, message: "Could not validate the uploaded image." });
  }
});

router.delete("/", authenticate, async (req, res) => {
  const value = typeof req.body?.url === "string" ? req.body.url : "";
  if (!value || !value.startsWith("/uploads/")) return res.status(400).json({ success: false, message: "A local upload URL is required" });
  const normalized = normalizeImagePath(value);
  const values = [value, normalized];
  const references = await Promise.all([
    Product.exists({ $or: [{ image: { $in: values } }, { thumbnail: { $in: values } }] }),
    Course.exists({ $or: [{ image: { $in: values } }, { coverImage: { $in: values } }, { thumbnail: { $in: values } }] }),
    Service.exists({ image: { $in: values } }),
    BlogPost.exists({ coverImage: { $in: values } }),
    CourseEnrollmentRequest.exists({ paymentScreenshot: { $in: values } }),
  ]);
  if (references.some(Boolean)) return res.status(409).json({ success: false, message: "This image is still used by saved content" });
  removeLocalUpload(normalized);
  res.json({ success: true, message: "Unused upload removed" });
});

export default router;
