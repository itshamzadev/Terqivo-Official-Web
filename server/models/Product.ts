import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  thumbnail: { type: String },
  category: { type: String },
  description: { type: String },
  summary: { type: String },
  features: [{ type: String }],
  platform: { type: String },
  version: { type: String },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
  downloadUrl: { type: String },
  liveUrl: { type: String },
  githubUrl: { type: String },
  documentationUrl: { type: String },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
