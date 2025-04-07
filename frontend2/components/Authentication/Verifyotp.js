import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import styles from "./VerifyOtpStyles"; // Import styles
import { API_BASE_URL } from "../../apiurl";

const Verifyotp = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { Username, email, password, role, city, state } = route.params;

  const [otp, setOtp] = useState(["", "", "", ""]); // Array for individual OTP boxes

  const handleVerify = async () => {
    const enteredOtp = otp.join(""); // Convert array to string
    if (!enteredOtp || enteredOtp.length !== 4) {
      Alert.alert("Error", "Please enter the complete OTP.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/authSign/verify-otp`, {
        Username,
        email,
        password,
        role,
        city,
        state,
        otp: enteredOtp.trim(),
      });

      const userData = response.data.user;
      const userId = userData._id;
      await SecureStore.setItemAsync("currentUserId", String(userId));

      Alert.alert("Success", "Account verified successfully!");
      navigation.reset({ index: 0, routes: [{ name: "UserHome", params: { userData } }] });
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Invalid OTP or expired.");
    }
  };

  return (
    <View style={styles.container}>
      {/* OTP Image */}
      <View style={styles.imageContainer}>
        <Text>📱</Text> {/* You can use an actual image here */}
      </View>

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the OTP sent to <Text style={styles.phoneText}>{email}</Text>
      </Text>

      {/* OTP Input Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => {
              const newOtp = [...otp];
              newOtp[index] = text;
              setOtp(newOtp);
            }}
          />
        ))}
      </View>

      {/* Resend OTP */}
      <TouchableOpacity onPress={() => Alert.alert("OTP Resent!")}>
        <Text style={styles.resendOtpText}>Didn’t receive the OTP? <Text style={styles.resendOtp}>Resend OTP</Text></Text>
      </TouchableOpacity>

      {/* Verify Button */}
      <TouchableOpacity 
        style={[styles.button, otp.join("").length !== 4 && styles.disabledButton]}
        onPress={handleVerify}
        disabled={otp.join("").length !== 4}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Verifyotp;
