import * as Location from "expo-location";
import io from "socket.io-client";
import { Alert } from "react-native";
import { API_BASE_URL } from "../../../apiurl";

const SERVER_URL = API_BASE_URL;

export const startLocationSharing = (busRouteNo, onLocationUpdate) => {
  const socket = io(SERVER_URL, {
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ["polling"],
    query: { busRouteNo },
  });

  let stopped = false;

  socket.on("connect", () => {
    console.log(`✅ Socket connected for bus ${busRouteNo}`);
    socket.emit("joinBusRoom", busRouteNo);
  });

  (async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      while (!stopped) {
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
          });
          if (!stopped && loc.coords) {
            const location = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            onLocationUpdate(location);
            if (socket.connected)
              socket.emit("sendLocation", { busRouteNo, location });
          }
        } catch (error) {
          if (!stopped) onLocationUpdate(null);
        }

        // Wait 3 seconds before next iteration
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(
        `❌ Error starting location sharing for bus ${busRouteNo}:`,
        error
      );
      Alert.alert("Error", "Failed to start location sharing.");
    }
  })();

  return () => {
    console.log(`🛑 Stopping location sharing for bus ${busRouteNo}`);
    stopped = true;
    socket.off("connect");
    socket.off("connect_error");
    socket.off("error");
    socket.offAny();
    socket.disconnect();
  };
};
