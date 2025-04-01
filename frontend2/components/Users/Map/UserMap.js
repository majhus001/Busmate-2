import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import io from "socket.io-client";
import haversine from "haversine-distance"; // Install using npm install haversine-distance

const SERVER_URL = "http://192.168.232.182:5000"; // Change to your actual server IP
const socket = io(SERVER_URL, { transports: ["websocket"] });

export default function UserMap() {
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [receivedLocation, setReceivedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const locationRef = useRef(null); // Store latest location
  const [storedDistance, setStoredDistance] = useState(null); // Store retrieved distance

  useEffect(() => {
    console.log("🚀 Connecting to socket for live tracking...");

    const getDeviceLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("❌ Location permission denied");
        return;
      }

      let initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      console.log("📍 Initial Device Location:", initialLocation.coords);
      setDeviceLocation(initialLocation.coords);
      locationRef.current = initialLocation.coords;

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          if (loc.coords) {
            console.log("📍 Updated Device Location:", loc.coords);
            setDeviceLocation(loc.coords);
            locationRef.current = loc.coords;
          }
        }
      );
    };

    getDeviceLocation();

    socket.on("sendLocation", (newLocation) => {
      console.log("📥 Received Live Location:", newLocation);
      setReceivedLocation(newLocation);
    });

    getStoredDistance(); // Fetch stored distance on app load

    return () => {
      socket.off("sendLocation");
    };
  }, []);

  useEffect(() => {
    if (deviceLocation) {
      setMapRegion({
        latitude: deviceLocation.latitude,
        longitude: deviceLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [deviceLocation]);

  // 🔹 Function to Store Distance
  const saveDistance = async (distanceKm) => {
    try {
      const distanceText = `📏 Distance: ${distanceKm} km`;
      await SecureStore.setItemAsync("storedDistance", distanceText);
      console.log("✅ Distance stored successfully:", distanceText);
    } catch (error) {
      console.error("❌ Error storing distance:", error);
    }
  };

  // 🔹 Function to Retrieve Stored Distance
  const getStoredDistance = async () => {
    try {
      const storedDistance = await SecureStore.getItemAsync("storedDistance");
      if (storedDistance) {
        setStoredDistance(storedDistance);
        console.log("📦 Retrieved Distance from Storage:", storedDistance);
      } else {
        console.log("⚠️ No distance stored yet.");
      }
    } catch (error) {
      console.error("❌ Error retrieving distance:", error);
    }
  };

  // 🔹 Distance Calculation using Haversine Formula
  const calculateDistance = (receivedLocation, deviceLocation) => {
    if (!receivedLocation || !deviceLocation) return "Calculating...";

    const distanceMeters = haversine(receivedLocation, deviceLocation);
    const distanceKm = (distanceMeters / 1000).toFixed(2);

    saveDistance(distanceKm); // ✅ Store distance in SecureStore

    return `📏 Distance: ${distanceKm} km`;
  };

  // 🔹 Time Estimation (Assuming 40 km/h speed)
  const calculateTime = (receivedLocation, deviceLocation) => {
    if (!receivedLocation || !deviceLocation) return "Calculating...";

    const distanceMeters = haversine(receivedLocation, deviceLocation);

    // Assume bus speed (adjust based on city or highway conditions)
    const busSpeedKmh = distanceMeters < 5000 ? 45 : 60;
    const speedMs = busSpeedKmh * (1000 / 3600); // Convert km/h to m/s

    const timeSeconds = distanceMeters / speedMs;
    const timeMinutes = timeSeconds / 60;

    return `🚌 Estimated Bus Time: ${timeMinutes.toFixed(2)} minutes`;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* 🔴 Red Pin - Received Location */}
        {receivedLocation && (
          <Marker coordinate={receivedLocation} title="Live Location 📍" pinColor="red" />
        )}

        {/* 🔵 Blue Pin - Device Location */}
        {deviceLocation && (
          <Marker coordinate={deviceLocation} title="My Device 📍" pinColor="blue" />
        )}
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.text}>📍 Received Latitude: {receivedLocation?.latitude ?? "Loading..."}</Text>
        <Text style={styles.text}>📍 Received Longitude: {receivedLocation?.longitude ?? "Loading..."}</Text>
        <Text style={styles.text}>📍 My Latitude: {deviceLocation?.latitude ?? "Loading..."}</Text>
        <Text style={styles.text}>📍 My Longitude: {deviceLocation?.longitude ?? "Loading..."}</Text>
        <Text style={styles.text}>{calculateDistance(receivedLocation, deviceLocation)}</Text>
        <Text style={styles.text}>{calculateTime(receivedLocation, deviceLocation)}</Text>
        <Text style={styles.text}>💾 Stored Distance: {storedDistance ?? "Fetching..."}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  infoContainer: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
});
