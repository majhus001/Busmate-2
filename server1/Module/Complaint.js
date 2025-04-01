const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  conductorId: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor", required: true },
  issueType: { type: String, required: true },
  complaint: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  complaintTime: { type: String, required: true },
  image: { type: String, default: null }, // Cloudinary image URL
});

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;