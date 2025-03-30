import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import styles from "./BusloginStyles"; // Import your styles
import { API_BASE_URL } from "../../../apiurl";

const Buslogin = ({ route, navigation }) => {
  const { busplateNo, selectedFrom, selectedTo, selectedBusNo, selectedCity, selectedState } = route.params; 
  const [password, setPassword] = useState("");

  console.log(busplateNo, selectedFrom, selectedTo, selectedBusNo);

  const handleLogin = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter the password");
      return;
    }

    try {
        console.log(busplateNo, password);
      const response = await axios.post(`${API_BASE_URL}/api/Admin/buses/login`, {
        busplateNo,
        password,
      });

      if (response.data.success) {
        Alert.alert("Success", "Login Successful");
        navigation.navigate("taketicket", { selectedFrom, selectedTo, selectedBusNo, selectedCity, selectedState }); 
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

      <Text style={styles.label}>Bus Plate No : {busplateNo}</Text>

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Bus Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>🔑 Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Buslogin;
