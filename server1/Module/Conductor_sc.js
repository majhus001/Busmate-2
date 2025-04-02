const mongoose = require("mongoose");

const ConductorSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dob: { type: Date },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    password: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: false },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    LoggedIn: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

const Conductor = mongoose.model("Conductors", ConductorSchema);

module.exports = Conductor; 
