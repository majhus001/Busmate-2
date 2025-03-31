const express = require("express");
const router = express.Router();
const multer = require("multer");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Complaint = require("../Module/Complaint");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "complaints",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// **Submit Complaint**
router.post("/complaints", upload.single("image"), async (req, res) => {
  try {
    console.log("Received Complaint Request:", req.body);
    console.log("File Uploaded:", req.file ? req.file.path : "No Image");

    const { conductorId, adminId, issueType, complaint, complaintTime } = req.body;

    if (!conductorId || !adminId || !issueType || !complaint || !complaintTime) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const imageUrl = req.file ? req.file.path : null;

    const newComplaint = new Complaint({
      conductorId,
      adminId,
      issueType,
      complaint,
      complaintTime,
      timestamp: new Date(),
      image: imageUrl,
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully", complaint: newComplaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// **View Complaints for a Specific Conductor**
router.get("/complaints/conductor/:conductorId", async (req, res) => {
  try {
    const complaints = await Complaint.find({ conductorId: req.params.conductorId });
    res.json(complaints);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// **View Complaints for Admin (Only Their Conductors)**
router.get("/complaints/admin/:adminId", async (req, res) => {
  try {
    const complaints = await Complaint.find({ adminId: req.params.adminId });
    res.json(complaints);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// **Edit Complaint (Only by the Respective Conductor)**
router.put("/complaints/:id", async (req, res) => {
  try {
    const { conductorId } = req.body;
    
    const existingComplaint = await Complaint.findById(req.params.id);
    if (!existingComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    if (existingComplaint.conductorId.toString() !== conductorId) {
      return res.status(403).json({ error: "Unauthorized: You can only edit your own complaints" });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ message: "Complaint updated", complaint: updatedComplaint });
  } catch (err) {
    console.error("Error updating complaint:", err);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// **Delete Complaint (Only by the Respective Conductor)**
router.delete("/complaints/:id", async (req, res) => {
  try {
    const { conductorId } = req.body;

    const existingComplaint = await Complaint.findById(req.params.id);
    if (!existingComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    if (existingComplaint.conductorId.toString() !== conductorId) {
      return res.status(403).json({ error: "Unauthorized: You can only delete your own complaints" });
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error("Error deleting complaint:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
