import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { API_BASE_URL } from "../../../apiurl";
import styles from "./AddConductorStyles"; // Importing the styles

const AddConductor = ({ navigation, route }) => {
  const { adminId = "NA" } = route.params || {};

  const [Username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!Username.trim() || !phoneNumber.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert("Error", "Phone number must be 10 digits.");
      return;
    }

    // Validate and format DOB
    let formattedDOB = "";
    if (dob) {
      const parsedDate = new Date(dob);
      if (!isNaN(parsedDate.getTime())) {
        formattedDOB = parsedDate.toISOString().split("T")[0];
      } else {
        Alert.alert("Error", "Invalid Date of Birth. Please use YYYY-MM-DD format.");
        return;
      }
    }

    const conductorData = {
      Username: Username.trim(),
      phoneNumber: phoneNumber.trim(),
      dob: formattedDOB,
      age: parseInt(age, 10) || null,
      gender: gender,
      password: password,
      adminId: adminId,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/Admin/Conductor/add`, conductorData);
      Alert.alert("Success", "Conductor added successfully!");
      navigation.navigate()
      navigation.goBack();
    } catch (error) {
      console.error("Error adding conductor:", error);
      Alert.alert("Error", error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Conductor</Text>

      {/* Username */}
      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Full Name"
        value={Username}
        onChangeText={setUsername}
      />

      {/* Phone Number */}
      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* DOB */}
      <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter DOB"
        value={dob}
        onChangeText={setDob}
      />

      {/* Age */}
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setGender(value)}
          items={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "Other", value: "Other" },
          ]}
          style={styles.picker}
          placeholder={{ label: "Select Gender", value: null }}
        />
      </View>

      {/* Password */}
      <Text style={styles.label}>Conductor Password *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Conductor</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddConductor;
