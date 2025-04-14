const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const socketIo = require('socket.io');
const cors = require("cors");
const fs = require("fs");
require("dotenv").config(); // Load environment variables

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
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));

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
// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

connectDB();

// Socket.io Setup
io.on("connection", (socket) => {
  console.log("✅ New Client Connected:", socket.id);

  socket.on("sendLocation", (data) => {
    console.log("📍 Location Received:", data);
    io.emit("sendLocation", data); 
  });

  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected:", socket.id);
  });
});

// Start Server (Express + Socket.io)
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
