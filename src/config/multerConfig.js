const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Replace with your API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your API secret
});

// Multer storage configuration to upload images to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "top_destinations", // Optional folder name on Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"], // Allowed file types
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
