const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Complaint = require("../Module/Complaint");
const Conductor = require("../Module/Conductor_sc");
const Bus = require("../Module/BusSchema");
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


router.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ timestamp: -1 }); // Fetch only unresolved complaints
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch complaints." });
  }
});

router.put("/complaints/accept/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status: true },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json({ message: "Complaint accepted", complaint: updatedComplaint });
  } catch (error) {
    res.status(500).json({ error: "Failed to update complaint status." });
  }
});

// DELETE: Decline Complaint (Remove from database)
router.delete("/complaints/decline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComplaint = await Complaint.findByIdAndDelete(id);

    if (!deletedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json({ message: "Complaint declined and deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete complaint." });
  }
});

// GET: Fetch assigned bus for a conductor
router.get("/assigned-bus/:conductorId", async (req, res) => {
  try {
    const { conductorId } = req.params;

    if (!conductorId) {
      return res.status(400).json({
        success: false,
        message: "Conductor ID is required"
      });
    }

    // Find the conductor
    const conductor = await Conductor.findById(conductorId);
    if (!conductor) {
      return res.status(404).json({
        success: false,
        message: "Conductor not found"
      });
    }

    // Check if conductor has an assigned bus
    if (!conductor.assignedBusId) {
      return res.status(200).json({
        success: true,
        message: "Conductor is not assigned to any bus",
        data: null
      });
    }

    // Find the assigned bus
    const bus = await Bus.findById(conductor.assignedBusId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Assigned bus not found"
      });
    }

    // Return the bus details
    res.status(200).json({
      success: true,
      data: {
        bus: {
          _id: bus._id,
          busNo: bus.busNo,
          busRouteNo: bus.busRouteNo,
          route: `${bus.fromStage} to ${bus.toStage}`
        }
      }
    });
  } catch (error) {
    console.error("Error fetching assigned bus:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
});

module.exports = router;