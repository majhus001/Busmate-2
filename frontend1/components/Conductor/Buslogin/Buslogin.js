import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import styles from "./BusloginStyles";
import { API_BASE_URL } from "../../../apiurl";

const Buslogin = ({ route, navigation }) => {
  const {
    busplateNo,
    selectedFrom,
    selectedTo,
    selectedBusNo,
    selectedCity,
    selectedState,
  } = route.params;

  const [password, setPassword] = useState("");

  console.log("Selected Bus Info on loign:", {
    busplateNo,
  });
  const handleLogin = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter the password");
      return;
    }

    try {
      console.log(busplateNo, password);
      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/buses/login`,
        {
          busplateNo,
          password,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Login Successful");
        const BusData = response.data.busDetails; 
        
        navigation.navigate("taketicket", {
          selectedFrom,
          selectedTo,
          selectedBusNo,
          busplateNo,
          selectedCity,
          selectedState,
          BusData
        });
      } else {
        Alert.alert("Error", response.data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Server error. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚌 Bus Login</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Bus Plate No: {busplateNo}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Bus Route No: {selectedBusNo}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Bus Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>🔐 Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Buslogin;
