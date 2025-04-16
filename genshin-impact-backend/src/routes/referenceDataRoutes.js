// routes/referenceDataRoutes.js
const express = require("express");
const router = express.Router();
const referenceDataController = require("../controllers/referenceDataController");

// GET endpoints untuk data referensi
router.get("/elements", referenceDataController.getAllElements);
router.get("/weapon-types", referenceDataController.getAllWeaponTypes);
router.get("/rarities", referenceDataController.getAllRarities);

// GET endpoints untuk filtering
router.get("/characters/filter", referenceDataController.getFilteredCharacters);
router.get("/weapons/filter", referenceDataController.getFilteredWeapons);

module.exports = router;
