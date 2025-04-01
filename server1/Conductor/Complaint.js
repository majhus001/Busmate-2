const express = require("express");
const router = express.Router();
const multer = require("multer");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Complaint = require("../Module/Complaint");
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
    folder: "complaints",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// **Submit Complaint**
router.post("/add", upload.single("image"), async (req, res) => {
  try {
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
      status: "Pending", // Default status
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully!", complaint: newComplaint });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// **Fetch Complaints for a Specific Conductor**
router.get("/conductor/:conductorId", async (req, res) => {
  try {
    const complaints = await Complaint.find({ conductorId: req.params.conductorId }).sort({ timestamp: -1 });

    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found for this conductor." });
    }

    res.json({ data: complaints });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Fetch Complaints for a Specific Admin**
router.get("/admin/:adminId", async (req, res) => {
  try {
    const complaints = await Complaint.find({ adminId: req.params.adminId }).sort({ timestamp: -1 });

    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found for this admin." });
    }

    res.json({ data: complaints });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Update Complaint (Conductor Only)**
router.put("/update/:id", async (req, res) => {
  try {
    const { conductorId, complaint, issueType } = req.body;

    const existingComplaint = await Complaint.findById(req.params.id);
    if (!existingComplaint) {
      return res.status(404).json({ error: "Complaint not found." });
    }

    if (existingComplaint.conductorId.toString() !== conductorId) {
      return res.status(403).json({ error: "Unauthorized: You can only edit your own complaints." });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: { complaint, issueType } },
      { new: true, runValidators: true }
    );

    res.json({ message: "Complaint updated successfully!", complaint: updatedComplaint });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Update Complaint Status (Admin Only)**
router.put("/status/:id", async (req, res) => {
  try {
    const { status, adminId } = req.body;
    const validStatuses = ["Pending", "In Progress", "Resolved"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value!" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found." });
    }

    if (complaint.adminId.toString() !== adminId) {
      return res.status(403).json({ error: "Unauthorized: Only the assigned admin can update the status." });
    }

    complaint.status = status;
    await complaint.save();

    res.json({ message: "Complaint status updated successfully!", complaint });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Delete Complaint (Conductor Only)**
router.delete("/delete/:id", async (req, res) => {
  try {
    const { conductorId } = req.body;

    const existingComplaint = await Complaint.findById(req.params.id);
    if (!existingComplaint) {
      return res.status(404).json({ error: "Complaint not found." });
    }

    if (existingComplaint.conductorId.toString() !== conductorId) {
      return res.status(403).json({ error: "Unauthorized: You can only delete your own complaints." });
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Complaint deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
