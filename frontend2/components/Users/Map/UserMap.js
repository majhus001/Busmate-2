import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import io from "socket.io-client";
import haversine from "haversine-distance";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const SERVER_URL = "http://192.168.232.182:5000";
const socket = io(SERVER_URL, { transports: ["websocket"] });
const { width } = Dimensions.get("window");

export default function UserMap() {
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [receivedLocation, setReceivedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const locationRef = useRef(null);
  const [storedDistance, setStoredDistance] = useState(null);
  const [deviceAddress, setDeviceAddress] = useState(null);
  const [receivedAddress, setReceivedAddress] = useState(null);
  
  // Animation values
  const distanceAnimation = useRef(new Animated.Value(0)).current;
  const timeAnimation = useRef(new Animated.Value(0)).current;

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
      getAddressFromCoordinates(initialLocation.coords.latitude, initialLocation.coords.longitude, setDeviceAddress);

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
            getAddressFromCoordinates(loc.coords.latitude, loc.coords.longitude, setDeviceAddress);
          }
        }
      );
    };

    getDeviceLocation();

    socket.on("sendLocation", (newLocation) => {
      console.log("📥 Received Live Location:", newLocation);
      setReceivedLocation(newLocation);
      getAddressFromCoordinates(newLocation.latitude, newLocation.longitude, setReceivedAddress);
      
      // Trigger animations when location updates
      Animated.parallel([
        Animated.timing(distanceAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(timeAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start(() => {
        distanceAnimation.setValue(0);
        timeAnimation.setValue(0);
      });
    });

    getStoredDistance();

    const interval = setInterval(() => {
      if (deviceLocation && receivedLocation) {
        const distance = calculateDistance(receivedLocation, deviceLocation);
        saveDistance(distance);
      }
    }, 3000);

    return () => {
      socket.off("sendLocation");
      clearInterval(interval);
    };
  }, [deviceLocation, receivedLocation]);

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

  const getAddressFromCoordinates = async (latitude, longitude, setAddress) => {
    try {
      const response = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (response.length > 0) {
        const { street, city, region, country } = response[0];
        const fullAddress = `${street ? street + ", " : ""}${city}, ${region}, ${country}`;
        setAddress(fullAddress);
      }
    } catch (error) {
      console.error("❌ Error fetching address:", error);
    }
  };

  const saveDistance = async (distanceKm) => {
    try {
      const distanceText = `${distanceKm} km`;
      await SecureStore.setItemAsync("storedDistance", distanceText);
      console.log("✅ Distance stored successfully:", distanceText);
    } catch (error) {
      console.error("❌ Error storing distance:", error);
    }
  };

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

  const calculateDistance = (receivedLocation, deviceLocation) => {
    if (!receivedLocation || !deviceLocation) return "...";

    const distanceMeters = haversine(receivedLocation, deviceLocation);
    const distanceKm = (distanceMeters / 1000).toFixed(2);

    return distanceKm;
  };

  const calculateTime = (receivedLocation, deviceLocation) => {
    if (!receivedLocation || !deviceLocation) return "...";

    const distanceMeters = haversine(receivedLocation, deviceLocation);
    const busSpeedKmh = distanceMeters < 5000 ? 45 : 60;
    const speedMs = busSpeedKmh * (1000 / 3600);

    const timeSeconds = distanceMeters / speedMs;
    const timeMinutes = timeSeconds / 60;

    return timeMinutes.toFixed(0);
  };

  // Animation styles
  const distanceScale = distanceAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1]
  });
  
  const timeScale = timeAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1]
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {receivedLocation && (
          <Marker coordinate={receivedLocation} title="Bus Location">
            <MaterialCommunityIcons name="bus" size={40} color="red" />
          </Marker>
        )}
        
        {deviceLocation && (
          <Marker coordinate={deviceLocation} title="My Location" pinColor="blue" />
        )}

        {deviceLocation && receivedLocation && (
          <Polyline
            coordinates={[deviceLocation, receivedLocation]}
            strokeColor="#4CAF50"
            strokeWidth={4}
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      {/* Destination card */}
      <View style={styles.destinationCard}>
        <View style={styles.locationIcon}>
          <MaterialCommunityIcons name="map-marker" size={24} color="black" />
        </View>
        <View style={styles.destinationInfo}>
          <Text style={styles.destinationTitle}>Bus Location</Text>
          <Text style={styles.destinationText} numberOfLines={1}>
            {receivedAddress ?? "Loading Bus Location..."}
          </Text>
        </View>
      </View>

      {/* Info panel */}
      <View style={styles.infoPanel}>
        <View style={styles.timingContainer}>
          <Animated.Text 
            style={[styles.timeNumber, {transform: [{scale: timeScale}]}]}
          >
            {calculateTime(receivedLocation, deviceLocation)}
          </Animated.Text>
          <Text style={styles.timeLabel}>min</Text>
          <Text style={styles.distanceLabel}>
            ({calculateDistance(receivedLocation, deviceLocation)} km)
          </Text>
        </View>
        
        <View style={styles.greenArrow}>
          <MaterialCommunityIcons name="arrow-right" size={28} color="#4CAF50" />
        </View>

        {/* Route points */}
        <View style={styles.routePoints}>
          <View style={styles.routePoint}>
            <View style={styles.greenDot} />
            <Text style={styles.routePointText} numberOfLines={1}>
              {deviceAddress ?? "Your current location"}
            </Text>
          </View>
          
          <View style={styles.routeLine} />
          
          <View style={styles.routePoint}>
            <View style={styles.blackDot} />
            <Text style={styles.routePointText} numberOfLines={1}>
              {receivedAddress ?? "Destination location"}
            </Text>
          </View>
        </View>
        
        {/* Stored distance */}
        <Text style={styles.storedDistance}>Last recorded distance: {storedDistance ?? "..."}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  destinationCard: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  destinationText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
  },
  timingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexDirection: 'row',
  },
  timeNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  timeLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
    marginTop: 6,
  },
  distanceLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    marginTop: 6,
  },
  greenArrow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  routePoints: {
    marginBottom: 20,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 16,
  },
  blackDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
    marginRight: 16,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#ddd',
    marginLeft: 5,
  },
  routePointText: {
    fontSize: 16,
    flex: 1,
  },
  storedDistance: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});