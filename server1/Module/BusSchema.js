const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busRouteNo: String,
    busNo: String,
    busPassword: String,
    totalShifts: Number,
    totalSeats: Number,
    busType: String,
    state: String,
    city: String,
    fromStage: String,
    toStage: String,
    prices: Object,
    timings: Object,
    adminId: String,
  },
  { timestamps: true }
);
const Bus = mongoose.model("Buses", busSchema);
module.exports = Bus;
