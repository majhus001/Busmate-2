import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView, ActivityIndicator 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import styles from "./ComplaintFormStyles"; 
import { API_BASE_URL } from "../../../apiurl";

const ComplaintForm = ({ conductorId, conductorName }) => {
  const [complaint, setComplaint] = useState("");
  const [issueType, setIssueType] = useState("Potholes");
  const [otherIssue, setOtherIssue] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);

  // Request Camera Permission and Capture Image
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

  // Request Gallery Permission and Pick Image
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

  // Fetch Complaints for a Conductor
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Conductor/complaints/${conductorId}`);
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Submit Complaint
  const handleSubmit = async () => {
    if (!complaint.trim()) {
      Alert.alert("Error", "Please enter complaint details");
      return;
    }
    
    setLoading(true);

    const complaintData = new FormData();
    complaintData.append("conductorId", conductorId);
    complaintData.append("conductorName", conductorName);
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
      const response = await axios.post(`${API_BASE_URL}/api/Conductor/complaints`, complaintData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Complaint submitted successfully");
        setComplaint("");
        setIssueType("Potholes");
        setOtherIssue("");
        setImage(null);
        fetchComplaints();
      } else {
        Alert.alert("Error", "Failed to submit complaint");
      }
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      Alert.alert("Error", "Network error, check server logs.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Complaint
  const editComplaint = async (complaintId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/Conductor/complaints/${complaintId}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (response.status === 200) {
        Alert.alert("Success", "Complaint updated successfully");
        fetchComplaints();
      } else {
        Alert.alert("Error", "Failed to update complaint");
      }
    } catch (error) {
      console.error("Error updating complaint:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong while updating the complaint.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Complaint
  const deleteComplaint = async (complaintId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/Conductor/complaints/${complaintId}`);
      Alert.alert("Success", "Complaint deleted");
      fetchComplaints();
    } catch (error) {
      console.error("Error deleting complaint:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report on Road Condition</Text>

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
          <Text style={styles.buttonText}>🖼️ Upload Image</Text>
        </TouchableOpacity>
      </View>

      {/* Display Selected Image */}
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Complaint 📝</Text>}
      </TouchableOpacity>

      {/* Display Complaints */}
      <Text style={styles.title}>Your Complaints</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        complaints.map((complaintItem) => (
          <View key={complaintItem._id} style={styles.complaintContainer}>
            <Text style={styles.complaintText}>📝 {complaintItem.complaint}</Text>
            <Text style={styles.complaintText}>📅 {new Date(complaintItem.timestamp).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ComplaintForm;
