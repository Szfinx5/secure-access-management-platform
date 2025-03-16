import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logger } from "../utils/helpers.js";
import { errorResponse } from "../utils/responses.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const verifyAccessToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("No token provided");

    const decodedToken = jwt.verify(token, ACCESS_SECRET);
    if (!decodedToken) throw new Error("Invalid access token");

    req.user = await User.findById(decodedToken.id).select("-password");
    logger.info("User authenticated: ", req.user.email);
    next();
  } catch (err) {
    logger.error(err);
    errorResponse({ code: 403, err, res });
  }
};

export const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) throw new Error("No refresh token provided");

    const decodedToken = jwt.verify(refreshToken, REFRESH_SECRET);
    if (!decodedToken) throw new Error("Invalid refresh token");
    console.log("decodedToken: ", decodedToken);
    req.user = await User.findById(decodedToken.userId).select("-password");
    console.log(req.user);
    logger.info("User authenticated: ", req.user.email);
    next();
  } catch (err) {
    logger.error(err);
    errorResponse({ code: 403, err, res });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      throw new Error("Access denied: Admins only");
    next();
  } catch (err) {
    logger.error(err);
    errorResponse({ code: 403, err, res });
  }
};
