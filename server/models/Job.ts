import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  department: { type: String },
  location: { type: String },
  workType: { type: String }, // Remote, On-site, Hybrid
  experienceLevel: { type: String },
  description: { type: String },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  status: { type: String, enum: ['open', 'closed', 'draft'], default: 'draft' },
  deadline: { type: Date },
  applicationFeeEnabled: { type: Boolean, default: false },
  applicationFeeRequired: { type: Boolean, default: false },
  applicationFeeAmount: { type: Number, min: 0, default: 0 },
  applicationFeeCurrencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency' },
  allowedPaymentAccountIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentAccount' }],
  allowWhatsAppApplication: { type: Boolean, default: false },
  applicationWhatsAppNumber: { type: String, trim: true, default: '' },
  applicationWhatsAppMessage: { type: String, trim: true, default: 'Hello Terqivo, I want to discuss the {jobTitle} opportunity.' },
  applicationInstructions: { type: String, trim: true, default: '' },
  requirePaymentScreenshot: { type: Boolean, default: false },
  requireTransactionId: { type: Boolean, default: false },
  applicationsOpen: { type: Boolean, default: true },
  applicationDeadline: { type: Date },
  maxApplications: { type: Number, min: 0 },
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);
