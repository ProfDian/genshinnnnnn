const express = require("express");
const router = express.Router();
const regionController = require("../controllers/regionController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const { uploadRegion } = require("../config/cloudinary");

// Public routes
router.get("/", regionController.getAllRegions);
router.get("/:id", regionController.getRegionById);
router.get("/:id/characters", regionController.getCharactersByRegion);

// Admin routes
router.post(
  "/",
  verifyToken,
  isAdmin,
  uploadRegion.single("regionIcon"),
  regionController.createRegion
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  uploadRegion.single("regionIcon"),
  regionController.updateRegion
);

router.post(
  "/:regionId/areas",
  verifyToken,
  isAdmin,
  uploadRegion.single("areaImage"),
  regionController.addRegionArea
);

router.post(
  "/:regionId/features",
  verifyToken,
  isAdmin,
  regionController.addRegionFeature
);

module.exports = router;
