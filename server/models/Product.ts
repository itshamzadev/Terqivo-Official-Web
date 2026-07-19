import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  thumbnail: { type: String },
  category: { type: String },
  description: { type: String, required: true },
  summary: { type: String, required: true },
  features: [{ type: String }],
  platforms: [{ type: String }],
  version: { type: String },
  status: { type: String, enum: ['active', 'deprecated', 'in-development'], default: 'active' },
  downloadUrl: { type: String },
  liveUrl: { type: String },
  githubUrl: { type: String },
  documentationUrl: { type: String },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

export const Product = model('Product', productSchema);
