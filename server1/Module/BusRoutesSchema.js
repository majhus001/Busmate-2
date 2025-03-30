const mongoose = require("mongoose");

const BusRouteSchema = new mongoose.Schema({
  state: { type: String, required: true, lowercase: true, trim: true },
  city: { type: String, required: true, lowercase: true, trim: true },
  numStages: { type: Number, required: true },
  stages: { type: [String], required: true },
});

const BusRoute = mongoose.model("BusRoute", BusRouteSchema);
module.exports = BusRoute;
