const express = require("express");
const router = express.Router();
const Ticket = require("../Module/EtmSchema");

router.post("/add_ticket", async (req, res) => {
    try {
      const { routeName, BusNo, boarding, destination, ticketCount, ticketPrice, paymentMethod } = req.body;
  
      if (!routeName || !boarding || !destination || !ticketCount || !ticketPrice || !paymentMethod) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newTicket = new Ticket({ routeName, BusNo,  boarding, destination, ticketCount, ticketPrice, paymentMethod });
      await newTicket.save();
      if(newTicket){
        console.log("Ticket issued successfully!");
      }
  
      res.status(201).json({ success: true, message: "Ticket issued successfully!", ticket: newTicket });
    } catch (error) {
      console.error("Error issuing ticket:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });


  router.get("/seatcount", async (req, res) => {
    try {
      const { busNo } = req.query;  // Corrected from req.params.query to req.query
  
      console.log(busNo);
  
      if (!busNo) {
        return res.status(400).json({ success: false, message: "Bus number is required" });
      }
  
      // Find all tickets with matching BusNo
      const tickets = await Ticket.find({ BusNo: busNo });
  
      if (tickets.length === 0) {
        return res.json({ success: true, message: "No tickets found for this bus", totalBookedSeats: 0 });
      }
  
      // Calculate total booked seats
      const totalBookedSeats = tickets.reduce((sum, ticket) => sum + ticket.ticketCount, 0);
  
      res.json({
        success: true,
        totalBookedSeats,
      });
    } catch (error) {
      console.error("Error fetching seat count:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  
  module.exports = router;