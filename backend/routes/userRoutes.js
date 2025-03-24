import { Router } from "express";
import {
  getNewAccessToken,
  getUserDetails,
  login,
  logout,
  register,
  sendOpt,
  verifyOpt,
} from "../controllers/userControllers.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh", verifyRefreshToken, getNewAccessToken);
router.get("/me", verifyAccessToken, getUserDetails);
router.get("/send-opt", verifyAccessToken, sendOpt);
router.post("/verify-opt", verifyAccessToken, verifyOpt);

export default router;
