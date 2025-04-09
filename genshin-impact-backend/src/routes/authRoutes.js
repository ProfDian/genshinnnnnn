const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { uploadProfileImage } = require("../config/cloudinary");

// Public routes
router.post(
  "/register",
  uploadProfileImage.single("profileImage"),
  authController.registerUser
);
router.post("/login", authController.loginUser);

// Protected routes
router.get("/me", verifyToken, authController.getCurrentUser);
router.put(
  "/profile",
  verifyToken,
  uploadProfileImage.single("profileImage"),
  authController.updateProfile
);
router.put("/change-password", verifyToken, authController.changePassword);

module.exports = router;
