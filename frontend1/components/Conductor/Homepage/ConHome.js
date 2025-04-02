import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "./ConHomeStyles";
import ConductorMap from "./Conductormap";

const ConHome = ({ navigation, route }) => {
  const { conData } = route.params || {}; // Assuming conData is passed from previous screen

  useEffect(() => {
    if (conData) {
      console.log("conData received in ConHome:", conData);
    }
  }, [conData]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleNavigate = (screen) => {
    if (!conData || !conData._id) {
      Alert.alert("Error", "Conductor ID is missing. Please log in again.");
      return;
    }
    console.log("Navigating with conductorId:", conData._id);
    navigation.navigate(screen, { conductorId: conData._id });
  };

  const handleprofile = () =>{
    navigation.navigate("conprofile", conData);
  }

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
            <Text style={styles.bold}>Name:</Text> {conData.Username}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Gender:</Text> {conData.gender}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Age:</Text> {conData.age}
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

      {/* Add Complaints Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate("complaintform")}
      >
        <Text style={styles.buttonText}>📋 Add Complaints</Text>
      </TouchableOpacity>

      {/* View Complaints Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate("viewcomplaintform")}
      >
        <Text style={styles.buttonText}>👀 View Complaints</Text>
      </TouchableOpacity>

      {/* Enlarged Map */}
      <View style={styles.mapContainer}>
        <ConductorMap />
      </View>
    </View>
  );
};

export default ConHome;
