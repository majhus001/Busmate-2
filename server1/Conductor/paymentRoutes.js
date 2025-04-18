const express = require("express");
const crypto = require("crypto");
const razorpayInstance = require("../Config/razorpay");
const Order = require("../Module/OnlineTicket");
const Bus = require("../Module/BusSchema");
const User = require("../Module/User"); // Import User model for username lookup

const router = express.Router();

// 🔹 Create Payment Order
router.post("/orders", async (req, res) => {
  try {
    const { amount, ticketcount, busno, userId, fromLocation, toLocation } =
      req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    // Ensure amount is a number and convert to paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({ message: "Invalid amount!" });
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    // Use Promise to handle the async operation properly
    try {
      const order = await new Promise((resolve, reject) => {
        razorpayInstance.orders.create(options, (error, order) => {
          if (error) {
            console.error("❌ Razorpay order creation error:", error);
            reject(error);
          } else {
            resolve(order);
          }
        });
      });

      console.log("✅ Order created successfully:", order.id);
      console.log("🚏 Route stages:", fromLocation, toLocation);

      // Save order in DB with userId
      const newOrder = new Order({
        orderId: order.id,
        amount: order.amount / 100,
        ticketcount,
        currency: order.currency,
        receipt: order.receipt,
        status: "created",
        busno: busno,
        userId: userId,
        fromLocation: fromLocation,
        toLocation: toLocation,
        checkIn: false,
        checkout: false,
      });

      await newOrder.save();
      console.log("✅ Order saved to database");

      res.status(200).json({ order });
    } catch (razorpayError) {
      console.error("❌ Razorpay error:", razorpayError);
      return res.status(500).json({ message: "Payment gateway error!" });
    }
  } catch (error) {
    console.error("❌ Error in creating order:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

router.get("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    const transactions = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

// 🔹 Verify Payment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Validate required parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    // Create the signature verification string
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // Get the secret key from environment variables
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error(
        "❌ Razorpay secret key not found in environment variables"
      );
      return res.status(500).json({
        success: false,
        message: "Payment verification configuration error",
      });
    }

    // Generate the expected signature
    const expectedSign = crypto
      .createHmac("sha256", secret)
      .update(sign)
      .digest("hex");

    // Verify the signature
    if (razorpay_signature === expectedSign) {
      console.log("✅ Payment signature verified successfully");

      // Update the order status in the database
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "paid" },
        { new: true }
      );

      if (!updatedOrder) {
        console.error("❌ Order not found for ID:", razorpay_order_id);
        return res
          .status(400)
          .json({ success: false, message: "Order not found!" });
      }

      console.log("✅ Order updated successfully:", updatedOrder._id);
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order: updatedOrder,
      });
    } else {
      console.error("❌ Invalid payment signature");
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature!" });
    }
  } catch (error) {
    console.error("❌ Error in payment verification:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

// 🔹 Get Online Tickets for a specific bus by route number and date
router.get("/bus-tickets/:busRouteNo", async (req, res) => {
  const { busRouteNo } = req.params;
  const { date } = req.query;

  try {
    // Create date range for the given date (start of day to end of day)
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Find online tickets for the specified bus and date
    const tickets = await Order.find({
      busno: busRouteNo,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 }); // Sort by createdAt in descending order (newest first)

    console.log(
      `Found ${tickets.length} online tickets for bus ${busRouteNo} on ${date}`
    );

    // Get usernames for each ticket
    const usernames = await Promise.all(
      tickets.map(async (ticket) => {
        try {
          // Check if userId is valid
          if (!ticket.userId) {
            console.log(`⚠️ No userId for ticket ${ticket._id}`);
            return "Unknown User";
          }

          // Find user by ID
          const user = await User.findById(ticket.userId);

          if (!user) {
            console.log(`⚠️ User not found for ID: ${ticket.userId}`);
            return "Unknown User";
          }

          console.log(
            `✅ Found username: ${user.Username} for ticket ${ticket._id}`
          );
          return user.Username;
        } catch (err) {
          console.error(`❌ Error finding user for ticket ${ticket._id}:`, err);
          return "Unknown User";
        }
      })
    );

    res.status(200).json({
      success: true,
      tickets,
      usernames,
    });
  } catch (error) {
    console.error(
      `❌ Error fetching online tickets for bus ${busRouteNo}:`,
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to fetch online tickets",
      error: error.message,
    });
  }
});

// 🔹 Check-in a passenger with an online ticket
router.post("/check-in/:ticketId", async (req, res) => {
  const { ticketId } = req.params;

  try {
    // Find and update the ticket
    const ticket = await Order.findByIdAndUpdate(
      ticketId,
      { checkIn: true },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    console.log(`✅ Passenger checked in for ticket ${ticketId}`);
    const busno = ticket.busno;
    const ticketcount = ticket.ticketcount;
    const bus = await Bus.findOne({ busRouteNo: busno });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found!" });
    }

    if (bus.availableSeats < ticketcount) {
      return res.status(400).json({ message: "Not enough seats available!" });
    }
    console.log("available seats before", bus.availableSeats);
    bus.availableSeats -= ticketcount;
    await bus.save();
    console.log("available seats after", bus.availableSeats);
    return res.status(200).json({
      success: true,
      message: "Passenger checked in successfully",
      ticket,
    });
  } catch (error) {
    console.error(
      `❌ Error checking in passenger for ticket ${ticketId}:`,
      error
    );
    return res.status(500).json({
      success: false,
      message: "Failed to check in passenger",
      error: error.message,
    });
  }
});

router.put("/update/seats", async (req, res) => {
  try {
    const {
      selectedBusNo,
      dest,
      selectedCity,
      selectedState,
    } = req.body;
 console.log("dest in online..")
    if (!selectedBusNo || !dest) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: Bus number, Route name, or Destination",
      });
    }

    console.log(
      "🚌 Searching for tickets with:",
      dest,
      selectedBusNo
    );

    // FIND TICKETS BASED ON FIELDS (field names must match schema)
    const tickets = await Order.find({
      busno: selectedBusNo,
      toLocation: dest,
      checkIn: true,
      checkout: false,
    });

    console.log("🎟️ Found tickets:", tickets.length);

    if (!tickets || tickets.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No tickets found for this bus route",
        totalBookedSeats: 0,
      });
    }

    // Mark tickets as checked out
    for (const ticket of tickets) {
      ticket.checkout = true;
      await ticket.save();
    }

    // Calculate total booked seats
    const totalBookedSeats = tickets.reduce(
      (sum, ticket) => sum + (parseInt(ticket.ticketcount, 10) || 0),
      0
    );

    const bus = await Bus.findOne({
      busRouteNo: selectedBusNo,
      city: selectedCity,
      state: selectedState,
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    console.log("🪑 Seats before in online ticks:", bus.availableSeats);

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
