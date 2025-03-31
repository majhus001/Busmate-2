const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  conductorId: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor", required: true }, // Associated conductor
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Admin who manages complaints
  issueType: { type: String, required: true },
  complaint: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  complaintTime: { type: String, required: true },
  image: { type: String, default: null },
});

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
