const mongoose = require("mongoose");

const OnlineTicketSchema = new mongoose.Schema(
  {
    amount: Number,
    currency: String,
    receipt: String,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("OnlineTicket", OnlineTicketSchema);
