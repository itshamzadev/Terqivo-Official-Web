import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  name: { type: String, required: true },
  applicationNumber: { type: String, unique: true, sparse: true, index: true },
  jobTitleSnapshot: { type: String, trim: true, default: '' },
  applicantName: { type: String, trim: true, default: '' },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  currentCity: { type: String, trim: true, default: '' },
  country: { type: String, trim: true, default: '' },
  cvUrl: { type: String },
  resumePath: { type: String, trim: true, default: '' },
  coverLetter: { type: String },
  portfolioUrl: { type: String, trim: true, default: '' },
  linkedInUrl: { type: String, trim: true, default: '' },
  githubUrl: { type: String, trim: true, default: '' },
  applicantMessage: { type: String, trim: true, default: '' },
  paymentRequiredSnapshot: { type: Boolean, default: false },
  paymentAmountSnapshot: { type: Number, default: 0 },
  currencySnapshot: {
    name: { type: String, default: '' }, code: { type: String, default: '' }, symbol: { type: String, default: '' },
    prefix: { type: String, default: '' }, suffix: { type: String, default: '' },
  },
  paymentAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentAccount' },
  paymentAccountSnapshot: { type: String, trim: true, default: '' },
  transactionId: { type: String, trim: true, default: '' },
  paymentScreenshotPath: { type: String, trim: true, default: '' },
  paymentStatus: { type: String, enum: ['not-required', 'unpaid', 'submitted', 'verified', 'rejected'], default: 'not-required', index: true },
  applicationStatus: { type: String, enum: ['submitted', 'under-review', 'shortlisted', 'interview', 'selected', 'hired', 'rejected', 'withdrawn'], default: 'submitted', index: true },
  adminNote: { type: String, trim: true, default: '' },
  internalNote: { type: String, trim: true, default: '' },
  applicantReply: { type: String, trim: true, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  reviewedAt: { type: Date },
  lastEmailSentAt: { type: Date },
  emailHistory: [{
    subject: { type: String, trim: true }, messageSummary: { type: String, trim: true }, templateKey: { type: String, trim: true },
    recipient: { type: String, trim: true }, sentAt: { type: Date }, sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    status: { type: String, enum: ['pending', 'sent', 'failed', 'skipped', 'disabled'] }, errorSummary: { type: String, trim: true },
  }],
  status: { type: String, enum: ['pending', 'reviewed', 'interviewing', 'hired', 'rejected'], default: 'pending' }
}, { timestamps: true });

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
