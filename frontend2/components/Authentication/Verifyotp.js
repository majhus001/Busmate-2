import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import styles from "./SignupStyles";
import { API_BASE_URL } from "../../apiurl";

const Verifyotp = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Destructure user data passed from previous screen
  const { Username, email, password, role, city, state } = route.params;

  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP");
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
        otp: otp.trim(),
      });

      const userData = response.data.user;
      const userId = userData._id;
  
      await SecureStore.setItemAsync("currentUserId", String(userId));
      console.log("User ID saved in SecureStore:", userId);

      Alert.alert("Success", "Account verified successfully!");
  
      // ✅ Navigate to Home or Login (You decide based on flow)
      navigation.reset({
        index: 0,
        routes: [{ name: "UserHome", params: { userData } }], // or "UserHome"
      });
  
    } catch (error) {
      console.error("OTP Verification Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Invalid OTP or expired."
      );
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.label}>OTP sent to: {email}</Text>
          <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
            keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Verifyotp;
