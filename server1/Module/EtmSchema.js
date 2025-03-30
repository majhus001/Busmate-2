const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
  },
  BusNo: {
    type: String,
    required: true
  },
  boarding: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  ticketCount: {
    type: Number,
    required: true,
    min: 1,
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = mongoose.model("ticket", TicketSchema);

module.exports = Ticket;