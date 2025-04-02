const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Complaint = require("../Module/Complaint");
const Conductor = require("../Module/Conductor_sc");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "complaints",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, height: 600, crop: "limit" }], 
  },
});
const upload = multer({ storage });

// POST: Submit Complaint
router.post("/complaints", upload.single("image"), async (req, res) => {
  try {
    const { conductorId, issueType, complaint, complaintTime } = req.body;

    if (!conductorId || !issueType || !complaint || !complaintTime) {
      return res.status(400).json({ error: "All fields, including conductorId, are required" });
    }

    const imageUrl = req.file ? req.file.path : null;

    const newComplaint = new Complaint({
      conductorId,
      issueType,
      complaint,
      complaintTime: new Date(complaintTime),
      timestamp: new Date(),
      image: imageUrl,
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully", complaint: newComplaint });
  } catch (err) {
    console.error("Error saving complaint:", err);
    res.status(500).json({ error: "Server Error" });
  }
});


router.get("/complaints/:conductorId", async (req, res) => {
  const { conductorId } = req.params;

  if (!conductorId) {
    console.log("Conductor ID is missing in the request");
    return res.status(400).json({ error: "Conductor ID is required." });
  }

  try {
    console.log("Fetching complaints for conductorId:", conductorId);

    const complaints = await Complaint.find({ conductorId });

    if (!complaints || complaints.length === 0) {
      console.log("No complaints found for conductorId:", conductorId);
      return res.status(404).json({ error: "No complaints found for this conductor" });
    }

    console.log("Complaints found:", complaints); 
    res.status(200).json(complaints);

  } catch (err) {
    console.error("Error retrieving complaints:", err);
    res.status(500).json({ error: "Server Error" });
  }
});


router.put("/logout/:conId", async (req, res) => {
  const { conId } = req.params; // Get conId from URL parameters

  if (!conId) {
    return res.status(400).json({ success: false, message: "Conductor ID is required." });
  }

  try {
    const conductor = await Conductor.findById(conId);

    if (!conductor) {
      return res.status(404).json({ success: false, message: "Conductor not found." });
    }

    conductor.LoggedIn = false; 
    await conductor.save();

    res.json({ success: true, message: "Logout successful." });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});



module.exports = router;