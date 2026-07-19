import { Schema, model } from 'mongoose';

const blogPostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  coverImage: { type: String },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String },
  tags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  isFeatured: { type: Boolean, default: false },
  publishDate: { type: Date },
  seoTitle: { type: String },
  seoDescription: { type: String }
}, { timestamps: true });

export const BlogPost = model('BlogPost', blogPostSchema);
