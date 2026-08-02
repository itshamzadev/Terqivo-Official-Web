import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import type { Request } from "express";

const imageExtensions = new Map<string, string[]>([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
]);
const uploadFolderAliases: Record<string, string> = {
  product: "products",
  course: "courses",
  service: "services",
  insight: "insights",
  payment: "payment-screenshots",
};

const privateUploadFolderAliases: Record<string, string> = {
  "job-resumes": "job-resumes",
  "job-payment-screenshots": "job-payment-screenshots",
  "course-payment-screenshots": "course-payment-screenshots",
};

export function getUploadsRoot() {
  return path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads"));
}

export function createImageUpload(folder: string, maxSize = 5 * 1024 * 1024) {
  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        const destination = path.join(getUploadsRoot(), folder);
        fs.mkdirSync(destination, { recursive: true });
        cb(null, destination);
      },
      filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase() === ".jpeg" ? ".jpg" : path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${crypto.randomBytes(12).toString("hex")}${extension}`);
      },
    }),
    limits: { fileSize: maxSize },
    fileFilter: (_req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = imageExtensions.get(file.mimetype);
      if (!allowedExtensions || !allowedExtensions.includes(extension)) {
        cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed."));
        return;
      }
      cb(null, true);
    },
  });
}

export function getPrivateUploadsRoot() {
  return path.resolve(path.join(getUploadsRoot(), "private"));
}

export function createPrivateUpload(folder: string, maxSize = 8 * 1024 * 1024) {
  const allowed = new Map<string, string[]>([
    ["application/pdf", [".pdf"]],
    ["application/msword", [".doc"]],
    ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", [".docx"]],
    ["image/jpeg", [".jpg", ".jpeg"]],
    ["image/png", [".png"]],
    ["image/webp", [".webp"]],
  ]);
  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        const destination = path.join(getPrivateUploadsRoot(), folder);
        fs.mkdirSync(destination, { recursive: true });
        cb(null, destination);
      },
      filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase() === ".jpeg" ? ".jpg" : path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${crypto.randomBytes(12).toString("hex")}${extension}`);
      },
    }),
    limits: { fileSize: maxSize },
    fileFilter: (_req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = allowed.get(file.mimetype);
      if (!allowedExtensions || !allowedExtensions.includes(extension)) {
        cb(new Error("Unsupported file type."));
        return;
      }
      cb(null, true);
    },
  });
}

