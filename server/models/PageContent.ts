import { Schema, model } from 'mongoose';

const pageContentSchema = new Schema({
  page: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

export const PageContent = model('PageContent', pageContentSchema);
