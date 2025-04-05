import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import styles from "./SignupStyles";
import { API_BASE_URL } from "../../apiurl";

const Signup = ({ navigation }) => {
  const [Username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleSignup = async () => {
    if (!Username || !email || !password || !city || !state) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    const userData = { Username, email, password, role, city, state };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/authSign/signup`,
        userData
      );

      Alert.alert("Success", "OTP sent to your email", [
        {
          text: "Verify OTP",
          onPress: () => {
            navigation.navigate("Verifyotp", userData); // Pass all user data
          },
        },
      ]);
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Signup failed. Try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={Username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        value={state}
        onChangeText={setState}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("login")}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
