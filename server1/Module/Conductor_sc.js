const mongoose = require("mongoose");

const ConductorSchema = new mongoose.Schema({
  Username: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dob: { type: Date },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  password: { type: String, required: true },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  LoggedIn: { type: Boolean, default: false },
});

const Conductor = mongoose.model("Conductor", ConductorSchema);

module.exports = Conductor; // Ensure this is exporting the model
