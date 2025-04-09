const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware untuk memeriksa apakah user adalah admin
const isAdmin = async (req, res, next) => {
  try {
    // Pastikan user sudah terautentikasi
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Cek apakah user memiliki role admin
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Lanjutkan ke handler berikutnya jika user adalah admin
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { isAdmin };
