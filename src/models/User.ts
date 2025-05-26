import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  balance: number;
  orders?: mongoose.Types.ObjectId[];
  reviews?: mongoose.Types.ObjectId[];
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  isAdmin?: boolean;
  blindboxSpinCount: number;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: String,
    balance: { type: Number, default: 0 },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    isAdmin: { type: Boolean, default: false },
    blindboxSpinCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password trước khi lưu
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu
UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
