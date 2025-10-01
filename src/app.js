import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./db.js";

import healthRouter from "./routes/health.route.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// DB connect
connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "🚀 Inspire Academy CRM Backend is running",
    endpoints: ["/api/health", "/api/auth", "/api/users"]
  });
});


// Routes
app.use("/api/health", healthRouter);

// Local dev only (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;
