const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");
const Conductor = require("../../Module/Conductor_sc");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
// Add Conductor API

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
    folder: "Conductors_pics",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    let {
      Username,
      phoneNumber,
      dob,
      age,
      gender,
      password,
      address,
      adminId,
    } = req.body;

    console.log(req.file.path);

    // Validate required fields
    if (!Username || !phoneNumber || !password) {
      return res
        .status(400)
        .json({ error: "Username, Phone Number, and Password are required!" });
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        error: "Invalid phone number! Please enter a valid 10-digit number.",
      });
    }

    // Validate password (Minimum 6 characters)
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    // Validate and parse DOB
    if (dob) {
      const parsedDate = new Date(dob);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          error: "Invalid Date of Birth (DOB). Use YYYY-MM-DD format.",
        });
      }
      dob = parsedDate;
    }

    // Validate age if provided
    if (age !== undefined) {
      if (isNaN(age) || age < 18 || age > 80) {
        return res
          .status(400)
          .json({ error: "Invalid age! Age should be between 18 and 80." });
      }
    }

    // Extract image URL from Cloudinary response
    const imageUrl = req.file ? req.file.path : null;

    // Create and save the conductor
    const newConductor = new Conductor({
      Username,
      phoneNumber,
      dob,
      age,
      gender,
      password,
      address,
      image: imageUrl, // Store uploaded image URL
      adminId,
      LoggedIn: false,
    });

    await newConductor.save();

    res.status(201).json({
      message: "Conductor added successfully!",
      conductor: newConductor,
    });
  } catch (error) {
    console.error("Error saving conductor:", error);
    res.status(500).json({
      error: error.message || "Internal Server Error",
      details: error,
    });
  }
});

router.get("/fetchconductor/:adminId", async (req, res) => {
  const { adminId } = req.params;
  try {
    const conductors = await Conductor.find({ adminId });
    console.log({ data: conductors });
    res.json({ data: conductors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const conductorId = req.params.id;
    const deletedConductor = await Conductor.findByIdAndDelete(conductorId);

    if (!deletedConductor) {
      return res.status(404).json({ message: "Conductor not found" });
    }

    res.status(200).json({ message: "Conductor deleted successfully" });
  } catch (error) {
    console.error("Error deleting conductor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 * PUT: Update a conductor's details
 */
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    
    const conductorId = req.params.id;
    const updatedData = req.body;

    // If a new image is uploaded, add it to the update object
    if (req.file) {
      updatedData.image = req.file ? req.file.path : null;
    }

    const updatedConductor = await Conductor.findByIdAndUpdate(
      conductorId,
      updatedData,
      { new: true }
    );

    if (!updatedConductor) {
      return res.status(404).json({ message: "Conductor not found" });
    }

    res
      .status(200)
      .json({
        message: "Conductor updated successfully",
        conductor: updatedConductor,
      });
  } catch (error) {
    console.error("Error updating conductor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
