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
      boarding,
      destination,
      ticketCount: numTickets,
      ticketPrice,
      paymentMethod,
      checkout: false,
    });

    await newTicket.save();
    console.log("✅ Ticket issued successfully!");

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

    if (!selectedBusNo || !RouteName || !dest) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: Bus number, Route name, or Destination",
      });
    }

    console.log(
      "🚌 Searching for tickets with:",
      RouteName,
      dest,
      selectedBusNo
    );

    // FIND TICKETS BASED ON FIELDS (field names must match schema)
    const tickets = await Ticket.find({
      busRouteNo: selectedBusNo,
      routeName: RouteName,
      destination: dest,
      checkout: false,
    });

    console.log("🎟️ Found tickets:", tickets.length);

    if (!tickets || tickets.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No tickets found for this bus route",
        totalBookedSeats: 0,
      });
    }

    // Mark tickets as checked out
    for (const ticket of tickets) {
      ticket.checkout = true;
      await ticket.save(); // Save each ticket
    }

    // Calculate total booked seats
    const totalBookedSeats = tickets.reduce(
      (sum, ticket) => sum + (ticket.ticketCount || 0),
      0
    );

    // Find the bus to update seats
    const bus = await Bus.findOne({
      busRouteNo: selectedBusNo,
      busNo: busplateNo,
      city: selectedCity,
      state: selectedState,
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    console.log("🪑 Seats before:", bus.availableSeats);

    // Add back the seats
    bus.availableSeats = (bus.availableSeats || 0) + totalBookedSeats;
    await bus.save();

    return res.status(200).json({
      success: true,
      message: "Seats updated successfully",
      updatedAvailableSeats: bus.availableSeats,
    });
  } catch (error) {
    console.error("❌ Error in /update/seats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
