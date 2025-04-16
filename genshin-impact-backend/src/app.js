const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Import routes
const authRoutes = require("./routes/authRoutes");
const characterRoutes = require("./routes/characterRoutes");
const weaponRoutes = require("./routes/weaponRoutes");
const regionRoutes = require("./routes/regionRoutes");
const userRoutes = require("./routes/userRoutes");
const characterStatRoutes = require("./routes/characterStatRoutes");
const characterSkillsRoutes = require("./routes/characterSkillsRoutes"); // Tambahkan ini
const weaponStatRoutes = require("./routes/weaponStatRoutes"); // Tambahkan ini
const searchRoutes = require("./routes/searchRoutes");
const referenceDataRoutes = require("./routes/referenceDataRoutes");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/weapons", weaponRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stats", characterStatRoutes);
app.use("/api/skills", characterSkillsRoutes);
app.use("/api/weapon-stats", weaponStatRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/reference", referenceDataRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Genshin Impact API",
    version: "1.0.0",
    documentation: "API documentation available at /api-docs",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
