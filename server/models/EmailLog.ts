import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema({
  recipient: { type: String, required: true, trim: true },
  recipientName: { type: String, trim: true, default: "" },
  subject: { type: String, trim: true, default: "" },
  templateKey: { type: String, trim: true, default: "" },
  category: { type: String, trim: true, default: "" },
  relatedEntityType: { type: String, trim: true, default: "" },
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId },
  status: { type: String, enum: ["pending", "sent", "failed", "skipped", "disabled"], default: "pending", index: true },
  providerMessageId: { type: String, trim: true, default: "" },
  errorCode: { type: String, trim: true, default: "" },
  safeErrorMessage: { type: String, trim: true, default: "" },
  htmlSnapshot: { type: String, default: "" },
  textSnapshot: { type: String, default: "" },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
  sentAt: { type: Date },
}, { timestamps: true });

emailLogSchema.index({ recipient: 1, createdAt: -1 });

export const EmailLog = mongoose.model("EmailLog", emailLogSchema);
