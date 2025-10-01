import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

const router = Router();

// POST /api/users/register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  })
);

// GET /api/users
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
  })
);

export default router;
