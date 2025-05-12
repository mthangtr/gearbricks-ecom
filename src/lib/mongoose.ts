import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URI || "";

if (!MONGODB_URI) throw new Error("Missing DATABASE_URL");

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected with Mongoose");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
