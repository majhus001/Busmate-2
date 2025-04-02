import React, { useState, useEffect} from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import styles from "./ComplaintFormStyles"; 
import { API_BASE_URL } from "../../../apiurl"; 

const ComplaintForm = ({ route }) => {
  const { conductorId } = route.params || {}; 

  const [complaint, setComplaint] = useState("");
  const [issueType, setIssueType] = useState("Potholes");
  const [otherIssue, setOtherIssue] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!conductorId) {
      Alert.alert("Error", "Conductor ID is missing. Please log in again.");
    }
  }, [conductorId]);
  
  // Open camera
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Handle Complaint Submission
  const handleSubmit = async () => {
    if (!complaint.trim()) {
      Alert.alert("Error", "Please enter complaint details");
      return;
    }

    if (!conductorId) {
      Alert.alert("Error", "Conductor ID is missing. Please log in again.");
      return;
    }

    const complaintData = new FormData();
    complaintData.append("conductorId", conductorId);
    complaintData.append("complaint", complaint);
    complaintData.append("issueType", issueType === "Other" ? otherIssue : issueType);
    complaintData.append("complaintTime", new Date().toISOString());

    if (image) {
      complaintData.append("image", {
        uri: image,
        name: `complaint_${Date.now()}.jpg`, 
        type: "image/jpeg",
      });
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Conductor/complaints`,
        complaintData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Complaint submitted successfully");
        setComplaint("");
        setIssueType("Potholes");
        setOtherIssue("");
        setImage(null);
      } else {
        Alert.alert("Error", "Failed to submit complaint");
      }
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      Alert.alert("Error", "Network error, check server logs.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report Road Condition</Text>

      {/* Issue Type Picker */}
      <Text style={styles.label}>Select Issue Type:</Text>
      <Picker
        selectedValue={issueType}
        onValueChange={(itemValue) => setIssueType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Potholes" value="Potholes" />
        <Picker.Item label="Traffic Congestion" value="Traffic" />
        <Picker.Item label="Accidents" value="Accidents" />
        <Picker.Item label="Road Blockage" value="Blockage" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      {/* Show "Other" input field if selected */}
      {issueType === "Other" && (
        <TextInput
          style={styles.input}
          placeholder="Enter issue type"
          value={otherIssue}
          onChangeText={setOtherIssue}
        />
      )}

      {/* Complaint Details */}
      <Text style={styles.label}>Complaint Details:</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the issue..."
        value={complaint}
        onChangeText={setComplaint}
        multiline
      />

      {/* Image Picker Buttons */}
      <View style={styles.imageButtonsContainer}>
        <TouchableOpacity onPress={takePhoto} style={styles.button}>
          <Text style={styles.buttonText}>📷 Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>🖼 Upload Image</Text>
        </TouchableOpacity>
      </View>

      {/* Display selected image */}
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Complaint</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ComplaintForm;