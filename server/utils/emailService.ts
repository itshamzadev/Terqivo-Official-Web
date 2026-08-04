import nodemailer, { type Transporter } from "nodemailer";
import { EmailLog } from "../models/EmailLog";
import { EmailTemplate } from "../models/EmailTemplate";
import { SiteSettings } from "../models/SiteSettings";

export type EmailDeliveryStatus =
  | "pending"
  | "sent"
  | "failed"
  | "skipped"
  | "disabled";

type TemplateData = Record<string, unknown>;

const templateDefinitions: Array<
  [string, string, string, string, string, string[]]
> = [
  [
    "course_enrollment_received",
    "Course enrollment received",
    "course",
    "We received your course enrollment request",
    "Confirmation sent after a course request.",
    [
      "applicantName",
      "courseTitle",
      "requestNumber",
      "amount",
      "currency",
      "paymentMethod",
      "status",
    ],
  ],
  [
    "course_enrollment_admin_notification",
    "New course enrollment notification",
    "course",
    "New course enrollment request: {{requestNumber}}",
    "Admin notification for a new request.",
    [
      "applicantName",
      "email",
      "phone",
      "courseTitle",
      "requestNumber",
      "amount",
      "currency",
      "transactionId",
      "adminUrl",
    ],
  ],
  [
    "course_enrollment_approved",
    "Course enrollment approved",
    "course",
    "Your course enrollment was approved",
    "Approval notification.",
    ["applicantName", "courseTitle", "requestNumber", "adminNote"],
  ],
  [
    "course_enrollment_rejected",
    "Course enrollment rejected",
    "course",
    "Update on your course enrollment request",
    "Rejection notification.",
    ["applicantName", "courseTitle", "requestNumber", "adminNote"],
  ],
  [
    "course_payment_verified",
    "Course payment verified",
    "payment",
    "Your course payment was verified",
    "Payment verification notification.",
    ["courseTitle", "requestNumber", "amount", "currency", "paymentMethod"],
  ],
  [
    "course_payment_rejected",
    "Course payment rejected",
    "payment",
    "Action needed for your course payment",
    "Payment rejection notification.",
    ["courseTitle", "requestNumber", "adminNote"],
  ],
  [
    "course_custom_reply",
    "Course applicant reply",
    "course",
    "Reply from Terqivo about your course request",
    "Custom course reply.",
    ["courseTitle", "requestNumber", "adminReply"],
  ],
  [
    "job_application_received",
    "Job application received",
    "job",
    "We received your job application",
    "Applicant confirmation.",
    [
      "applicantName",
      "jobTitle",
      "applicationNumber",
      "status",
      "paymentStatus",
    ],
  ],
  [
    "job_application_admin_notification",
    "New job application notification",
    "job",
    "New job application: {{applicationNumber}}",
    "Admin notification.",
    [
      "applicantName",
      "email",
      "phone",
      "jobTitle",
      "applicationNumber",
      "paymentStatus",
      "adminUrl",
    ],
  ],
  [
    "job_payment_received",
    "Job payment received",
    "payment",
    "We received your application payment evidence",
    "Payment evidence confirmation.",
    ["applicationNumber", "jobTitle", "amount", "currency", "transactionId"],
  ],
  [
    "job_payment_admin_notification",
    "Job payment notification",
    "payment",
    "New job application payment: {{applicationNumber}}",
    "Admin payment notification.",
    ["applicantName", "jobTitle", "applicationNumber", "transactionId"],
  ],
  [
    "job_payment_verified",
    "Job payment verified",
    "payment",
    "Your job application payment was verified",
    "Payment verification.",
    ["applicationNumber", "jobTitle", "amount"],
  ],
  [
    "job_payment_rejected",
    "Job payment rejected",
    "payment",
    "Action needed for your job application payment",
    "Payment rejection.",
    ["applicationNumber", "jobTitle", "adminReply"],
  ],
  [
    "job_application_under_review",
    "Job application under review",
    "job",
    "Your job application is under review",
    "Status notification.",
    ["applicationNumber", "jobTitle"],
  ],
  [
    "job_application_shortlisted",
    "Job application shortlisted",
    "job",
    "Your job application was shortlisted",
    "Status notification.",
    ["applicationNumber", "jobTitle", "adminReply"],
  ],
  [
    "job_application_interview",
    "Job application interview stage",
    "job",
    "Your job application moved to interview",
    "Status notification.",
    ["applicationNumber", "jobTitle", "adminReply"],
  ],
  [
    "job_application_selected",
    "Job application selected",
    "job",
    "Your job application was selected",
    "Status notification.",
    ["applicationNumber", "jobTitle"],
  ],
  [
    "job_application_hired",
    "Job application hired",
    "job",
    "Hiring update from Terqivo",
    "Status notification.",
    ["applicationNumber", "jobTitle", "adminReply"],
  ],
  [
    "job_application_rejected",
    "Job application update",
    "job",
    "Update on your job application",
    "Status notification.",
    ["applicationNumber", "jobTitle", "adminReply"],
  ],
  [
    "job_application_custom_reply",
    "Job applicant reply",
    "job",
    "Reply from Terqivo about your application",
    "Custom reply.",
    ["applicationNumber", "jobTitle", "adminReply"],
  ],
  [
    "contact_message_received",
    "Contact message received",
    "contact",
    "We received your message",
    "Visitor confirmation.",
    ["applicantName", "subject", "referenceNumber"],
  ],
  [
    "contact_admin_notification",
    "New contact message",
    "contact",
    "New contact message: {{subject}}",
    "Admin notification.",
    ["applicantName", "email", "subject", "message", "adminUrl"],
  ],
  [
    "contact_custom_reply",
    "Contact reply",
    "contact",
    "Reply from Terqivo",
    "Contact reply.",
    ["applicantName", "subject", "adminReply"],
  ],
  [
    "test_email",
    "Test email",
    "system",
    "Terqivo test email",
    "SMTP diagnostic email.",
    ["recipient"],
  ],
  [
    "generic_payment_submitted",
    "Payment submitted",
    "payment",
    "Payment evidence received",
    "Generic payment notification.",
    ["amount", "currency", "paymentMethod", "transactionId"],
  ],
  [
    "generic_payment_verified",
    "Payment verified",
    "payment",
    "Payment verified",
    "Generic payment notification.",
    ["amount", "currency", "paymentMethod"],
  ],
  [
    "generic_payment_rejected",
    "Payment rejected",
    "payment",
    "Payment requires attention",
    "Generic payment notification.",
    ["adminNote"],
  ],
  ["user_signup_welcome", "Welcome user", "authentication", "Welcome to Terqivo, {{name}}", "Welcome message after signup.", ["name", "username", "email"]],
  ["user_email_verification", "Verify user email", "authentication", "Verify your Terqivo email", "Email verification message.", ["name", "username", "email", "verificationUrl", "verificationCode", "expiresIn", "companyName", "supportEmail", "websiteUrl", "year"]],
  ["user_email_verified", "Email verified", "authentication", "Your Terqivo email is verified", "Verification success message.", ["name", "username", "email", "companyName", "supportEmail", "websiteUrl", "year"]],
  ["user_verification_resend", "Verification email resent", "authentication", "Verify your Terqivo email", "Resent verification message.", ["name", "username", "email", "verificationUrl", "verificationCode", "expiresIn", "companyName", "supportEmail", "websiteUrl", "year"]],
  ["user_password_reset_request", "Password reset request", "authentication", "Reset your Terqivo password", "Password reset instructions.", ["name", "resetUrl", "expiresIn"]],
  ["user_password_reset_success", "Password reset success", "authentication", "Your Terqivo password was reset", "Password reset success message.", ["name", "username"]],
  ["user_password_changed", "Password changed", "authentication", "Your Terqivo password was changed", "Password change message.", ["name", "username"]],
  ["user_account_suspended", "Account suspended", "authentication", "Your Terqivo account is suspended", "Account suspension notification.", ["name", "username"]],
  ["user_account_reactivated", "Account reactivated", "authentication", "Your Terqivo account is active again", "Account reactivation notification.", ["name", "username"]],
];

