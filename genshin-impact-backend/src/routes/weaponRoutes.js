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

// Weapon Passive routes
router.get("/:weaponId/passives", weaponController.getWeaponPassives);
router.post(
  "/:weaponId/passives",
  verifyToken,
  isAdmin,
  weaponController.createWeaponPassive
);
router.put(
  "/passives/:passiveId",
  verifyToken,
  isAdmin,
  weaponController.updateWeaponPassive
);
router.delete(
  "/passives/:passiveId",
  verifyToken,
  isAdmin,
  weaponController.deleteWeaponPassive
);

// Weapon Refinement routes
router.get("/:weaponId/refinements", weaponController.getWeaponRefinements);
router.post(
  "/:weaponId/refinements",
  verifyToken,
  isAdmin,
  weaponController.createWeaponRefinement
);
router.put(
  "/refinements/:refinementId",
  verifyToken,
  isAdmin,
  weaponController.updateWeaponRefinement
);
router.delete(
  "/refinements/:refinementId",
  verifyToken,
  isAdmin,
  weaponController.deleteWeaponRefinement
);

module.exports = router;
