import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 30, match: /^[a-z0-9_.]+$/i, index: true },
  password: { type: String, select: false, default: undefined },
  avatar: { type: String, trim: true, default: "" },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  googleId: { type: String, sparse: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  emailVerifiedAt: { type: Date },
  emailVerificationTokenHash: { type: String, select: false, default: "" },
  emailVerificationTokenExpiresAt: { type: Date, select: false },
  // Retained for compatibility with users created by the first verification implementation.
  emailVerificationExpiresAt: { type: Date, select: false },
  emailVerificationCodeHash: { type: String, select: false, default: "" },
  emailVerificationCodeExpiresAt: { type: Date, select: false },
  emailVerificationCodeAttempts: { type: Number, default: 0 },
  emailVerificationLastSentAt: { type: Date },
  emailVerificationSendCount: { type: Number, default: 0 },
  emailVerificationLockedUntil: { type: Date },
  passwordResetTokenHash: { type: String, select: false, default: "" },
  passwordResetExpiresAt: { type: Date, select: false },
  status: { type: String, enum: ["active", "suspended", "disabled"], default: "active", index: true },
  role: { type: String, enum: ["user"], default: "user" },
  lastLoginAt: { type: Date },
  lastLoginIp: { type: String, trim: true, default: "" },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date },
  sessionVersion: { type: Number, default: 0 },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
