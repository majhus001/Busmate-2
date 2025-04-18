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
router.put(
  "/admin/profileupdate/:adminId",
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, email, password, age, city, state } = req.body;
      const { adminId } = req.params;

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
        success: true,
        message: "Profile updated successfully.",
        admin,
      });
    } catch (error) {
      console.error("Profile Update Error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

router.put(
  "/user/profileupdate/:userId",
  upload.single("image"),
  async (req, res) => {
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
  }
);

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

router.get("/admin/fetch/users/:city", async (req, res) => {
  try {
    const { city } = req.params;
    console.log(city)
    const users = await User.find({ city: city });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found." });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Debug route to check if the router is working
router.get("/test", (req, res) => {
  console.log("Test route accessed");
  res.status(200).json({ message: "UserData router is working" });
});

// Username route with improved debugging
router.get("/users/:id/username", async (req, res) => {
  console.log(`Fetching username for user ID: ${req.params.id}`);

  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid ID format: ${req.params.id}`);
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    console.log(`Looking up user with ID: ${req.params.id}`);
    const user = await User.findById(req.params.id);

    if (!user) {
      console.log(`User not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "User not found." });
    }

    console.log(`User found: ${JSON.stringify(user)}`);
    console.log(`Username found: ${user.Username}`);

    // Return both lowercase and uppercase versions to ensure compatibility
    res.status(200).json({
      username: user.Username,
      Username: user.Username,
      success: true
    });
  } catch (error) {
    console.error(`Error fetching username: ${error.message}`);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});
// GET: Fetch username by user ID
router.get("/username/:id", async (req, res) => {
  console.log(`Fetching username for user ID: ${req.params.id}`);

  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    // Find user by ID and select only the Username field
    const user = await User.findById(id).select("Username");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send the username in response
    res.status(200).json({
      username: user.Username,
      success: true
    });
  } catch (error) {
    console.error(`Error fetching username: ${error.message}`);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});


module.exports = router;
