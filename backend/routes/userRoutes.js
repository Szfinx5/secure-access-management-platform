import { Router } from "express";
import {
  getNewAccessToken,
  getUserDetails,
  login,
  logout,
  register,
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

// // Register Route
// router.post("/register", async (req, res) => {
//   const { email, password, name, phone, location, role } = req.body;
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   try {
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       name,
//       phone,
//       location,
//       role,
//     });
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (err) {
//     res.status(400).json({ error: "User already exists!" });
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "User not found!" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ error: "Invalid credentials!" });

//     const accessToken = jwt.sign(
//       { id: user._id, role: user.role },
//       ACCESS_SECRET,
//       {
//         expiresIn: "15m",
//       }
//     );
//     const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
//       expiresIn: "7d",
//     });

//     res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
//     res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
//     res.json({
//       accessToken,
//       user: { id: user._id, username: user.username, role: user.role },
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Server error!" });
//   }
// });

// // Logout Route
// router.post("/logout", (req, res) => {
//   res.clearCookie("refreshToken");
//   res.clearCookie("accessToken");
//   res.json({ message: "Logged out successfully!" });
// });

// // Get logged in user's details
// router.get("/me", verifyToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Generate new access token
// router.post("/refresh", verifyRefreshToken, async (req, res) => {
//   const user = await User.findById(req.user.id);
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const newAccessToken = jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: "15m" }
//   );

//   res.json({ accessToken: newAccessToken });
// });

export default router;
