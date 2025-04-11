const express = require("express");
const router = express.Router();
const weaponStatController = require("../controllers/weaponStatController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Public routes - dapat diakses siapa saja
router.get("/types", weaponStatController.getWeaponTypes);
router.get("/subtypes", weaponStatController.getSubstatTypes);
router.get("/weapon/:weaponId", weaponStatController.getWeaponStats);

// Admin routes - hanya admin yang dapat mengubah data
router.post(
  "/weapon/:weaponId",
  verifyToken,
  isAdmin,
  weaponStatController.addWeaponStats
);

router.put(
  "/:statId",
  verifyToken,
  isAdmin,
  weaponStatController.updateWeaponStat
);

// Preview route - untuk melihat preview tanpa menyimpan
router.post(
  "/preview",
  verifyToken,
  isAdmin,
  weaponStatController.previewWeaponStats
);

module.exports = router;
