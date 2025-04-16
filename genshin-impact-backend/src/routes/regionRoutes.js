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

router.delete(
  "/areas/:areaId",
  verifyToken,
  isAdmin,
  regionController.deleteRegionArea
);

router.get(
  "/areas/trash",
  verifyToken,
  isAdmin,
  regionController.getDeletedRegionAreas
);

router.put(
  "/areas/:areaId/restore",
  verifyToken,
  isAdmin,
  regionController.restoreRegionArea
);
// Update routes for areas and features
router.put(
  "/areas/:areaId",
  verifyToken,
  isAdmin,
  regionController.updateRegionArea
);

router.put(
  "/features/:featureId",
  verifyToken,
  isAdmin,
  regionController.updateRegionFeature
);

module.exports = router;
