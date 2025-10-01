import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


let cached = global._mongoose || { conn: null, promise: null };
global._mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => {
      console.log("✅ MongoDB Connected");
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