export function createPrivateApplicationUpload(maxSize = 8 * 1024 * 1024) {
  const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  const resumeTypes = new Map([
    ["application/pdf", [".pdf"]],
    ["application/msword", [".doc"]],
    ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", [".docx"]],
  ]);
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const folder = file.fieldname === "paymentScreenshot" ? "job-payment-screenshots" : "job-resumes";
        const destination = path.join(getPrivateUploadsRoot(), folder);
        fs.mkdirSync(destination, { recursive: true });
        cb(null, destination);
      },
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(12).toString("hex")}${path.extname(file.originalname).toLowerCase() === ".jpeg" ? ".jpg" : path.extname(file.originalname).toLowerCase()}`),
    }),
    limits: { fileSize: maxSize },
    fileFilter: (_req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = file.fieldname === "paymentScreenshot" ? (imageTypes.has(file.mimetype) ? [".jpg", ".jpeg", ".png", ".webp"] : []) : (resumeTypes.get(file.mimetype) || []);
      if (!allowedExtensions.includes(extension)) { cb(new Error(file.fieldname === "paymentScreenshot" ? "Payment screenshots must be JPG, PNG, or WEBP." : "Resumes must be PDF, DOC, or DOCX.")); return; }
      cb(null, true);
    },
  });
}

export function uploadUrl(folder: string, filename: string) {
  return `/uploads/${folder}/${filename}`;
}

function objectImageValue(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const candidate = value as Record<string, unknown>;
  return candidate.url || candidate.path || candidate.src || candidate.filename || "";
}

/** Converts legacy filenames/paths to a safe public URL without exposing filesystem paths. */
export function normalizeImagePath(value: unknown, folder = "general") {
  const rawValue = objectImageValue(value);
  if (typeof rawValue !== "string") return "";
  const raw = rawValue.trim().replace(/\\/g, "/");
  if (!raw || raw.startsWith("blob:") || raw.startsWith("data:") || /^[a-zA-Z]:\//.test(raw)) return "";
  if (/^https?:\/\//i.test(raw)) return raw;

  const uploadsIndex = raw.toLowerCase().indexOf("/uploads/");
  if (uploadsIndex >= 0) {
    const relative = raw.slice(uploadsIndex + 1).replace(/^\/+/, "");
    const safeRelative = path.posix.normalize(relative);
    if (safeRelative.startsWith("uploads/") && !safeRelative.includes("..")) {
      const parts = safeRelative.split("/");
      if (parts[1] && uploadFolderAliases[parts[1]]) parts[1] = uploadFolderAliases[parts[1]];
      return `/${parts.join("/")}`;
    }
    return "";
  }

  const clean = raw.replace(/^\/+/, "");
  if (!clean.includes("/") && !clean.includes("..")) return uploadUrl(folder, clean);
  if (clean.startsWith("uploads/") && !clean.includes("..")) {
    const parts = clean.split("/");
    if (parts[1] && uploadFolderAliases[parts[1]]) parts[1] = uploadFolderAliases[parts[1]];
    return `/${parts.join("/")}`;
  }
  return raw.startsWith("/") ? `/${clean}` : `/${clean}`;
}

export function isValidImageReference(value: unknown, folder = "general") {
  const candidate = objectImageValue(value);
  if (candidate === undefined || candidate === null || String(candidate).trim() === "") return true;
  const normalized = normalizeImagePath(candidate, folder);
  if (!normalized) return false;
  if (/^https?:\/\//i.test(normalized)) {
    try {
      return Boolean(new URL(normalized).hostname);
    } catch {
      return false;
    }
  }
  return normalized.startsWith("/uploads/");
}

export function isLocalUpload(value: unknown, folder?: string) {
  const normalized = normalizeImagePath(value, folder);
  return normalized.startsWith("/uploads/");
}

export function localUploadFilePath(value: unknown, folder?: string) {
  const normalized = normalizeImagePath(value, folder);
  if (!normalized.startsWith("/uploads/")) return null;
  const root = path.resolve(getUploadsRoot());
  const resolved = path.resolve(root, normalized.slice("/uploads/".length));
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) return null;
  return resolved;
}

export function removeLocalUpload(value: unknown, folder?: string) {
  const resolved = localUploadFilePath(value, folder);
  if (!resolved) return;
  try {
    if (fs.existsSync(resolved)) fs.unlinkSync(resolved);
  } catch (error) {
    console.warn("Could not remove upload:", error);
  }
}

export function privateUploadPath(folder: string, filename: string) {
  if (!privateUploadFolderAliases[folder] || !/^[a-zA-Z0-9._-]+$/.test(filename)) return null;
  const root = path.resolve(getPrivateUploadsRoot());
  const resolved = path.resolve(root, privateUploadFolderAliases[folder], filename);
  if (!resolved.startsWith(`${root}${path.sep}`)) return null;
  return resolved;
}

export function privateUploadReference(folder: string, filename: string) {
  if (!privateUploadPath(folder, filename)) return "";
  return `private/${folder}/${filename}`;
}

export function parsePrivateUploadReference(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/\\/g, "/").replace(/^\/+/, "");
  const match = normalized.match(/^private\/(job-resumes|job-payment-screenshots|course-payment-screenshots)\/([a-zA-Z0-9._-]+)$/);
  return match ? { folder: match[1], filename: match[2] } : null;
}

export function removePrivateUpload(value: unknown) {
  const parsed = parsePrivateUploadReference(value);
  if (!parsed) return;
  const resolved = privateUploadPath(parsed.folder, parsed.filename);
  if (!resolved) return;
  try {
    if (fs.existsSync(resolved)) fs.unlinkSync(resolved);
  } catch (error) {
    console.warn("Could not remove private upload:", error);
  }
}

export async function validateUploadedImage(file: Express.Multer.File) {
  const header = await fs.promises.readFile(file.path, { encoding: null }).then((buffer) => buffer.subarray(0, 12));
  const isJpeg = header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isPng = header.length >= 8 && header.toString("hex", 0, 8) === "89504e470d0a1a0a";
  const isWebp = header.length >= 12 && header.toString("ascii", 0, 4) === "RIFF" && header.toString("ascii", 8, 12) === "WEBP";
  return isJpeg || isPng || isWebp;
}

export function uploadedFileUrl(req: Request, folder: string) {
  return req.file ? uploadUrl(folder, req.file.filename) : null;
}
