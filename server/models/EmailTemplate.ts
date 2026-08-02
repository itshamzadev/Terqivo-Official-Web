import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true, trim: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  htmlBody: { type: String, required: true },
  textBody: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  availableVariables: [{ type: String, trim: true }],
  description: { type: String, trim: true, default: "" },
}, { timestamps: true });

export const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);
