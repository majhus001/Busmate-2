const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const socketIo = require('socket.io');
const cors = require("cors");
require("dotenv").config();

// Import Routes
const buses = require("./Admin/BusRoutes/Buses");
const Etm = require("./Conductor/Ticketbook");
const busroutes = require("./Conductor/BusRoutes");
const loginRoutes = require("./Authentication/LoginRoute");
const SignupRoute = require("./Authentication/SignupRoute");
const Adconductor = require("./Admin/AdConductor/Adconductor");
const ConductorRoute = require("./Conductor/ConductorRoute");
const paymentRoutes = require("./Conductor/paymentRoutes");
const userdata = require("./Authentication/UserData");
const favoriteBusesRoutes = require("./User/favorites");
const buzzer = require("./Conductor/Buzzer");
const conductorAssignment = require("./Admin/ConductorAssignment/ConductorAssignment");
const UserComplaints = require('./User/complaints');
const busRoutes = require("./User/bus-routes");
const app = express();
const server = http.createServer(app);

// Configure CORS to allow all origins
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Socket.io Setup with permissive CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT","DELETE"]
  },
  path: "/socket.io/" // Explicit path
});

// Middleware
app.use(cors(corsOptions)); // Apply the CORS middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes

app.use("/api/Admin/buses", buses);
app.use("/api/Admin/conductor", Adconductor);
app.use("/api/tickets", Etm);
app.use("/api/busroutes", busroutes);
app.use("/api/auth", loginRoutes);
app.use("/api/authSign", SignupRoute);
app.use("/api/Conductor", ConductorRoute);
app.use("/api/payment", paymentRoutes);
app.use("/api/userdata", userdata);
app.use("/api/favorites", favoriteBusesRoutes);
app.use("/api/buzzer", buzzer);
app.use("/api/Admin/conductor-assignment", conductorAssignment);
app.use('/api/Usercomplaints', UserComplaints);
app.use("/api/bus", busRoutes);
// Health check routes
app.get("/", (req, res) => {
  res.status(200).send("Socket.io server is running");
});

// Debug route to test API directly
app.get("/api/debug/test", (req, res) => {
  console.log("Debug test route accessed");
  res.status(200).json({ message: "Debug route is working" });
});

// Direct username route for testing
app.get("/api/debug/username/:id", async (req, res) => {
  try {
    const User = require("./Module/User");
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      username: user.Username,
      success: true
    });
  } catch (error) {
    console.error("Debug username error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

connectDB();

// Socket.io Setup
io.on("connection", (socket) => {
  console.log(`✅ New Client Connected: ${socket.id}, IP: ${socket.handshake.address}`);

  socket.on("joinBusRoom", (busRouteNo) => {
    if (!busRouteNo || typeof busRouteNo !== "string" || busRouteNo.trim() === "") {
      console.warn(`⚠️ Invalid busRouteNo: ${busRouteNo}, Socket ID: ${socket.id}`);
      socket.emit("error", { message: "Invalid bus route number" });
      return;
    }
    socket.join(busRouteNo);
    console.log(`🚍 Client joined room: ${busRouteNo}, Socket ID: ${socket.id}`);
    const clients = io.sockets.adapter.rooms.get(busRouteNo)?.size || 0;
    console.log(`👥 Clients in room ${busRouteNo}: ${clients}`);
  });

  socket.on("leaveBusRoom", (busRouteNo) => {
    if (!busRouteNo || typeof busRouteNo !== "string" || busRouteNo.trim() === "") {
      console.warn(`⚠️ Invalid busRouteNo for leave: ${busRouteNo}, Socket ID: ${socket.id}`);
      socket.emit("error", { message: "Invalid bus route number" });
      return;
    }
    socket.leave(busRouteNo);
    console.log(`🚍 Client left room: ${busRouteNo}, Socket ID: ${socket.id}`);
  });

  socket.on("sendLocation", ({ busRouteNo, location }) => {
    if (
      !busRouteNo ||
      typeof busRouteNo !== "string" ||
      busRouteNo.trim() === "" ||
      !location ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number" ||
      location.latitude < -90 ||
      location.latitude > 90 ||
      location.longitude < -180 ||
      location.longitude > 180
    ) {
      console.warn(`⚠️ Invalid location data for Bus ${busRouteNo}:`, { busRouteNo, location });
      socket.emit("error", { message: "Invalid location data" });
      return;
    }
    console.log(`📍 Location Received for Bus ${busRouteNo}:`, location);
    io.to(busRouteNo).emit("sendLocation", { busRouteNo, location });
    console.log(`📤 Broadcasted location to room: ${busRouteNo}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client Disconnected: ${socket.id}`);
  });

  socket.on("error", (err) => {
    console.error(`❌ Socket error for ${socket.id}:`, err);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});






