const express = require("express");
const router = express.Router();
const characterSkillsController = require("../controllers/characterSkillsController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const { uploadConstellation } = require("../config/cloudinary");

// Public routes - Get character skills
router.get(
  "/talents/:characterId",
  characterSkillsController.getCharacterTalents
);
router.get(
  "/passives/:characterId",
  characterSkillsController.getCharacterPassives
);
router.get(
  "/constellations/:characterId",
  characterSkillsController.getCharacterConstellations
);

// Admin routes - Add/Update character skills
router.post(
  "/talents/:characterId",
  verifyToken,
  isAdmin,
  characterSkillsController.addCharacterTalent
);

router.post(
  "/passives/:characterId",
  verifyToken,
  isAdmin,
  characterSkillsController.addCharacterPassive
);

router.post(
  "/constellations/:characterId",
  verifyToken,
  isAdmin,
  uploadConstellation.single("constellationIcon"),
  characterSkillsController.addCharacterConstellation
);

// Bulk add all skill types at once
router.post(
  "/bulk/:characterId",
  verifyToken,
  isAdmin,
  characterSkillsController.bulkAddCharacterSkills
);

module.exports = router;
