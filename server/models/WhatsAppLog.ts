import mongoose from "mongoose";

const whatsAppLogSchema = new mongoose.Schema({
  recipient: { type: String, required: true, trim: true },
  eventType: { type: String, required: true, trim: true, index: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["sent", "failed", "skipped"], required: true, index: true },
  providerMessageId: { type: String, trim: true, default: "" },
  errorCode: { type: String, trim: true, default: "" },
  errorMessage: { type: String, trim: true, default: "" },
  relatedEntityType: { type: String, trim: true, default: "" },
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId },
  sentAt: { type: Date },
}, { timestamps: true });

whatsAppLogSchema.index({ createdAt: -1 });

export const WhatsAppLog = mongoose.model("WhatsAppLog", whatsAppLogSchema);
