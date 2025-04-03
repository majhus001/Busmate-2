const mongoose = require("mongoose");

const OnlineTicketSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    paymentId: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    receipt: { type: String, required: true },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    busno: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OnlineTicket", OnlineTicketSchema);
