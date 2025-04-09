const express = require("express");
const router = express.Router();
const characterController = require("../controllers/characterController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const { uploadCharacter } = require("../config/cloudinary");

// Public routes
router.get("/", characterController.getAllCharacters);
router.get("/:id", characterController.getCharacterById);

// Admin routes
router.post(
  "/",
  verifyToken,
  isAdmin,
  uploadCharacter.fields([
    { name: "icon", maxCount: 1 },
    { name: "gachaImg", maxCount: 1 },
  ]),
  characterController.createCharacter
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  uploadCharacter.fields([
    { name: "icon", maxCount: 1 },
    { name: "gachaImg", maxCount: 1 },
  ]),
  characterController.updateCharacter
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  characterController.deleteCharacter
);

router.post(
  "/bulk",
  verifyToken,
  isAdmin,
  uploadCharacter.array("images"),
  characterController.bulkImportCharacters
);

module.exports = router;
