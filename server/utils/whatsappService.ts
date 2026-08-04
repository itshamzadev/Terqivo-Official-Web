import mongoose from "mongoose";
import path from "path";
import { SiteSettings } from "../models/SiteSettings";
import { WhatsAppLog } from "../models/WhatsAppLog";

export type WhatsAppEventType = "contact" | "course" | "job" | "payment" | "system";
export type WhatsAppDeliveryStatus = "sent" | "failed" | "skipped";

type WhatsAppOptions = {
  eventType: WhatsAppEventType;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
};

type WebConnectionStatus = "disabled" | "starting" | "qr" | "authenticated" | "ready" | "disconnected" | "error";

const webState: {
  client: any;
  initializing: Promise<void> | null;
  status: WebConnectionStatus;
  qrDataUrl: string;
  lastError: string;
} = { client: null, initializing: null, status: "disabled", qrDataUrl: "", lastError: "" };

function providerName() {
  return String(process.env.WHATSAPP_PROVIDER || "web").toLowerCase();
}

function normalizePhone(value: unknown) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  // The configured number is Pakistani, so the admin-panel value 03xxxxxxxxx
  // is converted to the international format required by Meta.
  if (digits.startsWith("0")) digits = `92${digits.slice(1)}`;
  return digits;
}

function maskPhone(value: string) {
  if (value.length < 6) return value ? "configured" : "not configured";
  return `${value.slice(0, 3)}••••${value.slice(-3)}`;
}

function eventSetting(eventType: WhatsAppEventType) {
  return {
    contact: "notifyOnContact",
    course: "notifyOnCourseEnrollment",
    job: "notifyOnJobApplication",
    payment: "notifyOnPayment",
    system: "notifyOnEmail",
  }[eventType] as string;
}

function providerError(payload: any, fallback: string) {
  return String(payload?.error?.message || payload?.error?.error_user_msg || payload?.message || fallback).replace(/token|authorization|password|secret/gi, "credential").slice(0, 240);
}

function logPayload(options: WhatsAppOptions, recipient: string, status: WhatsAppDeliveryStatus, extra: Record<string, unknown> = {}) {
  return {
    recipient,
    eventType: options.eventType,
    message: options.message.slice(0, 10000),
    status,
    ...(options.relatedEntityType ? { relatedEntityType: options.relatedEntityType } : {}),
    ...(options.relatedEntityId ? { relatedEntityId: options.relatedEntityId } : {}),
    ...extra,
  };
}

async function ensureWebClient() {
  if (providerName() !== "web") return;
  if (webState.client && ["authenticated", "ready"].includes(webState.status)) return;
  if (webState.initializing) return webState.initializing;
  if (mongoose.connection.readyState !== 1) {
    webState.status = "error";
    webState.lastError = "MongoDB must be connected before WhatsApp Web can start";
    throw new Error(webState.lastError);
  }

  const initialize = (async () => {
    webState.status = "starting";
    webState.lastError = "";
    const [whatsappModule, { MongoStore }, qrcode] = await Promise.all([
      import("whatsapp-web.js"),
      import("wwebjs-mongo"),
      import("qrcode"),
    ]);
    // whatsapp-web.js is CommonJS. With Node's native ESM interop, its
    // auth strategies are exposed on the default export rather than as
    // reliable named exports.
    const { Client, RemoteAuth } = (whatsappModule as any).default || whatsappModule as any;
    const store = new MongoStore({ mongoose });
    const puppeteer: any = {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--no-first-run", "--no-zygote"],
    };
    if (process.env.CHROMIUM_PATH) puppeteer.executablePath = process.env.CHROMIUM_PATH;
    const client = new Client({
      authStrategy: new RemoteAuth({
        store,
        clientId: process.env.WHATSAPP_CLIENT_ID || "terqivo-admin",
        dataPath: path.resolve(process.env.WHATSAPP_SESSION_DIR || path.join(process.cwd(), ".wwebjs_auth")),
        backupSyncIntervalMs: 300000,
      }),
      puppeteer,
    });
    client.on("qr", async (qr: string) => {
      webState.qrDataUrl = await qrcode.toDataURL(qr, { width: 360, margin: 2 });
      webState.status = "qr";
    });
    client.on("authenticated", () => {
      webState.qrDataUrl = "";
      webState.status = "authenticated";
    });
    client.on("ready", () => {
      webState.qrDataUrl = "";
      webState.status = "ready";
      webState.lastError = "";
    });
    client.on("auth_failure", (message: string) => {
      webState.status = "error";
      webState.lastError = String(message || "WhatsApp authentication failed").slice(0, 240);
    });
    client.on("disconnected", (reason: string) => {
      webState.status = "disconnected";
      webState.lastError = String(reason || "WhatsApp Web disconnected").slice(0, 240);
      webState.client = null;
    });
    webState.client = client;
    await client.initialize();
  })();
  webState.initializing = initialize;
  try {
    await initialize;
  } catch (error: any) {
    webState.status = "error";
    webState.lastError = String(error?.message || "WhatsApp Web could not start").slice(0, 240);
    webState.client = null;
    throw error;
  } finally {
    if (webState.initializing === initialize) webState.initializing = null;
  }
}

