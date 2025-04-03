// Login.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store"; // Import SecureStore
import styles from "./LoginStyles";
import { API_BASE_URL } from "../../apiurl";

const Login = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  const handleLogin = async () => {
    if (!userName || !password) {
      Alert.alert("Error", "Please enter both username and password!");
      return;
    }

    try {
      const loginData = {
        Username: userName,
        password: password,
        role: role,
      };

      console.log("Login attempt with:", loginData);

      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData);

      console.log("Full response data:", response.data);

      if (response.data && response.data.user) {
        const userData = response.data.user;
        const userId = userData._id; // Extract userId

        // Save userId in SecureStore
        await SecureStore.setItemAsync("currentUserId", userId);
        console.log("User ID saved in SecureStore:", userId);

        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("UserHome", { userData }); // Still pass userData if needed
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      Alert.alert(
        "Login Failed",
        error.response?.data?.error || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("signup")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;