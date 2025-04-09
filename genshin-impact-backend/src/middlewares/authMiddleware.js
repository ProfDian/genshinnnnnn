const { auth } = require("../config/firebase");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(token);

    // Get the user from database or create if not exists
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      // If user doesn't exist in MySQL, create a new record
      user = await prisma.user.create({
        data: {
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          username: decodedToken.name || decodedToken.email.split("@")[0],
          lastLogin: new Date(),
        },
      });
    } else {
      // Update last login time
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    }

    // Add user to request
    req.user = user;

    // Log user activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        activityType: "LOGIN",
      },
    });

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    // Check if user exists and is admin
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { verifyToken, isAdmin };
