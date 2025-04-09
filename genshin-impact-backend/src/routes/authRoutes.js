const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Register user
router.post("/register", authController.registerUser);

// Get current user
router.get("/user", verifyToken, authController.getCurrentUser);

module.exports = router;
