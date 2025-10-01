import mongoose from "mongoose";

let cached = global._mongoose || { conn: null, promise: null };
global._mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI not defined in environment variables");
    }

    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // avoid infinite waiting
    })
    .then((m) => {
      console.log("✅ MongoDB Connected");
      return m;
    })
    .catch((err) => {
      console.error("❌ MongoDB Connection Failed:", err.message);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
