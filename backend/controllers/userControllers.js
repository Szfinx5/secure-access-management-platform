import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken, logger } from "../utils/helpers.js";
import { errorResponse, successResponse } from "../utils/responses.js";
import { MAX_AGE_REFRESH_TOKEN } from "../utils/helpers.js";

const router = Router();

// Register Route
export const register = async (req, res) => {
  const { email, password, name, phone, location, role } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    if (!email || !password || !name || !phone || !location || !role)
      throw new Error("Please fill all fields!");

    const user = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      location,
      role,
    });
    await user.save();

    const accessToken = generateToken(user, "access");
    const refreshToken = generateToken(user, "refresh");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: MAX_AGE_REFRESH_TOKEN,
      sameSite: "none",
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    successResponse({ data: { accessToken, user: userWithoutPassword }, res });
  } catch (err) {
    logger.error(err);
    errorResponse({ code: 400, err, res });
  }
};

// Login Route
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) throw new Error("Please fill all fields!");

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials!");

    const accessToken = generateToken(user, "access");
    const refreshToken = generateToken(user, "refresh");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: MAX_AGE_REFRESH_TOKEN,
      sameSite: "none",
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    successResponse({ data: { accessToken, user: userWithoutPassword }, res });
  } catch (err) {
    logger.error(err);
    errorResponse({ code: 400, err, res });
  }
};

// Logout Route
export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken");
    successResponse({ data: "Logged out successfully", res });
  } catch (err) {
    logger.error(err);
    errorResponse({ code: 500, err, res });
  }
};

// Get logged in user's details
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    successResponse({ data: user, res });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Generate new access token
export const getNewAccessToken = async (req, res) => {
  try {
    const newAccessToken = generateToken(req.user, "access");
    successResponse({ data: newAccessToken, res });
  } catch (err) {
    logger.error(err);
    errorResponse({ code: 500, err, res });
  }
};

export default router;
