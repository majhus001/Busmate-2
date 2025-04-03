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
router.put("/user/profileupdate/:userId", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password, age, city, state } = req.body;
    const { userId } = req.params;

    console.log("Received Image:", req.file); // Debugging Image Upload

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields if provided
    if (name) user.Username = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (age) user.age = age;
    if (city) user.city = city;
    if (state) user.state = state;

    // Handle uploaded image
    if (req.file) {
      user.image = req.file.path; // Save image path
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


router.post("/admin/profile", async (req, res) => {
  try {
    const { userId } = req.body; // Extract user ID from request body
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
