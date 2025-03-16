import { Router } from "express";
import { isAdmin, verifyAccessToken } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/adminControllers.js";

const router = Router();

router.get("/users", verifyAccessToken, isAdmin, getAllUsers);

export default router;
