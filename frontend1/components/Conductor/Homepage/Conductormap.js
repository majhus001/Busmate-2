import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import io from "socket.io-client";

const SERVER_URL = "http://192.168.232.182:5000"; // Change this to your actual server IP
const socket = io(SERVER_URL, { transports: ["websocket"] });

export default function Conductormap() {
  const [location, setLocation] = useState(null);
  const locationRef = useRef(null); // Store the latest location
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("❌ Location permission denied");
        return;
      }

      // Fetch the latest location immediately
      let initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      console.log("📍 Initial Device Location:", initialLocation.coords);
      setLocation(initialLocation.coords);
      locationRef.current = initialLocation.coords;

      // Start watching for real-time location updates
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Every 1 second
          distanceInterval: 1, // Every 1 meter moved
        },
        (loc) => {
          const newLocation = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          // Send only if location has changed
          if (
            !locationRef.current ||
            locationRef.current.latitude !== newLocation.latitude ||
            locationRef.current.longitude !== newLocation.longitude
          ) {
            console.log("📤 Sending Location:", newLocation);
            setLocation(newLocation);
            locationRef.current = newLocation;
            socket.emit("sendLocation", newLocation);
          }
        }
      );
    };

    getLocation();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Ensure the map centers on the latest location
  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        region={mapRegion} 
        showsUserLocation={true} 
        followsUserLocation={true}
      >
        {location && <Marker coordinate={location} title="My Device 📍" pinColor="blue" />}
      </MapView>
      
      <View style={styles.infoContainer}>
        <Text style={styles.text}>📍 Latitude: {location?.latitude ?? "Loading..."}</Text>
        <Text style={styles.text}>📍 Longitude: {location?.longitude ?? "Loading..."}</Text>
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
