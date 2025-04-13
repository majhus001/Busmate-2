import * as Location from "expo-location";
import io from "socket.io-client";
import { Alert } from "react-native";

import { API_BASE_URL } from "../../../apiurl";
const SERVER_URL = API_BASE_URL;
export const startLocationSharing = async (busRouteNo, onLocationUpdate) => {
  const socket = io(SERVER_URL, {
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ["polling"],
    query: { busRouteNo },
  });

  socket.on("connect", () => {
    console.log(`✅ Socket connected for bus ${busRouteNo}`);
    socket.emit("joinBusRoom", busRouteNo);
    console.log(`👀 Conductor joined room for bus ${busRouteNo}`);
  });

  socket.on("connect_error", (error) => {
    console.error(`❌ Socket connection error for bus ${busRouteNo}:`, {
      message: error.message,
      description: error.description,
      type: error.type,
      stack: error.stack,
    });
    if (socket.io.opts.reconnectionAttempts >= 10) {
      console.warn(`⚠️ Max reconnection attempts reached for bus ${busRouteNo}`);
      Alert.alert(
        "Connection Error",
        "Failed to connect to the server. Please check your network and try again."
      );
      onLocationUpdate(null);
    }
  });

  socket.on("error", (error) => {
    console.error(`❌ Server error for bus ${busRouteNo}:`, error.message);
    Alert.alert("Server Error", error.message || "An error occurred on the server.");
  });

  socket.onAny((event, ...args) => {
    console.log(`📡 Socket event for bus ${busRouteNo}: ${event}`, args);
  });

  let intervalId;
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("❌ Location permission denied for bus", busRouteNo);
      Alert.alert("Permission Denied", "Location access is required to share your position.");
      return () => socket.disconnect();
    }

    // Start interval to fetch and emit location every 3 seconds
    intervalId = setInterval(async () => {
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        if (loc.coords) {
          const location = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          console.log(`📍 Location shared internally for bus ${busRouteNo}:`, location);
          onLocationUpdate(location);
          socket.emit("sendLocation", { busRouteNo, location });
          console.log(`📤 Emitted location for bus ${busRouteNo}:`, location);
        }
      } catch (error) {
        console.error(`❌ Error fetching location for bus ${busRouteNo}:`, error);
        onLocationUpdate(null);
      }
    }, 3000);

  } catch (error) {
    console.error(`❌ Error starting location sharing for bus ${busRouteNo}:`, error);
    Alert.alert("Error", "Failed to start location sharing.");
    return () => socket.disconnect();
  }

  return () => {
    console.log(`🛑 Stopping location sharing for bus ${busRouteNo}`);
    if (intervalId) {
      clearInterval(intervalId);
    }
    socket.off("connect");
    socket.off("connect_error");
    socket.off("error");
    socket.offAny();
    socket.disconnect();
  };
};