async function sendViaWeb(options: WhatsAppOptions, recipient: string) {
  try {
    await ensureWebClient();
    if (webState.status !== "ready" || !webState.client) {
      const message = webState.status === "qr" ? "Scan the WhatsApp QR code from the admin panel first" : "WhatsApp Web is not connected";
      await WhatsAppLog.create(logPayload(options, recipient, "skipped", { errorCode: "WHATSAPP_WEB_NOT_READY", errorMessage: message })).catch(() => undefined);
      return { success: false, status: "skipped" as const, message };
    }
    const sent = await webState.client.sendMessage(`${recipient}@c.us`, options.message.trim().slice(0, 4096));
    const providerMessageId = sent?.id?._serialized || sent?.id?.id || "";
    await WhatsAppLog.create(logPayload(options, recipient, "sent", { providerMessageId, sentAt: new Date() })).catch(() => undefined);
    return { success: true, status: "sent" as const, message: "WhatsApp notification sent", providerMessageId };
  } catch (error: any) {
    const errorMessage = String(error?.message || "WhatsApp Web delivery failed").slice(0, 240);
    await WhatsAppLog.create(logPayload(options, recipient, "failed", { errorCode: "WHATSAPP_WEB_FAILED", errorMessage })).catch(() => undefined);
    return { success: false, status: "failed" as const, message: errorMessage };
  }
}

export async function getWhatsAppStatus() {
  const settings: any = await SiteSettings.getSettings();
  const recipient = normalizePhone(settings.whatsapp?.adminPhone || process.env.WHATSAPP_ADMIN_PHONE || "03470028168");
  const enabled = settings.whatsapp?.enabled !== false && String(process.env.WHATSAPP_ENABLED || "true").toLowerCase() !== "false";
  if (enabled && providerName() === "web") void ensureWebClient().catch(() => undefined);
  const hasCredentials = Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_API_VERSION);
  return {
    enabled,
    provider: providerName(),
    configured: providerName() === "web" ? enabled && Boolean(recipient) && webState.status === "ready" : enabled && hasCredentials && Boolean(recipient),
    connectionStatus: providerName() === "web" ? webState.status : hasCredentials ? "configured" : "not-configured",
    qrDataUrl: providerName() === "web" ? webState.qrDataUrl : "",
    lastError: providerName() === "web" ? webState.lastError : "",
    recipient: maskPhone(recipient),
    recipientLink: recipient ? `https://wa.me/${recipient}` : "",
    apiVersion: process.env.WHATSAPP_API_VERSION || "not set",
    templateConfigured: Boolean(process.env.WHATSAPP_NOTIFICATION_TEMPLATE),
    settings: settings.whatsapp || {},
  };
}

export async function sendAdminWhatsApp(options: WhatsAppOptions) {
  const settings: any = await SiteSettings.getSettings();
  const recipient = normalizePhone(settings.whatsapp?.adminPhone || process.env.WHATSAPP_ADMIN_PHONE || "03470028168");
  const settingName = eventSetting(options.eventType);
  const enabled = settings.whatsapp?.enabled !== false && String(process.env.WHATSAPP_ENABLED || "true").toLowerCase() !== "false";

  if (!enabled || settings.whatsapp?.[settingName] === false) {
    await WhatsAppLog.create(logPayload(options, recipient, "skipped", { errorCode: "WHATSAPP_DISABLED", errorMessage: "WhatsApp notifications are disabled" })).catch(() => undefined);
    return { success: false, status: "skipped" as const, message: "WhatsApp notifications are disabled" };
  }

  if (providerName() === "web") return sendViaWeb(options, recipient);

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION;
  if (!accessToken || !phoneNumberId || !apiVersion || !recipient) {
    await WhatsAppLog.create(logPayload(options, recipient, "skipped", { errorCode: "WHATSAPP_NOT_CONFIGURED", errorMessage: "WhatsApp Cloud API credentials or API version are missing" })).catch(() => undefined);
    return { success: false, status: "skipped" as const, message: "WhatsApp Cloud API is not configured" };
  }

  const templateName = process.env.WHATSAPP_NOTIFICATION_TEMPLATE;
  const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US";
  const message = options.message.trim().slice(0, 4096);
  const payload = templateName
    ? {
        messaging_product: "whatsapp",
        to: recipient,
        type: "template",
        template: {
          name: templateName,
          language: { code: templateLanguage },
          components: [{ type: "body", parameters: [{ type: "text", text: message.slice(0, 1024) }] }],
        },
      }
    : { messaging_product: "whatsapp", to: recipient, type: "text", text: { preview_url: false, body: message } };

  try {
    const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responsePayload: any = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMessage = providerError(responsePayload, `WhatsApp API returned HTTP ${response.status}`);
      await WhatsAppLog.create(logPayload(options, recipient, "failed", { errorCode: String(response.status), errorMessage })).catch(() => undefined);
      return { success: false, status: "failed" as const, message: errorMessage };
    }
    const providerMessageId = responsePayload?.messages?.[0]?.id || "";
    await WhatsAppLog.create(logPayload(options, recipient, "sent", { providerMessageId, sentAt: new Date() })).catch(() => undefined);
    return { success: true, status: "sent" as const, message: "WhatsApp notification sent", providerMessageId };
  } catch (error: any) {
    const errorMessage = String(error?.message || "WhatsApp delivery failed").slice(0, 240);
    await WhatsAppLog.create(logPayload(options, recipient, "failed", { errorCode: "WHATSAPP_REQUEST_FAILED", errorMessage })).catch(() => undefined);
    return { success: false, status: "failed" as const, message: errorMessage };
  }
}

export function formatWhatsAppMessage(title: string, fields: Array<[string, unknown]>, link?: string) {
  const lines = [`*${title}*`, "", ...fields.map(([label, value]) => `${label}: ${String(value ?? "—").trim() || "—"}`)];
  if (link) lines.push("", `View in admin: ${link}`);
  return lines.join("\n").slice(0, 4096);
}
