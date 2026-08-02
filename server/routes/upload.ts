import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createImageUpload, uploadedFileUrl } from "../utils/uploads";

const router = Router();
const uploaders = {
  product: createImageUpload("products"),
  course: createImageUpload("courses"),
  payment: createImageUpload("payment-screenshots", 5 * 1024 * 1024),
  general: createImageUpload("general"),
};

router.post("/", authenticate, (req, res, next) => {
  const type = typeof req.query.type === "string" && req.query.type in uploaders ? req.query.type as keyof typeof uploaders : "general";
  uploaders[type].single("file")(req, res, (error) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    next();
  });
}, (req, res) => {
  const type = typeof req.query.type === "string" && req.query.type in uploaders ? req.query.type : "general";
  const url = uploadedFileUrl(req, type);
  if (!url) return res.status(400).json({ success: false, message: "No file uploaded" });
  res.status(201).json({ success: true, data: { url } });
});

export default router;
