import nodemailer, { type Transporter } from "nodemailer";
import { EmailLog } from "../models/EmailLog";
import { EmailTemplate } from "../models/EmailTemplate";
import { SiteSettings } from "../models/SiteSettings";

export type EmailDeliveryStatus = "pending" | "sent" | "failed" | "skipped" | "disabled";

type TemplateData = Record<string, unknown>;

const templateDefinitions: Array<[string, string, string, string, string, string[]]> = [
  ["course_enrollment_received", "Course enrollment received", "course", "We received your course enrollment request", "Confirmation sent after a course request.", ["applicantName", "courseTitle", "requestNumber", "amount", "currency", "paymentMethod", "status"]],
  ["course_enrollment_admin_notification", "New course enrollment notification", "course", "New course enrollment request: {{requestNumber}}", "Admin notification for a new request.", ["applicantName", "email", "phone", "courseTitle", "requestNumber", "amount", "currency", "transactionId", "adminUrl"]],
  ["course_enrollment_approved", "Course enrollment approved", "course", "Your course enrollment was approved", "Approval notification.", ["applicantName", "courseTitle", "requestNumber", "adminNote"]],
  ["course_enrollment_rejected", "Course enrollment rejected", "course", "Update on your course enrollment request", "Rejection notification.", ["applicantName", "courseTitle", "requestNumber", "adminNote"]],
  ["course_payment_verified", "Course payment verified", "payment", "Your course payment was verified", "Payment verification notification.", ["courseTitle", "requestNumber", "amount", "currency", "paymentMethod"]],
  ["course_payment_rejected", "Course payment rejected", "payment", "Action needed for your course payment", "Payment rejection notification.", ["courseTitle", "requestNumber", "adminNote"]],
  ["course_custom_reply", "Course applicant reply", "course", "Reply from Terqivo about your course request", "Custom course reply.", ["courseTitle", "requestNumber", "adminReply"]],
  ["job_application_received", "Job application received", "job", "We received your job application", "Applicant confirmation.", ["applicantName", "jobTitle", "applicationNumber", "status", "paymentStatus"]],
  ["job_application_admin_notification", "New job application notification", "job", "New job application: {{applicationNumber}}", "Admin notification.", ["applicantName", "email", "phone", "jobTitle", "applicationNumber", "paymentStatus", "adminUrl"]],
  ["job_payment_received", "Job payment received", "payment", "We received your application payment evidence", "Payment evidence confirmation.", ["applicationNumber", "jobTitle", "amount", "currency", "transactionId"]],
  ["job_payment_admin_notification", "Job payment notification", "payment", "New job application payment: {{applicationNumber}}", "Admin payment notification.", ["applicantName", "jobTitle", "applicationNumber", "transactionId"]],
  ["job_payment_verified", "Job payment verified", "payment", "Your job application payment was verified", "Payment verification.", ["applicationNumber", "jobTitle", "amount"]],
  ["job_payment_rejected", "Job payment rejected", "payment", "Action needed for your job application payment", "Payment rejection.", ["applicationNumber", "jobTitle", "adminReply"]],
  ["job_application_under_review", "Job application under review", "job", "Your job application is under review", "Status notification.", ["applicationNumber", "jobTitle"]],
  ["job_application_shortlisted", "Job application shortlisted", "job", "Your job application was shortlisted", "Status notification.", ["applicationNumber", "jobTitle", "adminReply"]],
  ["job_application_interview", "Job application interview stage", "job", "Your job application moved to interview", "Status notification.", ["applicationNumber", "jobTitle", "adminReply"]],
  ["job_application_selected", "Job application selected", "job", "Your job application was selected", "Status notification.", ["applicationNumber", "jobTitle"]],
  ["job_application_hired", "Job application hired", "job", "Hiring update from Terqivo", "Status notification.", ["applicationNumber", "jobTitle", "adminReply"]],
  ["job_application_rejected", "Job application update", "job", "Update on your job application", "Status notification.", ["applicationNumber", "jobTitle", "adminReply"]],
  ["job_application_custom_reply", "Job applicant reply", "job", "Reply from Terqivo about your application", "Custom reply.", ["applicationNumber", "jobTitle", "adminReply"]],
  ["contact_message_received", "Contact message received", "contact", "We received your message", "Visitor confirmation.", ["applicantName", "subject", "referenceNumber"]],
  ["contact_admin_notification", "New contact message", "contact", "New contact message: {{subject}}", "Admin notification.", ["applicantName", "email", "subject", "message", "adminUrl"]],
  ["contact_custom_reply", "Contact reply", "contact", "Reply from Terqivo", "Contact reply.", ["applicantName", "subject", "adminReply"]],
  ["test_email", "Test email", "system", "Terqivo test email", "SMTP diagnostic email.", ["recipient"]],
  ["generic_payment_submitted", "Payment submitted", "payment", "Payment evidence received", "Generic payment notification.", ["amount", "currency", "paymentMethod", "transactionId"]],
  ["generic_payment_verified", "Payment verified", "payment", "Payment verified", "Generic payment notification.", ["amount", "currency", "paymentMethod"]],
  ["generic_payment_rejected", "Payment rejected", "payment", "Payment requires attention", "Generic payment notification.", ["adminNote"]],
];

