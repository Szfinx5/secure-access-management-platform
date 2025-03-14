import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Register Route
router.post("/register", async (req, res) => {
  const { email, password, name, phone, location, role } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      location,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(400).json({ error: "User already exists!" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials!" });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({
      accessToken,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error!" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully!" });
});

export default router;
