const express = require("express");
const router = express.Router();
const User = require("../Module/User");
const multer = require("multer");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

router.use(cors());
router.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image Storage in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Admin_profile_pics",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// Profile Update Route
router.put("/admin/profileupdate/:adminId", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password, age, city, state } = req.body;
    const { adminId } = req.params;

    console.log("Received Image:", req.file); // Debugging Image Upload

    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Update fields if provided
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) admin.password = password;
    if (age) admin.age = age;
    if (city) admin.city = city;
    if (state) admin.state = state;

    // Handle uploaded image
    if (req.file) {
      admin.image = req.file.path; // Update the image field (based on your schema)
    }

    await admin.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      admin,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