let transporter: Transporter | null = null;

function validEmail(value: unknown) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character] || character));
}

export function renderTemplate(template: string, data: TemplateData) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key: string) => escapeHtml(data[key]));
}

function configuredTransporter() {
  if (transporter) return transporter;
  const port = Number(process.env.SMTP_PORT || 587);
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: String(process.env.SMTP_SECURE || (port === 465)).toLowerCase() === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  return transporter;
}

function safeError(error: unknown) {
  const candidate = error as { code?: string; responseCode?: number; message?: string };
  const raw = String(candidate?.message || "Email delivery failed");
  return { code: String(candidate?.code || candidate?.responseCode || "EMAIL_DELIVERY_FAILED"), message: raw.replace(/password|pass|auth\s*[:=][^\s]+/gi, "credential") .slice(0, 240) };
}

export async function ensureDefaultEmailTemplates() {
  for (const [key, name, category, subject, description, variables] of templateDefinitions) {
    const existing = await EmailTemplate.exists({ key });
    if (existing) continue;
    const body = `<p>Hello {{applicantName}},</p><p>{{body}}</p><p>Regards,<br>{{companyName}}</p>`;
    await EmailTemplate.create({ key, name, category, subject, htmlBody: body, textBody: `Hello {{applicantName}},\n\n{{body}}\n\nRegards,\n{{companyName}}`, availableVariables: variables, description });
  }
}

export function getTemplateDefinitions() { return templateDefinitions.map(([key, name, category, subject, description, variables]) => ({ key, name, category, subject, description, variables })); }

export async function verifyEmailTransport() {
  if (String(process.env.EMAIL_ENABLED || "true").toLowerCase() === "false") return { success: false, status: "disabled", message: "Email is disabled" };
  const current = configuredTransporter();
  if (!current) return { success: false, status: "configuration", message: "SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are required" };
  try { await current.verify(); return { success: true, status: "ready", message: "SMTP connection verified" }; }
  catch (error) { const safe = safeError(error); return { success: false, status: safe.code, message: safe.message }; }
}

