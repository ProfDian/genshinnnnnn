const express = require("express");
const router = express.Router();
const weaponController = require("../controllers/weaponController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const { uploadWeapon } = require("../config/cloudinary");

// Public routes
router.get("/", weaponController.getAllWeapons);
router.get("/:id", weaponController.getWeaponById);

// Admin routes
router.post(
  "/",
  verifyToken,
  isAdmin,
  uploadWeapon.single("icon"),
  weaponController.createWeapon
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  uploadWeapon.single("icon"),
  weaponController.updateWeapon
);

router.delete("/:id", verifyToken, isAdmin, weaponController.deleteWeapon);

module.exports = router;
