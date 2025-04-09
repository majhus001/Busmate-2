import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../apiurl";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const Verifyotp = ({ route, navigation }) => {
  const [otp, setOtp] = useState(["", "", "", ""]); // Array to store 4 digits
  const inputRefs = useRef([]); // Refs for each TextInput
  const { username, email, password, role, city, state } = route.params;

  // Handle OTP input change
  const handleOtpChange = (text, index) => {
    if (/^[0-9]$/.test(text) || text === "") {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto-focus next input
      if (text && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace to focus previous input
  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join(""); // Combine digits into a single string
    if (otpString.length !== 4) {
      Alert.alert("Error", "Please enter a 4-digit OTP.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/authSign/verify-otp`, {
        username,
        email,
        password,
        role,
        city,
        state,
        otp: otpString.trim(),
      });

      // Extract user data from the response
      const { user } = response.data;
      const userId = user._id;

      // Store user ID in SecureStore
      await SecureStore.setItemAsync("currentUserId", userId);

      // Optionally store additional user data
      await SecureStore.setItemAsync("userData", JSON.stringify({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      }));

      // Navigate to UserHome screen
      navigation.navigate("UserHome");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "OTP verification failed."
      );
    }
  };

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              ref={(ref) => (inputRefs.current[index] = ref)}
              autoFocus={index === 0} // Auto-focus first box
              placeholder="-"
              placeholderTextColor="#999"
            />
          ))}
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Verify OTP</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    color: "#333",
    backgroundColor: "#f5f5f5",
  },
  verifyButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Verifyotp;