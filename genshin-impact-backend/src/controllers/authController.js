const { PrismaClient } = require("@prisma/client");
const { auth } = require("../config/firebase");

const prisma = new PrismaClient();

// Register user in MySQL after Firebase registration
const registerUser = async (req, res) => {
  try {
    const { firebaseUid, email, username } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        firebaseUid,
        email,
        username: username || email.split("@")[0],
        lastLogin: new Date(),
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Error getting user" });
  }
};

module.exports = {
  registerUser,
  getCurrentUser,
};
