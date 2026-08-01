import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  coverImage: { type: String },
  excerpt: { type: String },
  content: { type: String }, // Markdown or HTML
  category: { type: String },
  tags: [{ type: String }],
  author: { type: String },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  featured: { type: Boolean, default: false },
  publishDate: { type: Date, default: Date.now },
  seoTitle: { type: String },
  seoDescription: { type: String }
}, { timestamps: true });

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
