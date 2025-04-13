const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
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

const app = express();
const server = http.createServer(app);

// Configure CORS for Express and Socket.io
const corsOptions = {
  origin: (origin, callback) => {
    // Allow no origin (React Native) or specific origins
    if (!origin || origin.startsWith("http://192.168.") || origin === process.env.FRONTEND_URL || origin === "http://localhost:3000") {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS rejected origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// Socket.io Setup
const io = new Server(server, {
  cors: corsOptions,
  path: "/socket.io/", // Explicit path
});

// Middleware
app.use((req, res, next) => {
  console.log(`📡 Request: ${req.method} ${req.url}`);
  next();
});
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

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

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("Socket.io server is running");
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

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});