const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Konfigurasi penyimpanan lokal untuk upload sementara
// (jika diperlukan sebagai fallback sebelum upload ke Cloudinary)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/temp";

    // Buat direktori jika belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Format: timestamp-originalname
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

// Filter file untuk gambar
const imageFilter = (req, file, cb) => {
  // Hanya terima file gambar
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Middleware untuk upload gambar lokal (fallback)
const uploadLocal = multer({
  storage: localStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maksimum
  },
});

// Middleware untuk validasi file JSON
const validateJsonFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "JSON file is required" });
  }

  // Cek ekstensi file
  const extname = path.extname(req.file.originalname).toLowerCase();
  if (extname !== ".json") {
    return res.status(400).json({ message: "Only JSON files are allowed" });
  }

  // Parse JSON untuk memvalidasi format
  try {
    const fileContent = fs.readFileSync(req.file.path, "utf8");
    const jsonData = JSON.parse(fileContent);

    // Tambahkan data JSON ke request body
    req.body.jsonData = jsonData;
    next();
  } catch (error) {
    console.error("JSON validation error:", error);
    return res.status(400).json({ message: "Invalid JSON file" });
  }
};

// Middleware untuk menangani error upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB" });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = {
  uploadLocal,
  validateJsonFile,
  handleUploadError,
};
