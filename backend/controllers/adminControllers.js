import User from "../models/User.js";
import { errorResponse, successResponse } from "../utils/responses.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    successResponse({ data: users, res });
  } catch (error) {
    errorResponse({ code: 404, error, res });
  }
};

// // Promote User to Admin
// router.put("/promote/:id", verifyToken, isAdmin, async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(req.params.id, { role: "admin" });
//     res.json({ message: "User promoted to Admin" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to promote user" });
//   }
// });

// // Demote Admin to User
// router.put("/demote/:id", verifyToken, isAdmin, async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(req.params.id, { role: "user" });
//     res.json({ message: "Admin demoted to User" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to demote user" });
//   }
// });