export async function sendEmail(options: { to: string; subject: string; html: string; text: string; category?: string; templateKey?: string; relatedEntityType?: string; relatedEntityId?: string; sentBy?: string; recipientName?: string }) {
  const logData = { recipient: options.to.trim(), recipientName: options.recipientName || "", subject: options.subject.slice(0, 200), templateKey: options.templateKey || "", category: options.category || "", relatedEntityType: options.relatedEntityType || "", htmlSnapshot: options.html, textSnapshot: options.text, ...(options.relatedEntityId ? { relatedEntityId: options.relatedEntityId } : {}), ...(options.sentBy ? { sentBy: options.sentBy } : {}) };
  if (!validEmail(options.to)) return { success: false, status: "failed" as EmailDeliveryStatus, message: "Invalid recipient email" };
  if (String(process.env.EMAIL_ENABLED || "true").toLowerCase() === "false") {
    await EmailLog.create({ ...logData, status: "disabled", safeErrorMessage: "Email is disabled" }).catch(() => undefined);
    return { success: false, status: "disabled" as EmailDeliveryStatus, message: "Email is disabled" };
  }
  const settings = await SiteSettings.getSettings();
  if (settings.email?.emailEnabled === false) {
    await EmailLog.create({ ...logData, status: "disabled", safeErrorMessage: "Email is disabled in settings" }).catch(() => undefined);
    return { success: false, status: "disabled" as EmailDeliveryStatus, message: "Email is disabled in settings" };
  }
  const current = configuredTransporter();
  if (!current) {
    await EmailLog.create({ ...logData, status: "failed", safeErrorMessage: "SMTP is not configured", errorCode: "SMTP_NOT_CONFIGURED" }).catch(() => undefined);
    return { success: false, status: "failed" as EmailDeliveryStatus, message: "SMTP is not configured" };
  }
  try {
    const info = await current.sendMail({
      from: `"${settings.email?.senderName || process.env.SMTP_FROM_NAME || "Terqivo Support"}" <${settings.email?.senderEmail || process.env.SMTP_FROM_EMAIL || "support@terqivo.com"}>`,
      to: options.to,
      replyTo: settings.email?.replyToEmail || process.env.SMTP_REPLY_TO || "support@terqivo.com",
      subject: options.subject.replace(/[\r\n]/g, " ").slice(0, 200),
      html: options.html,
      text: options.text,
    });
    await EmailLog.create({ ...logData, status: "sent", providerMessageId: info.messageId || "", sentAt: new Date() }).catch(() => undefined);
    return { success: true, status: "sent" as EmailDeliveryStatus, messageId: info.messageId };
  } catch (error) {
    const safe = safeError(error);
    await EmailLog.create({ ...logData, status: "failed", errorCode: safe.code, safeErrorMessage: safe.message }).catch(() => undefined);
    return { success: false, status: "failed" as EmailDeliveryStatus, message: safe.message };
  }
}

export async function sendTemplateEmail(options: { to: string; templateKey: string; data: TemplateData; category?: string; relatedEntityType?: string; relatedEntityId?: string; sentBy?: string; recipientName?: string }) {
  const template = await EmailTemplate.findOne({ key: options.templateKey }).lean();
  if (!template || template.enabled === false) return { success: false, status: "skipped" as EmailDeliveryStatus, message: "Template is unavailable or disabled" };
  const settings = await SiteSettings.getSettings();
  const fallbackBody = options.data.body || options.data.adminReply || `Your ${template.category || "Terqivo"} update is available in this message.`;
  const data = { ...options.data, body: fallbackBody, companyName: options.data.companyName || settings.email?.companyName || "Terqivo", supportEmail: options.data.supportEmail || settings.email?.senderEmail || "support@terqivo.com", websiteUrl: options.data.websiteUrl || settings.email?.websiteUrl || process.env.APP_URL || "" , year: new Date().getFullYear() };
  return sendEmail({ to: options.to, subject: renderTemplate(template.subject, data), html: renderTemplate(template.htmlBody, data), text: renderTemplate(template.textBody, data), category: options.category || template.category, templateKey: template.key, relatedEntityType: options.relatedEntityType, relatedEntityId: options.relatedEntityId, sentBy: options.sentBy, recipientName: options.recipientName });
}

export async function sendApplicantNotification(options: { to: string; templateKey: string; data: TemplateData; relatedEntityType: string; relatedEntityId: string; category?: string }) {
  return sendTemplateEmail(options);
}
