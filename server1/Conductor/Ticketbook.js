const express = require("express");
const router = express.Router();
const Ticket = require("../Module/EtmSchema");
const Bus = require("../Module/BusSchema");

router.post("/add_ticket", async (req, res) => {
  try {
    let {
      routeName,
      busRouteNo,
      busplateNo,
      boarding,
      destination,
      ticketCount,
      ticketPrice,
      paymentMethod,
      selectedCity,
      selectedState,
    } = req.body;

    if (
      !routeName ||
      !busRouteNo ||
      !busplateNo ||
      !boarding ||
      !destination ||
      !ticketCount ||
      !ticketPrice ||
      !paymentMethod ||
      !selectedCity ||
      !selectedState
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const numTickets = parseInt(ticketCount, 10); // FIXED: Using a new variable
    if (isNaN(numTickets) || numTickets <= 0) {
      return res.status(400).json({ message: "Invalid ticket count" });
    }

    // Create and save the ticket
    const newTicket = new Ticket({
      routeName,
      busRouteNo,
      busplateNo,
      boarding,
      destination,
      ticketCount: numTickets,
      ticketPrice,
      paymentMethod,
      selectedCity,
      selectedState,
    });

    await newTicket.save();
    console.log("✅ Ticket issued successfully!");

    // Find the bus and update available seats
    console.log("🔍 Searching for bus with:", {
      busRouteNo,
      busplateNo,
      boarding,
      destination,
      selectedCity,
      selectedState,
    });

    const bus = await Bus.findOne({
      busRouteNo: busRouteNo,
      busNo: busplateNo,
      city: selectedCity,
      state: selectedState,
    });

    if (!bus) {
      console.log("❌ No bus found for the given details.");
      return res
        .status(404)
        .json({ success: false, message: "Bus not found!" });
    }

    console.log("🚍 Available Seats Before Booking:", bus.availableSeats);

    // Check if enough seats are available
    if (bus.availableSeats >= numTickets) {
      bus.availableSeats -= numTickets;
      await bus.save();
      console.log("✅ Seats updated successfully.");
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Not enough seats available" });
    }

    res.status(201).json({
      success: true,
      message: "Ticket issued successfully!",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("❌ Error issuing ticket:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/seatcount", async (req, res) => {
  try {
    const { busNo } = req.query; // Corrected from req.params.query to req.query

    console.log(busNo);

    if (!busNo) {
      return res
        .status(400)
        .json({ success: false, message: "Bus number is required" });
    }

    // Find all tickets with matching BusNo
    const tickets = await Ticket.find({ busRouteNo: busNo });

    if (tickets.length === 0) {
      return res.json({
        success: true,
        message: "No tickets found for this bus",
        totalBookedSeats: 0,
      });
    }

    // Calculate total booked seats
    const totalBookedSeats = tickets.reduce(
      (sum, ticket) => sum + ticket.ticketCount,
      0
    );

    res.json({
      success: true,
      totalBookedSeats,
    });
  } catch (error) {
    console.error("Error fetching seat count:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/update/seats", async (req, res) => {
  try {
    const {
      selectedBusNo,
      busplateNo,
      RouteName,
      dest,
      selectedCity,
      selectedState,
    } = req.body;

    console.log("Received body params:", {
      selectedBusNo,
      busplateNo,
      RouteName,
      dest,
      selectedCity,
      selectedState,
    });

    // Validate required fields
    if (!selectedBusNo || !RouteName  || !dest) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: Bus number, Route, From, or To",
      });
    }

    // Find all tickets with matching criteria
    const tickets = await Ticket.find({
      busRouteNo: selectedBusNo,
      routeName: RouteName,
      destination: dest,
    });

    if (!tickets || tickets.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No tickets found for this bus route",
        totalBookedSeats: 0,
      });
    }

    // Calculate total booked seats
    const totalBookedSeats = tickets.reduce(
      (sum, ticket) => sum + (ticket.ticketCount || 0),
      0
    );

    // Find and update the bus
    const bus = await Bus.findOne({
      busRouteNo: selectedBusNo,
      state: selectedState,
      city: selectedCity,
      busNo: busplateNo,
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Update available seats
    bus.availableSeats = (bus.availableSeats || 0) + totalBookedSeats;
    await bus.save();

    return res.status(200).json({
      success: true,
      message: "Seats updated successfully",
      updatedAvailableSeats: bus.availableSeats,
    });
  } catch (error) {
    console.error("Error in /update/seats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
