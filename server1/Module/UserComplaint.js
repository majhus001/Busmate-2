const mongoose = require("mongoose");

const userComplaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conductorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conductor",
      required: true,
    },
    busRouteNo: {
      type: String,
      required: true,
    },
    issueType: {
      type: String,
      required: true,
      enum: [
        "Potholes", 
        "Traffic", 
        "Accidents", 
        "Blockage", 
        "NoShow",       // Bus Not Arrived
        "Late",         // Late Arrival
        "Overcrowded",  // Overcrowded Bus
        "DriverIssue",  // Driver Misbehavior
        "Other"
      ],
    },
    customIssueType: {
      type: String,
      default: null, // Store custom issue type when issueType is "Other"
    },
    complaint: {
      type: String,
      required: true,
    },
    complaintTime: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null, // Already optional
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserComplaint", userComplaintSchema);