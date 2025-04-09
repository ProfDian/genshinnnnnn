const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// User favorites routes
router.get("/favorites", verifyToken, userController.getUserFavorites);
router.post("/favorites", verifyToken, userController.addToFavorites);
router.delete(
  "/favorites/:id",
  verifyToken,
  userController.removeFromFavorites
);

// Admin routes
router.get("/all", verifyToken, isAdmin, userController.getAllUsers);
router.put(
  "/:userId/toggle-admin",
  verifyToken,
  isAdmin,
  userController.toggleAdminStatus
);

module.exports = router;
