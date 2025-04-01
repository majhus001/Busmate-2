const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    conductorId: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor", required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    issueType: { type: String, required: true },
    complaint: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "In Progress", "Resolved"], 
      default: "Pending" 
    }, 
    timestamp: { type: Date, default: Date.now }, 
    complaintTime: { type: String, required: true }, 
    image: { type: String, default: null }, 
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
