const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

// Route for advanced search across entities
router.get("/", searchController.advancedSearch);

module.exports = router;
