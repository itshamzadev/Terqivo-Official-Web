import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function assetUrl(value?: string | null, folder?: string) {
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (/^[a-zA-Z]:[\\/]/.test(value) || /(^|\/)app\/uploads\//i.test(value)) return "";
  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const normalized = value.replace(/\\/g, "/").replace(/^\/+/, "");
  const publicPath = normalized.startsWith("uploads/")
    ? `/${normalized}`
    : folder && !normalized.includes("/")
      ? `/uploads/${folder}/${normalized}`
      : `/${normalized}`;
  return `${apiBase}${publicPath}`;
}

export function formatPrice(amount: number | undefined | null, currency?: { prefix?: string; suffix?: string; symbol?: string; code?: string } | null) {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) return "";
  const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(Number(amount));
  const prefix = currency?.prefix || currency?.symbol || "";
  const suffix = currency?.suffix || (!prefix ? currency?.code || "" : "");
  return `${prefix ? `${prefix} ` : ""}${formatted}${suffix ? ` ${suffix}` : ""}`.trim();
}

export async function removeUnusedUpload(value?: string, original?: string) {
  if (!value || value === original || !value.startsWith("/uploads/")) return;
  try {
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: value }),
    });
  } catch {
    // Cleanup is best-effort; the protected backend also refuses shared files.
  }
}
