import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./ConHomeStyles"; // Importing styles

const ConHome = ({ navigation, route }) => {
  // Extracting data from route.params
  const { username, city, state } = route.params || {};

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>BusMate</Text>
        <Text style={styles.panelName}>Conductor Panel</Text>
      </View>

      {/* Conductor Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>👤 Conductor Details</Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Name:</Text> {username || "N/A"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>City:</Text> {city || "Unknown"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>State:</Text> {state || "Unknown"}
        </Text>
      </View>

      {/* Start Ride Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("conbusselect")}
      >
        <Text style={styles.buttonText}>🚀 Start Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConHome;
