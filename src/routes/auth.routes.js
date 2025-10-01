import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createUser,
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../controllers/auth/auth.controller.js";

const router = express.Router();

// Auth
router.post("/login", loginUser);        
router.get("/me", protect, getCurrentUser); 
router.post("/create", protect, createUser);
router.post("/logout", logoutUser);   
export default router;
