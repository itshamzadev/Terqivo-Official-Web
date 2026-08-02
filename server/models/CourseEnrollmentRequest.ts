import mongoose from "mongoose";

const courseEnrollmentRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: String, required: true, unique: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    courseTitleSnapshot: { type: String, required: true, trim: true },
    applicantName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    paymentAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentAccount", required: true },
    paymentMethodSnapshot: { type: String, required: true, trim: true },
    paymentAccountSnapshot: { type: String, required: true, trim: true },
    amountSnapshot: { type: Number, default: 0 },
    currencySnapshot: {
      name: { type: String, default: "" },
      code: { type: String, default: "" },
      symbol: { type: String, default: "" },
      prefix: { type: String, default: "" },
      suffix: { type: String, default: "" },
    },
    transactionId: { type: String, required: true, trim: true },
    paymentScreenshot: { type: String, required: true, trim: true },
    message: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    adminNote: { type: String, trim: true, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
    reviewedAt: { type: Date },
    lastEmailSentAt: { type: Date },
    emailHistory: [{
      subject: { type: String, trim: true }, templateKey: { type: String, trim: true }, recipient: { type: String, trim: true }, sentAt: { type: Date },
      sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" }, status: { type: String, enum: ["pending", "sent", "failed", "skipped", "disabled"] }, errorSummary: { type: String, trim: true },
    }],
  },
  { timestamps: true },
);

courseEnrollmentRequestSchema.index({ email: 1, courseId: 1, transactionId: 1 });

export const CourseEnrollmentRequest = mongoose.model("CourseEnrollmentRequest", courseEnrollmentRequestSchema);
