import { Router } from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = Router();

// Get All Users (Admin Only)
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Promote User to Admin
router.put("/promote/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: "admin" });
    res.json({ message: "User promoted to Admin" });
  } catch (err) {
    res.status(500).json({ error: "Failed to promote user" });
  }
});

// Demote Admin to User
router.put("/demote/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: "user" });
    res.json({ message: "Admin demoted to User" });
  } catch (err) {
    res.status(500).json({ error: "Failed to demote user" });
  }
});

export default router;
