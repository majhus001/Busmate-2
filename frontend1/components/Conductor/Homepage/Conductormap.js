import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { startLocationSharing } from "./locationService";

export default function Conductormap({ route }) {
  const { busRouteNo } = route.params || {};
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    if (!busRouteNo) {
      Alert.alert("Error", "No bus route number provided.");
      return;
    }
  
    console.log(`🚀 Starting conductor map for bus ${busRouteNo}`);
  
    const cleanup = startLocationSharing(busRouteNo, (newLocation) => {
      if (newLocation === null) {
        console.warn(`⚠️ Location sharing failed for bus ${busRouteNo}`);
        setConnectionError("Failed to connect to server. Please check your network.");
        return;
      }
      if (newLocation?.latitude && newLocation?.longitude) {
        setLocation(newLocation);
        setConnectionError(null);
        console.log(
          `📍 Conductor Location Updated for bus ${busRouteNo}: Latitude: ${newLocation.latitude}, Longitude: ${newLocation.longitude}`
        );
      } else {
        console.warn(`⚠️ Invalid location data for bus ${busRouteNo}:`, newLocation);
      }
    });
  
    return () => {
      console.log(`🛑 Cleaning up conductor map for bus ${busRouteNo}`);
      cleanup();
    };
  }, [busRouteNo]);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      setMapRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [location]);

  if (!busRouteNo) {
    return (
      <View style={styles.container}>
        <Text>No bus route number provided.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {location && location.latitude && location.longitude && (
          <Marker coordinate={location} title={`Bus ${busRouteNo}`} pinColor="blue" />
        )}
      </MapView>
      <View style={styles.infoContainer}>
        {connectionError ? (
          <Text style={[styles.text, styles.errorText]}>{connectionError}</Text>
        ) : (
          <>
            <Text style={styles.text}>📍 Latitude: {location?.latitude ?? "Loading..."}</Text>
            <Text style={styles.text}>📍 Longitude: {location?.longitude ?? "Loading..."}</Text>
            <Text style={styles.text}>🚍 Bus: {busRouteNo}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 2,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
  },
});