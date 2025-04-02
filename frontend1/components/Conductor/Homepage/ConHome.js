import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./ConHomeStyles"; // Importing styles
import ConductorMap from "./Conductormap";

const ConHome = ({ route, navigation }) => {
  // Extracting data from route.params
  const { conData } = route.params || {};

  // Extracting username, city, and state from conData
  const username = conData?.Username || "N/A";
  const gender = conData?.gender || "Unknown";
  const age = conData?.age || "Unknown";

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleprofile = () => {
    navigation.navigate("conprofile", { conData });
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>BusMate</Text>
        <Text style={styles.panelName}>Conductor Panel</Text>
      </View>

      {/* Conductor Details */}
      <View style={styles.detailsContainer}>
        <TouchableOpacity onPress={handleprofile}>
          <Text style={styles.detailsTitle}>👤 Conductor Details</Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Name:</Text> {username}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Gender:</Text> {gender}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Age:</Text> {age}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Start Ride Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("conbusselect")}
      >
        <Text style={styles.buttonText}>🚀 Start Ride</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("complaintform")}
      >
        <Text style={styles.buttonText}>📋 Add Complaints</Text>
      </TouchableOpacity>

      {/* Enlarged Map */}
      <View style={styles.mapContainer}>
        <ConductorMap />
      </View>
    </View>
  );
};

export default ConHome;
