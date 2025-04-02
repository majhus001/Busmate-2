import React, { useState, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { API_BASE_URL } from "../../../apiurl";
import styles from "./AddConductorStyles";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Import DateTimePickerModal
import * as ImagePicker from "expo-image-picker"; // Import expo-image-picker

const AddConductor = ({ navigation, route }) => {
  const { adminData } = route.params || {};

  const [Username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState(""); // Date of birth state
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [imageUri, setImageUri] = useState(null); // State for the profile image

  // State to handle visibility of DateTimePickerModal
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Show Date Picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Hide Date Picker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Handle date selection
  const handleConfirm = (date) => {
    setDob(date.toISOString().split("T")[0]); // Save the selected date in the desired format (YYYY-MM-DD)
    hideDatePicker();
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need permission to access your photos.");
    }
  };
  
  useEffect(() => {
    requestPermission();
  }, []);
  

  // Handle image picker
  const handleImagePick = async () => {
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      console.log("hiii")
      console.log(result.uri); // Check the URI
    }
  };

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
        Alert.alert(
          "Error",
          "Invalid Date of Birth. Please use YYYY-MM-DD format."
        );
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
      address: address,
      adminId: adminData._id,
      image: imageUri, // Send image URI in the data
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/Conductor/add`,
        conductorData
      );
      Alert.alert("Success", "Conductor added successfully!");
      navigation.navigate("AdminHome", { adminData });
    } catch (error) {
      console.error("Error adding conductor:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Something went wrong"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Add Conductor</Text>

          {/* Image Picker Button */}
          <Text style={styles.label}>Profile Image</Text>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          )}
          <TouchableOpacity
            onPress={handleImagePick}
            style={styles.imagePickerButton}
          >
            <Text style={styles.imagePickerButtonText}>
              {imageUri ? "Change Image" : "Pick Image"}
            </Text>
          </TouchableOpacity>

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
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.input}>
            <Text>{dob ? dob : "Select Date of Birth"}</Text>
          </TouchableOpacity>

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

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Address"
            value={address}
            onChangeText={setAddress}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Conductor</Text>
          </TouchableOpacity>

          {/* DateTimePickerModal */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={new Date()} // Optional: Prevent future dates
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddConductor;
