const express = require("express");
const router = express.Router();
const Ticket = require("../Module/EtmSchema");
const Bus = require("../Module/BusSchema");
const Conductor = require("../Module/Conductor_sc");

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
      busId,
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
      busId,
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

    if (bus.availableSeats + 20 >= numTickets) {
      bus.availableSeats -= numTickets;
      console.log("✅ Seats updated successfully.");
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Not enough seats available" });
    }

    await bus.save();
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

router.post("/getseats/available", async (req, res) => {
  const { boardingPoint, busRouteNo } = req.body;

  try {
    const tickets = await Ticket.find({
      busRouteNo: busRouteNo,
      destination: boardingPoint,
      checkout: false,
    });

    const checkoutseats = tickets.reduce(
      (total, ticket) => total + (ticket.ticketCount || 0),
      0
    );

    console.log("checking seat availability...", checkoutseats);

    res.status(200).json({
      checkoutseats,
    });
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ message: "Server error fetching seats" });
  }
});

router.get("/genrevenue/all/:adminId", async (req, res) => {
  const { adminId } = req.params;

  try {
    const buses = await Bus.find({ adminId: adminId });

    const allTickets = await Promise.all(
      buses.map((bus) => Ticket.find({ busId: bus._id }))
    );

    // Flatten the nested array
    const tickets = allTickets.flat();

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error fetching tickets" });
  }
});

// Get tickets for a specific bus by route number and date
router.get("/bus-tickets/:busRouteNo", async (req, res) => {
  const { busRouteNo } = req.params;
  const { date } = req.query;
  console.log("hhhhh")
  try {
    // Create date range for the given date (start of day to end of day)
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const tickets = await Ticket.find({
      busRouteNo: busRouteNo,
      issuedAt: { $gte: startDate, $lte: endDate }
    }).sort({ issuedAt: -1 }); 

    res.status(200).json({
      success: true,
      tickets: tickets
    });
  } catch (error) {
    console.error(`Error fetching tickets for bus ${busRouteNo}:`, error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
      error: error.message
    });
  }
});

// Get statistics for a conductor based on their assigned bus
router.get("/conductor-stats/:conductorId", async (req, res) => {
  const { conductorId } = req.params;
  try {
    const conductor = await Conductor.findById(conductorId);

    if (!conductor) {
      return res.status(404).json({
        success: false,
        message: "Conductor not found",
      });
    }

    if (!conductor.assignedBusId) {
      return res.status(200).json({
        success: true,
        message: "Conductor is not assigned to any bus",
        data: {
          totalTrips: 0,
          totalTickets: 0,
          totalRevenue: 0,
        },
      });
    }

    // Find tickets for the assigned bus
    const tickets = await Ticket.find({ busId: conductor.assignedBusId });

    // Calculate statistics
    const totalTickets = tickets.reduce(
      (sum, ticket) => sum + (ticket.ticketCount || 0),
      0
    );
    const totalRevenue = tickets.reduce(
      (sum, ticket) => sum + (ticket.ticketPrice || 0),
      0
    );

    const uniqueTrips = new Set();

    tickets.forEach((item) => {
      const tripDate = new Date(item.issuedAt).toISOString().split("T")[0];
      uniqueTrips.add(tripDate);

    });

    const totalTrips = uniqueTrips.size;

    res.status(200).json({
      success: true,
      data: {
        totalTrips,
        totalTickets,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error fetching conductor statistics:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching statistics",
      error: error.message,
    });
  }
});

module.exports = router;
