const mongoose = require("mongoose");

const FavoriteBusSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User ID to identify favorites
  busRouteNo: { type: String, required: true }, // Bus Number
});

const FavoriteBus = mongoose.model("FavoriteBus", FavoriteBusSchema);
module.exports = FavoriteBus;
