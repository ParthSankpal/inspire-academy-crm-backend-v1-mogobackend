import mongoose from "mongoose";

let cached = global._mongoose || { conn: null, promise: null };
global._mongoose = cached;


export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI not defined in environment variables");
    }


    cached.promise = mongoose.connect("mongodb+srv://parthsankpal47_db_user:Z8IJY6WYSmSL7Flj@cluster0.qlqhlix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      serverSelectionTimeoutMS: 5000
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
