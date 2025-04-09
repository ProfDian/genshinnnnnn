const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup storage for character images
const characterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "genshin/characters",
    allowed_formats: ["jpg", "png", "webp"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

// Setup storage for weapon images
const weaponStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "genshin/weapons",
    allowed_formats: ["jpg", "png", "webp"],
    transformation: [{ width: 500, crop: "limit" }],
  },
});

// Setup storage for region images
const regionStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "genshin/regions",
    allowed_formats: ["jpg", "png", "webp"],
    transformation: [{ width: 1200, crop: "limit" }],
  },
});

// Create middleware for each upload type
const uploadCharacter = multer({ storage: characterStorage });
const uploadWeapon = multer({ storage: weaponStorage });
const uploadRegion = multer({ storage: regionStorage });

module.exports = {
  cloudinary,
  uploadCharacter,
  uploadWeapon,
  uploadRegion,
};
