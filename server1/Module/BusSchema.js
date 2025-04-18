const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busRouteNo: { type: String, required: true },
    busNo: { type: String, required: true },
    busPassword: { type: String, required: true },
    totalShifts: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    busType: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    fromStage: { type: String, required: true },
    toStage: { type: String, required: true },
    currentLocation: { type: String, required: true },
    prices: { type: Map, of: String, default: {} }, 
    timings: { type: Map, of: String, default: {} }, 
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    conductorId: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor", default: null },
    LoggedIn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Bus = mongoose.model("Bus", busSchema);
module.exports = Bus;