import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios"; // Axios for API calls
import styles from "./LoginStyles"; // Import styles
import { API_BASE_URL } from "../../apiurl";

const Login = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Conductor");
  const handleLogin = async () => {
    if (!userName || !password) {
      Alert.alert("Error", "Please enter both username and password!");
      return;
    }

    try {
      const loginData = {
        Username: userName, // Always send as Username
        password: password,
        role: role,
      };

      console.log("Login attempt with:", loginData);

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        loginData
      );
      const data = response.data;
      if (response.data && response.data.user) {
        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () => {
              switch (role) {
                case "Conductor":
                  navigation.navigate("conhomepage", {
                    username: response.data.user.username || "Unknown Name",
                    city: response.data.user.city || "Unknown City",
                    state: response.data.user.state || "Unknown State",
                  });
                  break;
                case "Admin":
                  navigation.navigate("AdminHome", {
                    username: response.data.user.username || "Unknown Name",
                    adminId: response.data.user.adminId || "Unknown Id",
                    city: response.data.user.city || "Unknown City",
                    state: response.data.user.state || "Unknown State",
                  });
                  break;
              }
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

      <Text style={styles.roleText}>Select Role:</Text>
      <View style={styles.radioContainer}>
        {["Admin", "Conductor"].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.radioButton}
            onPress={() => setRole(item)}
          >
            <View style={[styles.circle, role === item && styles.selected]} />
            <Text style={styles.radioText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
