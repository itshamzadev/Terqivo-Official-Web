import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, trim: true, default: "" },
    fullDescription: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    thumbnail: { type: String, trim: true, default: "" },
    coverImage: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
    level: { type: String, trim: true, default: "" },
    format: { type: String, trim: true, default: "" },
    learningMode: { type: String, trim: true, default: "" },
    duration: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    summary: { type: String, trim: true, default: "" },
    features: [{ type: String, trim: true }],
    price: { type: Number, min: 0, default: 0 },
    salePrice: { type: Number, min: 0 },
    currencyId: { type: Schema.Types.ObjectId, ref: "Currency" },
    enrollmentStatus: { type: String, enum: ["open", "closed"], default: "open" },
    limitedSeats: { type: Boolean, default: false },
    totalSeats: { type: Number, min: 0 },
    remainingSeats: { type: Number, min: 0 },
    status: { type: String, enum: ["active", "inactive", "draft", "archived", "published"], default: "draft" },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    whatsappContact: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

export const Course = model('Course', courseSchema);
