import * as Location from "expo-location";
import io from "socket.io-client";
import { Alert } from "react-native";

const SERVER_URL = "http://192.168.232.182:5000";

export const startLocationSharing = async (busRouteNo, onLocationUpdate) => {
  const socket = io(SERVER_URL, {
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ["polling"], // Force polling
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

  let watchId;
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("❌ Location permission denied for bus", busRouteNo);
      Alert.alert("Permission Denied", "Location access is required to share your position.");
      return () => socket.disconnect();
    }

    watchId = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (loc) => {
        if (loc.coords) {
          const location = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          console.log(`📍 Location shared internally:`, location);
          onLocationUpdate(location);
          socket.emit("sendLocation", { busRouteNo, location });
          console.log(`📤 Emitted location for bus ${busRouteNo}:`, location);
        }
      }
    );
  } catch (error) {
    console.error(`❌ Error starting location sharing for bus ${busRouteNo}:`, error);
    Alert.alert("Error", "Failed to start location sharing.");
    return () => socket.disconnect();
  }

  return () => {
    console.log(`🛑 Stopping location sharing for bus ${busRouteNo}`);
    if (watchId) {
      Location.stopLocationUpdatesAsync(watchId).catch((err) =>
        console.error("❌ Error stopping location updates:", err)
      );
    }
    socket.off("connect");
    socket.off("connect_error");
    socket.off("error");
    socket.offAny();
    socket.disconnect();
  };
};