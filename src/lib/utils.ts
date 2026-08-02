import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function assetUrl(value?: string | null) {
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  return value.startsWith("/") ? `${apiBase}${value}` : `${apiBase}/${value}`;
}

export function formatPrice(amount: number | undefined | null, currency?: { prefix?: string; suffix?: string; symbol?: string; code?: string } | null) {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) return "";
  const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(Number(amount));
  const prefix = currency?.prefix || currency?.symbol || "";
  const suffix = currency?.suffix || (!prefix ? currency?.code || "" : "");
  return `${prefix ? `${prefix} ` : ""}${formatted}${suffix ? ` ${suffix}` : ""}`.trim();
}
