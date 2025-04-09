const express = require("express");
const router = express.Router();
const characterStatController = require("../controllers/characterStatController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Public routes - dapat diakses siapa saja
router.get("/types", characterStatController.getStatTypes);
router.get("/levels", characterStatController.getLevelAscensionMap);
router.get(
  "/character/:characterId",
  characterStatController.getCharacterStats
);

// Admin routes - hanya admin yang dapat mengubah data
router.post(
  "/character/:characterId",
  verifyToken,
  isAdmin,
  characterStatController.addCharacterStats
);

router.put(
  "/:statId",
  verifyToken,
  isAdmin,
  characterStatController.updateCharacterStat
);

// Preview route - untuk melihat preview tanpa menyimpan
router.post(
  "/preview",
  verifyToken,
  isAdmin,
  characterStatController.previewCharacterStats
);

module.exports = router;
