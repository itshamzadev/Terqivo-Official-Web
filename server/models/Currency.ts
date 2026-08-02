import mongoose from "mongoose";

const currencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true, unique: true },
    symbol: { type: String, trim: true, default: "" },
    prefix: { type: String, trim: true, default: "" },
    suffix: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Currency = mongoose.model("Currency", currencySchema);
