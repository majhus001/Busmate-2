import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import styles from "./ConHomeStyles";
import ConductorMap from "./Conductormap";

const ConHome = ({ navigation, route }) => {
  const { conData } = route.params || {}; 



  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleProfile = () => {
    navigation.navigate("conprofile", { conData });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>🚍 BusMate</Text>
        <Text style={styles.panelName}>Conductor Panel</Text>
      </View>

      {/* Conductor Details */}
      <View style={styles.detailsContainer}>
        <TouchableOpacity onPress={handleProfile} style={styles.conDetails}>
          <Text style={styles.detailsTitle}> Conductor Details</Text>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: conData.image || "https://via.placeholder.com/150" }}
              style={styles.profileImage}
            />
            <View style={styles.textDetails}>
              <Text style={styles.detailText}><Text style={styles.bold}>Name:</Text> {conData.Username}</Text>
              <Text style={styles.detailText}><Text style={styles.bold}>Gender:</Text> {conData.gender}</Text>
              <Text style={styles.detailText}><Text style={styles.bold}>Age:</Text> {conData.age}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Start Ride Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("conbusselect")}
      >
        <Text style={styles.buttonText}>🚀 Start Ride</Text>
      </TouchableOpacity>

      {/* Enlarged Map */}
      <View style={styles.mapContainer}>
        <ConductorMap />
      </View>
    </View>
  );
};

export default ConHome;