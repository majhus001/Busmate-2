import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import styles from "./BusdetailsStyles";

const Busdetails = ({ route, navigation }) => {
  const { bus, fromLocation, toLocation } = route.params;

  if (!bus) {
    Alert.alert("Error", "Bus details not found.");
    navigation.goBack();
    return null;
  }

  const bookedSeats = bus.bookedSeats || 0;
  const availableSeats = bus.totalSeats - bookedSeats;
  const BoardformattedTime = bus.timings?.[fromLocation] || "N/A";
  const ArrformattedTime = bus.timings?.[toLocation] || "N/A";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>🚌 {bus.busRouteNo} Bus Details</Text>
        <Text style={styles.routeText}>
          {bus.fromStage} → {bus.toStage}
        </Text>
      </View>

      {/* Info Cards Section */}
      <View style={styles.infoContainer}>
        {/* Route Info */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Boarding point: <Text style={styles.value}>{fromLocation}</Text>
          </Text>

          <Text style={styles.label}>
            Boarding Time:{" "}
            <Text style={styles.value}>{BoardformattedTime}</Text>
          </Text>
          <Text style={styles.label}>
            Expected Time:{" "}
            <Text style={styles.value}>{BoardformattedTime}</Text>
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            Arrival point: <Text style={styles.value}>{toLocation}</Text>
          </Text>
          <Text style={styles.label}>
            Arrival Time: <Text style={styles.value}>{ArrformattedTime}</Text>
          </Text>
          <Text style={styles.label}>
            Expected Time: <Text style={styles.value}>{ArrformattedTime}</Text>
          </Text>
        </View>

        {/* Seat Details */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Total Seats: <Text style={styles.value}>{bus.totalSeats}</Text>
          </Text>

          <Text style={styles.label}>
            Booked Seats: <Text style={styles.value}>{bookedSeats}</Text>
          </Text>

          <Text style={styles.label}>
            Available Seats: <Text style={styles.value}>{availableSeats}</Text>
          </Text>
          <Text style={styles.label}>
            Standings:{" "}
            <Text style={styles.value}>
              {Math.max(bookedSeats - bus.totalSeats, 0)}
            </Text>
          </Text>
        </View>

        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            bus.LoggedIn ? styles.active : styles.inactive,
          ]}
        >
          <Text style={styles.statusText}>
            {bus.LoggedIn ? "🟢 Active" : "🔴 Inactive"}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.trackButton}
        onPress={() => navigation.navigate("usmap")}
      >
        <Text style={styles.trackButtonText}>Live Track Bus</Text>
      </TouchableOpacity>

      {/* Pay Now Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={() => navigation.navigate("payment")}
      >
        <Text style={styles.payButtonText}>💳 Pay Now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Busdetails;
