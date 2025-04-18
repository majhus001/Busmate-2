const mongoose = require("mongoose");

const RouteFrequencySchema = new mongoose.Schema(
  {
    busRouteNo: { type: String, required: true },
    route: { type: String, required: true }, // Format: "from-to"
    count: { type: Number, default: 1 },
    lastUsed: { type: Date, default: Date.now },
    conductorId: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor" },
  },
  { timestamps: true }
);

// Compound index for faster lookups
RouteFrequencySchema.index({ busRouteNo: 1, route: 1, conductorId: 1 }, { unique: true });

const RouteFrequency = mongoose.model("RouteFrequency", RouteFrequencySchema);
module.exports = RouteFrequency;
