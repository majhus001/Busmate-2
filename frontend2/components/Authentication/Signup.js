import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios"; // Import Axios for API calls
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
    console.log("Signup Data:", {
      Username,
      email,
      password,
      role,
      city,
      state,
    });

    const userData = { Username, email, password, role, city, state };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/authSign/signup`,
        userData
      );
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => {
            if (role === "Admin") {
              navigation.navigate("AdminHome", {
                city: city,
                state: state,
              });
            } else {
              navigation.navigate("ushomescreen", {
                city: city,
                state: state,
              });
            }
          },
        },
      ]);
    } catch (error) {
      console.error(
        "Signup Error:",
        error.response ? error.response.data : error.message
      );
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
        placeholderTextColor="#ccc"
        value={Username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor="#ccc"
        value={city}
        onChangeText={setCity}
      />

      <TextInput
        style={styles.input}
        placeholder="State"
        placeholderTextColor="#ccc"
        value={state}
        onChangeText={setState}
      />

      

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Upppp</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("login")}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
