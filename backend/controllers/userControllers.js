import { Router } from "express";
import bcrypt from "bcryptjs";
import axios from "axios";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
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
    if (!req.user)
      return errorResponse({ code: 404, err: "User not found", res });
    const newAccessToken = generateToken(req.user, "access");
    successResponse({ data: newAccessToken, res });
  } catch (err) {
    logger.error(err);
    errorResponse({ code: 500, err, res });
  }
};

// Send OTP
export const sendOpt = async (req, res) => {
  try {
    const { phone } = req.user;
    if (!phone)
      return errorResponse({ code: 404, err: "Phone number not found", res });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const response = await axios.post(
      "https://messages-sandbox.nexmo.com/v1/messages",
      {
        from: process.env.VONAGE_WHATSAPP_NUMBER,
        to: phone,
        message_type: "text",
        text: `Your OTP code is ${otp}`,
        channel: "whatsapp",
      },
      {
        auth: {
          username: process.env.VONAGE_API_KEY,
          password: process.env.VONAGE_API_SECRET,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log("Response from Vonage:", response.data);

    await Otp.findOneAndUpdate(
      { phone },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    successResponse({ data: "OTP sent successfully", res });
  } catch (err) {
    logger.error("ERROR", err);
    errorResponse({ code: 500, err, res });
  }
};

// Verify OTP
export const verifyOpt = async (req, res) => {
  try {
    const { phone } = req.user;
    const { otp } = req.body;
    console.log("req.user", req.user);
    console.log("req.body", req.body);
    if (!phone || !otp) {
      throw new Error("Phone number and OTP are required");
    }

    const code = await Otp.findOne({ phone });
    console.log("code", code);

    if (!code) {
      throw new Error("Invalid or expired OTP");
    }

    if (code.otp !== otp) {
      throw new Error("Incorrect OTP");
    }

    await Otp.deleteOne({ phone });
    successResponse({ data: "OTP verified successfully", res });
  } catch (err) {
    logger.error(err);
    errorResponse({ code: 500, err, res });
  }
};

export default router;
