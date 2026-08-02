import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import type { Request } from "express";

export const uploadsRoot = path.resolve(process.cwd(), "public", "uploads");

const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export function createImageUpload(folder: string, maxSize = 5 * 1024 * 1024) {
  const destination = path.join(uploadsRoot, folder);
  fs.mkdirSync(destination, { recursive: true });

  return multer({
    storage: multer.diskStorage({
      destination,
      filename: (_req, file, cb) => {
        const extension = allowedImageTypes.get(file.mimetype) || path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${crypto.randomBytes(10).toString("hex")}${extension}`);
      },
    }),
    limits: { fileSize: maxSize },
    fileFilter: (_req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const expectedExtension = allowedImageTypes.get(file.mimetype);
      if (!expectedExtension || extension !== expectedExtension) {
        cb(new Error("Only JPG, PNG, and WEBP images are allowed."));
        return;
      }
      cb(null, true);
    },
  });
}

export function uploadUrl(folder: string, filename: string) {
  return `/uploads/${folder}/${filename}`;
}

export function isLocalUpload(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("/uploads/");
}

export function removeLocalUpload(value: unknown) {
  if (!isLocalUpload(value)) return;
  const resolved = path.resolve(process.cwd(), "public", value.replace(/^\/+/, ""));
  if (!resolved.startsWith(`${uploadsRoot}${path.sep}`)) return;
  try {
    if (fs.existsSync(resolved)) fs.unlinkSync(resolved);
  } catch (error) {
    console.warn("Could not remove upload:", error);
  }
}

export function uploadedFileUrl(req: Request, folder: string) {
  const file = req.file;
  return file ? uploadUrl(folder, file.filename) : null;
}
