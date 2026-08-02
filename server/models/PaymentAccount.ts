import mongoose from "mongoose";

const paymentAccountSchema = new mongoose.Schema(
  {
    accountTitle: { type: String, required: true, trim: true },
    paymentMethod: { type: String, required: true, trim: true },
    bankName: { type: String, trim: true, default: "" },
    accountNumber: { type: String, trim: true, default: "" },
    iban: { type: String, trim: true, default: "" },
    walletNumber: { type: String, trim: true, default: "" },
    instructions: { type: String, trim: true, default: "" },
    requiresTransactionId: { type: Boolean, default: true },
    logo: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const PaymentAccount = mongoose.model("PaymentAccount", paymentAccountSchema);