let transporter: Transporter | null = null;

function validEmail(value: unknown) {
  return (
    typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] || character,
  );
}

export function renderTemplate(template: string, data: TemplateData) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key: string) =>
    escapeHtml(data[key]),
  );
}

function configuredTransporter() {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT || 465);

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure:
      String(process.env.SMTP_SECURE || port === 465).toLowerCase() === "true",

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,

    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
}

function safeError(error: unknown) {
  const candidate = error as {
    code?: string;
    responseCode?: number;
    message?: string;
  };
  const raw = String(candidate?.message || "Email delivery failed");
  return {
    code: String(
      candidate?.code || candidate?.responseCode || "EMAIL_DELIVERY_FAILED",
    ),
    message: raw
      .replace(/password|pass|auth\s*[:=][^\s]+/gi, "credential")
      .slice(0, 240),
  };
}

function redactSensitiveEmailContent(value: string, templateKey: string) {
  if (!templateKey.startsWith("user_email_verification") && !templateKey.includes("verification") && !templateKey.startsWith("user_password_reset")) return value;
  return value.replace(/([?&]token=)[^&\s"'<>]+/gi, "$1REDACTED").replace(/\b\d{6}\b/g, "[REDACTED_CODE]");
}

export async function ensureDefaultEmailTemplates() {
  for (const [
    key,
    name,
    category,
    subject,
    description,
    variables,
  ] of templateDefinitions) {
    const existing: any = await EmailTemplate.findOne({ key });
    if (existing) {
      const requiredVariables = variables.filter((variable) => !(existing.availableVariables || []).includes(variable));
      if (["user_email_verification", "user_verification_resend"].includes(key) && (requiredVariables.length || !existing.htmlBody.includes("{{verificationCode}}") || !existing.textBody.includes("{{verificationCode}}"))) {
        const verificationHtml = '<hr><h2>Verify your email address</h2><p>Use either the button or the 6-digit code below. This verification expires in {{expiresIn}}.</p><p style="text-align:center"><a href="{{verificationUrl}}" style="display:inline-block;background:#111827;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none">Verify your email</a></p><p style="font-size:28px;letter-spacing:8px;font-weight:700;text-align:center">{{verificationCode}}</p><p>If you did not create this account, you can safely ignore this email. Need help? Contact {{supportEmail}}.</p>';
        const verificationText = '\n\nVerify your email address using either this link or the 6-digit code:\n{{verificationUrl}}\nCode: {{verificationCode}}\nThis expires in {{expiresIn}}. If you did not create this account, ignore this email. Support: {{supportEmail}}.';
        await EmailTemplate.updateOne({ _id: existing._id }, { $addToSet: { availableVariables: { $each: requiredVariables } }, $set: { htmlBody: existing.htmlBody.includes("{{verificationCode}}") ? existing.htmlBody : `${existing.htmlBody}${verificationHtml}`, textBody: existing.textBody.includes("{{verificationCode}}") ? existing.textBody : `${existing.textBody}${verificationText}` } });
      } else if (key === "user_email_verified" && (requiredVariables.length || !existing.htmlBody.includes("Email verified") || !existing.textBody.includes("Email verified"))) {
        await EmailTemplate.updateOne({ _id: existing._id }, { $addToSet: { availableVariables: { $each: requiredVariables } }, $set: { htmlBody: existing.htmlBody.includes("Email verified") ? existing.htmlBody : `${existing.htmlBody}<p>Email verified successfully. Your account is ready. Visit {{websiteUrl}} or contact {{supportEmail}}.</p>`, textBody: existing.textBody.includes("Email verified") ? existing.textBody : `${existing.textBody}\n\nEmail verified successfully. Your account is ready. Visit {{websiteUrl}} or contact {{supportEmail}}.` } });
      }
      continue;
    }
    const authBody: Record<string, { html: string; text: string }> = {
      user_email_verification: { html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto"><h1>Verify your email address</h1><p>Hello {{name}},</p><p>Verify the Terqivo account for <strong>{{username}}</strong> using either method below.</p><p style="text-align:center"><a href="{{verificationUrl}}" style="display:inline-block;background:#111827;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Verify your email</a></p><p style="font-size:28px;letter-spacing:8px;font-weight:700;text-align:center">{{verificationCode}}</p><p>This link and code expire in {{expiresIn}}.</p><p>If you did not create this account, ignore this email. Support: {{supportEmail}}</p></div>', text: 'Verify your email address\n\nHello {{name}},\n\nVerify using this link: {{verificationUrl}}\nOr enter this 6-digit code: {{verificationCode}}\nBoth expire in {{expiresIn}}. If you did not create this account, ignore this email. Support: {{supportEmail}}.' },
      user_verification_resend: { html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto"><h1>Verify your email address</h1><p>Hello {{name}},</p><p>Your new verification code is:</p><p style="font-size:28px;letter-spacing:8px;font-weight:700;text-align:center">{{verificationCode}}</p><p><a href="{{verificationUrl}}">Verify your email</a></p><p>This expires in {{expiresIn}}. Support: {{supportEmail}}</p></div>', text: 'Verify your email address\n\nCode: {{verificationCode}}\nLink: {{verificationUrl}}\nExpires in {{expiresIn}}. Support: {{supportEmail}}.' },
      user_password_reset_request: { html: '<p>Hello {{name}},</p><p>Reset your Terqivo password using the secure link below:</p><p><a href="{{resetUrl}}">Reset password</a></p><p>This link expires in {{expiresIn}}.</p>', text: 'Hello {{name}},\n\nReset your password: {{resetUrl}}\nThis link expires in {{expiresIn}}.' },
    };
    const body = authBody[key] || { html: `<p>Hello {{applicantName}},</p><p>{{body}}</p><p>Regards,<br>{{companyName}}</p>`, text: `Hello {{applicantName}},\n\n{{body}}\n\nRegards,\n{{companyName}}` };
    await EmailTemplate.create({
      key,
      name,
      category,
      subject,
      htmlBody: body.html,
      textBody: body.text,
      availableVariables: variables,
      description,
    });
  }
}

export function getTemplateDefinitions() {
  return templateDefinitions.map(
    ([key, name, category, subject, description, variables]) => ({
      key,
      name,
      category,
      subject,
      description,
      variables,
    }),
  );
}

export async function verifyEmailTransport() {
  if (String(process.env.EMAIL_ENABLED || "true").toLowerCase() === "false")
    return { success: false, status: "disabled", message: "Email is disabled" };
  const current = configuredTransporter();
  if (!current)
    return {
      success: false,
      status: "configuration",
      message: "SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are required",
    };
  try {
    await current.verify();
    return {
      success: true,
      status: "ready",
      message: "SMTP connection verified",
    };
  } catch (error) {
    const safe = safeError(error);
    return { success: false, status: safe.code, message: safe.message };
  }
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  category?: string;
  templateKey?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  sentBy?: string;
  recipientName?: string;
}) {
  const safeHtml = redactSensitiveEmailContent(options.html, options.templateKey || "");
  const safeText = redactSensitiveEmailContent(options.text, options.templateKey || "");
  const logData = {
    recipient: options.to.trim(),
    recipientName: options.recipientName || "",
    subject: options.subject.slice(0, 200),
    templateKey: options.templateKey || "",
    category: options.category || "",
    relatedEntityType: options.relatedEntityType || "",
    htmlSnapshot: safeHtml,
    textSnapshot: safeText,
    ...(options.relatedEntityId
      ? { relatedEntityId: options.relatedEntityId }
      : {}),
    ...(options.sentBy ? { sentBy: options.sentBy } : {}),
  };
  if (!validEmail(options.to))
    return {
      success: false,
      status: "failed" as EmailDeliveryStatus,
      message: "Invalid recipient email",
    };
  if (String(process.env.EMAIL_ENABLED || "true").toLowerCase() === "false") {
    await EmailLog.create({
      ...logData,
      status: "disabled",
      safeErrorMessage: "Email is disabled",
    }).catch(() => undefined);
    return {
      success: false,
      status: "disabled" as EmailDeliveryStatus,
      message: "Email is disabled",
    };
  }
  const settings = await SiteSettings.getSettings();
  if (settings.email?.emailEnabled === false) {
    await EmailLog.create({
      ...logData,
      status: "disabled",
      safeErrorMessage: "Email is disabled in settings",
    }).catch(() => undefined);
    return {
      success: false,
      status: "disabled" as EmailDeliveryStatus,
      message: "Email is disabled in settings",
    };
  }
  const current = configuredTransporter();
  if (!current) {
    await EmailLog.create({
      ...logData,
      status: "failed",
      safeErrorMessage: "SMTP is not configured",
      errorCode: "SMTP_NOT_CONFIGURED",
    }).catch(() => undefined);
    return {
      success: false,
      status: "failed" as EmailDeliveryStatus,
      message: "SMTP is not configured",
    };
  }
  try {
    const info = await current.sendMail({
      from: `"${settings.email?.senderName || process.env.SMTP_FROM_NAME || "Terqivo Support"}" <${settings.email?.senderEmail || process.env.SMTP_FROM_EMAIL || "support@terqivo.com"}>`,
      to: options.to,
      replyTo:
        settings.email?.replyToEmail ||
        process.env.SMTP_REPLY_TO ||
        "support@terqivo.com",
      subject: options.subject.replace(/[\r\n]/g, " ").slice(0, 200),
      html: options.html,
      text: options.text,
    });
    await EmailLog.create({
      ...logData,
      status: "sent",
      providerMessageId: info.messageId || "",
      sentAt: new Date(),
    }).catch(() => undefined);
    return {
      success: true,
      status: "sent" as EmailDeliveryStatus,
      messageId: info.messageId,
    };
  } catch (error) {
    const safe = safeError(error);
    await EmailLog.create({
      ...logData,
      status: "failed",
      errorCode: safe.code,
      safeErrorMessage: safe.message,
    }).catch(() => undefined);
    return {
      success: false,
      status: "failed" as EmailDeliveryStatus,
      message: safe.message,
    };
  }
}

export async function sendTemplateEmail(options: {
  to: string;
  templateKey: string;
  data: TemplateData;
  category?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  sentBy?: string;
  recipientName?: string;
}) {
  const template = await EmailTemplate.findOne({
    key: options.templateKey,
  }).lean();
  if (!template || template.enabled === false)
    return {
      success: false,
      status: "skipped" as EmailDeliveryStatus,
      message: "Template is unavailable or disabled",
    };
  const settings = await SiteSettings.getSettings();
  const fallbackBody =
    options.data.body ||
    options.data.adminReply ||
    `Your ${template.category || "Terqivo"} update is available in this message.`;
  const data = {
    ...options.data,
    body: fallbackBody,
    companyName:
      options.data.companyName || settings.email?.companyName || "Terqivo",
    supportEmail:
      options.data.supportEmail ||
      settings.email?.senderEmail ||
      "support@terqivo.com",
    websiteUrl:
      options.data.websiteUrl ||
      settings.email?.websiteUrl ||
      process.env.APP_URL ||
      "",
    year: new Date().getFullYear(),
  };
  return sendEmail({
    to: options.to,
    subject: renderTemplate(template.subject, data),
    html: renderTemplate(template.htmlBody, data),
    text: renderTemplate(template.textBody, data),
    category: options.category || template.category,
    templateKey: template.key,
    relatedEntityType: options.relatedEntityType,
    relatedEntityId: options.relatedEntityId,
    sentBy: options.sentBy,
    recipientName: options.recipientName,
  });
}

export async function sendApplicantNotification(options: {
  to: string;
  templateKey: string;
  data: TemplateData;
  relatedEntityType: string;
  relatedEntityId: string;
  category?: string;
}) {
  return sendTemplateEmail(options);
}
