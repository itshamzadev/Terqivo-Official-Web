import crypto from "crypto";
import { sendTemplateEmail } from "./emailService";

export const VERIFICATION_EXPIRY_MS = 15 * 60 * 1000;
export const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;
export const VERIFICATION_SEND_WINDOW_MS = 60 * 60 * 1000;
export const VERIFICATION_SEND_LIMIT = 5;
export const VERIFICATION_CODE_ATTEMPT_LIMIT = 5;
export const VERIFICATION_CODE_LOCK_MS = 15 * 60 * 1000;

const hashValue = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
const createToken = () => crypto.randomBytes(32).toString("hex");
const createCode = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
const appUrl = () => /^https?:\/\//i.test(process.env.APP_URL || "") ? String(process.env.APP_URL).replace(/\/$/, "") : "";

export function safeHashMatches(rawValue: string, storedHash: unknown) {
  const normalizedStoredHash = typeof storedHash === "string" ? storedHash : String(storedHash || "");
  if (!normalizedStoredHash) return false;
  const expected = Buffer.from(normalizedStoredHash, "hex");
  const actual = Buffer.from(hashValue(rawValue), "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export function verificationSendAvailable(user: any, now = Date.now()) {
  const lastSent = user.emailVerificationLastSentAt ? new Date(user.emailVerificationLastSentAt).getTime() : 0;
  const sendCount = lastSent && now - lastSent < VERIFICATION_SEND_WINDOW_MS ? Number(user.emailVerificationSendCount || 0) : 0;
  return {
    available: !lastSent || now - lastSent >= VERIFICATION_RESEND_COOLDOWN_MS,
    remainingSeconds: lastSent ? Math.max(0, Math.ceil((VERIFICATION_RESEND_COOLDOWN_MS - (now - lastSent)) / 1000)) : 0,
    sendCount,
    exhausted: sendCount >= VERIFICATION_SEND_LIMIT,
  };
}

export function clearVerificationFields(user: any) {
  user.emailVerificationTokenHash = "";
  user.emailVerificationTokenExpiresAt = undefined;
  user.emailVerificationExpiresAt = undefined;
  user.emailVerificationCodeHash = "";
  user.emailVerificationCodeExpiresAt = undefined;
  user.emailVerificationCodeAttempts = 0;
  user.emailVerificationLockedUntil = undefined;
}

export async function issueVerification(user: any, templateKey = "user_email_verification") {
  const now = Date.now();
  const rawToken = createToken();
  const rawCode = createCode();
  const expiresAt = new Date(now + VERIFICATION_EXPIRY_MS);
  const availability = verificationSendAvailable(user, now);

  user.emailVerificationTokenHash = hashValue(rawToken);
  user.emailVerificationTokenExpiresAt = expiresAt;
  // Keep the legacy expiry populated until all old records have naturally aged out.
  user.emailVerificationExpiresAt = expiresAt;
  user.emailVerificationCodeHash = hashValue(rawCode);
  user.emailVerificationCodeExpiresAt = expiresAt;
  user.emailVerificationCodeAttempts = 0;
  user.emailVerificationLockedUntil = undefined;
  user.emailVerificationLastSentAt = new Date(now);
  user.emailVerificationSendCount = availability.sendCount + 1;
  await user.save();

  return sendTemplateEmail({
    to: user.email,
    recipientName: user.name,
    templateKey,
    data: {
      name: user.name,
      username: user.username,
      email: user.email,
      verificationUrl: `${appUrl()}/verify-email?token=${encodeURIComponent(rawToken)}`,
      verificationCode: rawCode,
      expiresIn: "15 minutes",
    },
    relatedEntityType: "User",
    relatedEntityId: String(user._id),
    category: "authentication",
  });
}
