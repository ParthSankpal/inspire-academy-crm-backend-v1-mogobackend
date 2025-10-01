import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Check DB connection state
    const state = mongoose.connection.readyState;
    let dbStatus = "disconnected";

    switch (state) {
      case 0:
        dbStatus = "disconnected";
        break;
      case 1:
        dbStatus = "connected";
        break;
      case 2:
        dbStatus = "connecting";
        break;
      case 3:
        dbStatus = "disconnecting";
        break;
    }

    res.json({
      status: "ok",
      env: process.env.NODE_ENV,
      db: dbStatus,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
