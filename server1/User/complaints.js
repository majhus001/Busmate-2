const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserComplaint = require("../Module/UserComplaint");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "complaints",
    allowed_formats: ["jpg", "png"],
  },
});
const upload = multer({ storage });

// Create a new complaint
router.post("/complaints", upload.single("image"), async (req, res) => {
  console.log("POST /complaints received");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("File:", req.file);

  try {
    const { userId, conductorId, busRouteNo, issueType, complaint, complaintTime, adminId, customIssueType } = req.body;
    console.log("Parsed complaint data:", {
      userId,
      conductorId,
      busRouteNo,
      issueType,
      customIssueType,
      complaint,
      complaintTime,
      adminId,
      image: req.file ? req.file.path : null,
    });

    // Validate required fields
    if (!userId || !conductorId || !busRouteNo || !issueType || !complaint || !complaintTime || !adminId) {
      console.error("Missing required fields:", {
        userId,
        conductorId,
        busRouteNo,
        issueType,
        complaint,
        complaintTime,
        adminId,
      });
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate ObjectId formats
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(conductorId) ||
      !mongoose.Types.ObjectId.isValid(adminId)
    ) {
      console.error("Invalid ObjectId format:", { userId, conductorId, adminId });
      return res.status(400).json({ message: "Invalid userId, conductorId, or adminId format" });
    }

    // Validate issueType
// Validate issueType
const validIssueTypes = [
 
  "Traffic", 
  "Accidents", 
  "Blockage", 
  "NoShow", 
  "Late", 
  "Overcrowded", 
  "DriverIssue", 
  "Other"
];
if (!validIssueTypes.includes(issueType)) {
  console.error("Invalid issueType:", issueType);
  return res.status(400).json({ message: "Invalid issueType provided" });
}
  
    // Create new complaint
    const userComplaint = new UserComplaint({
      userId,
      conductorId,
      busRouteNo,
      issueType,
      customIssueType: issueType === "Other" ? customIssueType : null,
      complaint,
      complaintTime,
      adminId,
      image: req.file ? req.file.path : null,
    });

    await userComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully", complaint: userComplaint });
  } catch (error) {
    console.error("Error creating complaint:", error.message, error.stack);
    res.status(500).json({ message: "Failed to submit complaint", error: error.message });
  }
});
// Fetch complaints by adminId
router.get("/complaints/admin/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      console.error("Invalid adminId format:", adminId);
      return res.status(400).json({ message: "Invalid adminId format" });
    }

    const complaints = await UserComplaint.find({ adminId }).sort({ createdAt: -1 });
    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this admin" });
    }

    res.status(200).json({ message: "Complaints retrieved successfully", complaints });
  } catch (error) {
    console.error("Error fetching complaints by adminId:", error.message, error.stack);
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
});

// Fetch complaints by conductorId
router.get("/complaints/conductor/:conductorId", async (req, res) => {
  try {
    const { conductorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conductorId)) {
      console.error("Invalid conductorId format:", conductorId);
      return res.status(400).json({ message: "Invalid conductorId format" });
    }

    const complaints = await UserComplaint.find({ conductorId })
      .populate("userId", "username") // Populate userId with only the username field
      .sort({ createdAt: -1 });

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this conductor" });
    }

    res.status(200).json({ message: "Complaints retrieved successfully", complaints });
  } catch (error) {
    console.error("Error fetching complaints by conductorId:", error.message, error.stack);
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
});
// Fetch complaints by userId
router.get("/complaints/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const complaints = await UserComplaint.find({ userId }).sort({ createdAt: -1 });
    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this user" });
    }

    res.status(200).json({ message: "Complaints retrieved successfully", complaints });
  } catch (error) {
    console.error("Error fetching complaints by userId:", error.message, error.stack);
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
});
module.exports = router;