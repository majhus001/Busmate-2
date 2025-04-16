const mongoose = require("mongoose");

const ConductorSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate phone numbers
      match: /^[0-9]{10}$/ // Ensures only valid 10-digit phone numbers
    },
    dob: { type: Date },
    age: {
      type: Number,
      min: 18,
      max: 80
    },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    password: { type: String, required: true, minlength: 6 },
    address: { type: String, required: true, trim: true },
    image: { type: String, default: null }, // Default null instead of "required: false"
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    assignedBusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      default: null
    },
    LoggedIn: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Conductor = mongoose.model("Conductor", ConductorSchema);

module.exports = Conductor;
