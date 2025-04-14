import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import io from "socket.io-client";
import haversine from "haversine-distance";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useLanguage } from "../../../LanguageContext";
import { API_BASE_URL } from "../../../apiurl";

const SERVER_URL = API_BASE_URL;
const socket = io(SERVER_URL, { transports: ["websocket"] });
const { width } = Dimensions.get("window");

export default function UserMap({ route }) {
  const { darkMode } = useLanguage();
  const { busRouteNo } = route.params || {};

  const [deviceLocation, setDeviceLocation] = useState(null);
  const [receivedLocation, setReceivedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [deviceAddress, setDeviceAddress] = useState(null);
  const [receivedAddress, setReceivedAddress] = useState(null);
  const [storedDistance, setStoredDistance] = useState("No distance recorded");
  const [noConductorLocation, setNoConductorLocation] = useState(false);
  const locationRef = useRef(null);
  const socketRef = useRef(null);
  const lastLocationTimeRef = useRef(0);
  const mapRef = useRef(null); // Reference to MapView

  // Animation values
  const distanceAnimation = useRef(new Animated.Value(0)).current;
  const timeAnimation = useRef(new Animated.Value(0)).current;

  // Interpolated scales for animations
  const distanceScale = distanceAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  const timeScale = timeAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  const getDeviceLocation = async () => {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("❌ Location permission denied for UserMap");
          Alert.alert(
            "Permission Denied",
            "Location permission is required to track the bus."
          );
          return false;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        console.log("📍 Initial Device Location:", location.coords);
        setDeviceLocation(location.coords);
        locationRef.current = location.coords;
        getAddressFromCoordinates(
          location.coords.latitude,
          location.coords.longitude,
          setDeviceAddress
        );
        return true;
      } catch (error) {
        console.error(
          `❌ Error getting initial location (attempt ${attempts + 1}):`,
          error
        );
        attempts++;
        if (attempts === maxAttempts) {
          console.log("❌ Max location attempts reached");
          Alert.alert("Error", "Failed to get device location after retries.");
          return false;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    if (!busRouteNo) {
      Alert.alert("Error", "No bus route number provided.");
      console.log("❌ No bus route number provided for UserMap");
      return;
    }

    console.log(`🚀 Initializing UserMap for bus ${busRouteNo}`);

    // Initialize socket
    socketRef.current = io(SERVER_URL, {
      transports: ["polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      query: { busRouteNo },
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log(`✅ Socket connected for UserMap ${busRouteNo}`);
      socket.emit("joinBusRoom", busRouteNo);
      console.log(`👀 User joined room for Bus: ${busRouteNo}`);
    });

    socket.on("connect_error", (error) => {
      console.error(`❌ Socket connection error for UserMap ${busRouteNo}:`, {
        message: error.message,
        description: error.description,
        type: error.type,
        stack: error.stack,
      });
      Alert.alert(
        "Connection Error",
        "Failed to connect to the server. Retrying..."
      );
      setNoConductorLocation(true);
    });

    socket.on("reconnect", (attempt) => {
      console.log(
        `🔄 Socket reconnected for UserMap ${busRouteNo} after ${attempt} attempts`
      );
      socket.emit("joinBusRoom", busRouteNo);
      setNoConductorLocation(false);
    });

    socket.on("error", (error) => {
      console.error(
        `❌ Socket error for UserMap ${busRouteNo}:`,
        error.message
      );
      Alert.alert("Error", error.message || "Failed to receive bus location.");
    });

    socket.onAny((event, ...args) => {
      console.log(
        `📡 Received socket event for UserMap ${busRouteNo}: ${event}`,
        args
      );
    });

    // Initialize device location
    getDeviceLocation().then((success) => {
      if (success) {
        Location.watchPositionAsync(
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
              getAddressFromCoordinates(
                loc.coords.latitude,
                loc.coords.longitude,
                setDeviceAddress
              );
            }
          }
        ).catch((error) => {
          console.error("❌ Error watching device location:", error);
        });
      }
    });

    getStoredDistance();

    // Check for conductor location (for UI only)
    const locationTimeout = setTimeout(() => {
      if (Date.now() - lastLocationTimeRef.current >= 10000) {
        console.log(`❌ No conductor location available for bus ${busRouteNo}`);
        setNoConductorLocation(true);
        setReceivedLocation(null);
      }
    }, 10000);

    // Listen for location updates
    socket.on("sendLocation", async (data) => {
      console.log(`📥 Raw sendLocation data for Bus ${busRouteNo}:`, data);
      if (data.busRouteNo !== busRouteNo) {
        console.log(
          `⚠️ Received location for wrong bus ${data.busRouteNo}, expected ${busRouteNo}`
        );
        return;
      }

      if (data.location?.latitude && data.location?.longitude) {
        console.log(
          `📥 Received Live Location for Bus ${busRouteNo}:`,
          data.location
        );
        console.log(
          `📍 Received Latitude: ${data.location.latitude}, Longitude: ${data.location.longitude}`
        );
        setReceivedLocation(data.location);
        lastLocationTimeRef.current = Date.now();
        setNoConductorLocation(false);
        getAddressFromCoordinates(
          data.location.latitude,
          data.location.longitude,
          setReceivedAddress
        );

        // Trigger animations
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
          }),
        ]).start(() => {
          distanceAnimation.setValue(0);
          timeAnimation.setValue(0);
        });

        // Ensure device location
        let currentDeviceLocation = deviceLocation || locationRef.current;
        if (!currentDeviceLocation) {
          console.log(`⚠️ Device location not available, retrying...`);
          const success = await getDeviceLocation();
          currentDeviceLocation = success ? locationRef.current : null;
        }

        if (currentDeviceLocation) {
          const distance = calculateDistance(
            data.location,
            currentDeviceLocation
          );
          console.log(
            `🔍 Immediate distance for ${busRouteNo}: ${distance} km`,
            {
              device: currentDeviceLocation,
              conductor: data.location,
            }
          );
          saveDistance(distance);
        } else {
          console.log(`⚠️ No device location for distance calculation`);
        }
      } else {
        console.warn(
          `⚠️ Invalid location data received for Bus ${busRouteNo}:`,
          data
        );
      }
    });

    // Store distance every 1 second
    const interval = setInterval(async () => {
      const timeSinceLastLocation = Date.now() - lastLocationTimeRef.current;
      let currentDeviceLocation = deviceLocation || locationRef.current;
      if (!currentDeviceLocation) {
        console.log(
          `⚠️ Device location not available in interval, retrying...`
        );
        const success = await getDeviceLocation();
        currentDeviceLocation = success ? locationRef.current : null;
      }

      if (currentDeviceLocation && receivedLocation) {
        const distance = calculateDistance(
          receivedLocation,
          currentDeviceLocation
        );
        console.log(
          `🔍 Interval calculated distance for ${busRouteNo}: ${distance} km`,
          {
            device: currentDeviceLocation,
            conductor: receivedLocation,
            timeSinceLastLocation,
          }
        );
        saveDistance(distance);
      } else {
        console.log(`⚠️ Skipping distance update for ${busRouteNo}:`, {
          deviceLocation: !!currentDeviceLocation,
          receivedLocation: !!receivedLocation,
          timeSinceLastLocation,
        });
      }
    }, 1000);

    return () => {
      console.log(`🛑 Cleaning up UserMap for bus ${busRouteNo}`);
      clearTimeout(locationTimeout);
      clearInterval(interval);
      socket.off("sendLocation");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("reconnect");
      socket.off("error");
      socket.offAny();
      socket.emit("leaveBusRoom", busRouteNo);
      socket.disconnect();
      // Reset mapRef to avoid marker conflicts
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [busRouteNo]);

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
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (response.length > 0) {
        const { street, city, region, country } = response[0];
        const fullAddress = `${
          street ? street + ", " : ""
        }${city}, ${region}, ${country}`;
        setAddress(fullAddress);
        console.log(
          `📍 Resolved address for ${latitude}, ${longitude}: ${fullAddress}`
        );
      }
    } catch (error) {
      console.error("❌ Error fetching address:", error);
    }
  };

  const saveDistance = async (distanceKm) => {
    try {
      const distanceText =
        distanceKm !== "..." ? `${distanceKm} km` : storedDistance;
      await SecureStore.setItemAsync("storedDistance", distanceText);
      console.log("✅ Distance stored successfully:", distanceText);
      setStoredDistance(distanceText);
    } catch (error) {
      console.error("❌ Error storing distance:", error);
      setStoredDistance("Error storing distance");
    }
  };

  const getStoredDistance = async () => {
    try {
      const storedDistance = await SecureStore.getItemAsync("storedDistance");
      if (storedDistance) {
        console.log("📦 Retrieved Distance from Storage:", storedDistance);
        setStoredDistance(storedDistance);
      } else {
        console.log("⚠️ No distance stored yet.");
        setStoredDistance("No distance recorded");
      }
    } catch (error) {
      console.error("❌ Error retrieving distance:", error);
      setStoredDistance("Error retrieving distance");
    }
  };

  const calculateDistance = (receivedLocation, deviceLocation) => {
    if (!receivedLocation || !deviceLocation) {
      console.log("⚠️ Invalid coordinates for distance calculation:", {
        receivedLocation,
        deviceLocation,
      });
      return "...";
    }

    const distanceMeters = haversine(receivedLocation, deviceLocation);
    const distanceKm = (distanceMeters / 1000).toFixed(2);
    console.log(`📏 Calculated distance: ${distanceKm} km`, {
      receivedLocation,
      deviceLocation,
      distanceMeters,
    });

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

  // Memoize MapView to prevent re-creation
  const mapView = useMemo(
    () => (
      <MapView
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {receivedLocation && (
          <Marker
            coordinate={receivedLocation}
            title={`Bus ${busRouteNo}`}
            key={`bus-${busRouteNo}-${Date.now()}`}
          >
            <MaterialCommunityIcons
              name="bus"
              size={40}
              color={darkMode ? "#FF565E" : "red"}
            />
          </Marker>
        )}
        {deviceLocation && (
          <Marker
            coordinate={deviceLocation}
            title="My Location"
            pinColor={darkMode ? "#4DA8FF" : "blue"}
            key={`user-${busRouteNo}-${Date.now()}`}
          />
        )}
        {deviceLocation && receivedLocation && (
          <Polyline
            coordinates={[deviceLocation, receivedLocation]}
            strokeColor={darkMode ? "#4DA8FF" : "#4CAF50"}
            strokeWidth={4}
            lineDashPattern={[0]}
          />
        )}
      </MapView>
    ),
    [mapRegion, receivedLocation, deviceLocation, busRouteNo, darkMode]
  );

  if (!busRouteNo) {
    return (
      <View style={styles.container}>
        <Text>No bus selected. Please go back and select a bus.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      {mapView}
      <View
        style={[styles.destinationCard, darkMode && styles.darkDestinationCard]}
      >
        <View
          style={[styles.locationIcon, darkMode && styles.darkLocationIcon]}
        >
          <MaterialCommunityIcons
            name="map-marker"
            size={24}
            color={darkMode ? "#FFFFFF" : "black"}
          />
        </View>
        <View style={styles.destinationInfo}>
          <Text
            style={[
              styles.destinationTitle,
              darkMode && styles.darkDestinationTitle,
            ]}
          >
            Bus Location
          </Text>
          <Text
            style={[
              styles.destinationText,
              darkMode && styles.darkDestinationText,
            ]}
            numberOfLines={1}
          >
            {noConductorLocation
              ? "No Bus location available"
              : receivedAddress ?? "Waiting for bus location..."}
          </Text>
        </View>
      </View>

      <View style={[styles.infoPanel, darkMode && styles.darkInfoPanel]}>
        <View style={styles.timingContainer}>
          <Animated.Text
            style={[
              styles.timeNumber,
              darkMode && styles.darkTimeNumber,
              { transform: [{ scale: timeScale }] },
            ]}
          >
            {calculateTime(receivedLocation, deviceLocation)}
          </Animated.Text>
          <Text style={[styles.timeLabel, darkMode && styles.darkTimeLabel]}>
            min
          </Text>
          <Animated.Text
            style={[
              styles.distanceLabel,
              darkMode && styles.darkDistanceLabel,
              { transform: [{ scale: distanceScale }] },
            ]}
          >
            ({calculateDistance(receivedLocation, deviceLocation)} km)
          </Animated.Text>
        </View>
        <View style={styles.greenArrow}>
          <MaterialCommunityIcons
            name="arrow-right"
            size={28}
            color={darkMode ? "#4DA8FF" : "#4CAF50"}
          />
        </View>
        <View style={styles.routePoints}>
          <View style={styles.routePoint}>
            <View style={[styles.greenDot, darkMode && styles.darkGreenDot]} />
            <Text
              style={[
                styles.routePointText,
                darkMode && styles.darkRoutePointText,
              ]}
              numberOfLines={1}
            >
              {deviceAddress ?? "Your current location"}
            </Text>
          </View>
          <View style={[styles.routeLine, darkMode && styles.darkRouteLine]} />
          <View style={styles.routePoint}>
            <View style={[styles.blackDot, darkMode && styles.darkBlackDot]} />
            <Text
              style={[
                styles.routePointText,
                darkMode && styles.darkRoutePointText,
              ]}
              numberOfLines={1}
            >
              {noConductorLocation
                ? "No conductor location available"
                : receivedAddress ?? "Bus location"}
            </Text>
          </View>
        </View>
        <Text
          style={[styles.storedDistance, darkMode && styles.darkStoredDistance]}
        >
          Last recorded distance: {storedDistance}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  darkContainer: {
    backgroundColor: "#111",
  },
  map: {
    flex: 1,
  },
  destinationCard: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  darkDestinationCard: {
    backgroundColor: "#222",
    shadowColor: "#000",
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  darkLocationIcon: {
    backgroundColor: "#333",
  },
  destinationInfo: {
    flex: 1,
  },
  destinationTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  darkDestinationTitle: {
    color: "#AAAAAA",
  },
  destinationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  darkDestinationText: {
    color: "#FFFFFF",
  },
  infoPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
  },
  darkInfoPanel: {
    backgroundColor: "#111",
    shadowColor: "#000",
  },
  timingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    flexDirection: "row",
  },
  timeNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  darkTimeNumber: {
    color: "#FFFFFF",
  },
  timeLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
    marginTop: 6,
  },
  darkTimeLabel: {
    color: "#AAAAAA",
  },
  distanceLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    marginTop: 6,
  },
  darkDistanceLabel: {
    color: "#AAAAAA",
  },
  greenArrow: {
    alignItems: "center",
    marginBottom: 16,
  },
  routePoints: {
    marginBottom: 20,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    marginRight: 16,
  },
  darkGreenDot: {
    backgroundColor: "#4DA8FF",
  },
  blackDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000",
    marginRight: 16,
  },
  darkBlackDot: {
    backgroundColor: "#FFFFFF",
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: "#ddd",
    marginLeft: 5,
  },
  darkRouteLine: {
    backgroundColor: "#444",
  },
  routePointText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  darkRoutePointText: {
    color: "#FFFFFF",
  },
  storedDistance: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  darkStoredDistance: {
    color: "#666",
  },
});
