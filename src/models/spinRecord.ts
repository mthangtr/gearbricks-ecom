// models/spinRecord.ts
import mongoose from "mongoose";

const SpinRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blindbox: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blindbox",
    required: true,
  },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  success: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const SpinRecord =
  mongoose.models.SpinRecord || mongoose.model("SpinRecord", SpinRecordSchema);
