import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, 
  Image, ScrollView, ActivityIndicator 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import styles from "./ComplaintFormStyles"; 
import { API_BASE_URL } from "../../../apiurl";

const ComplaintForm = ({ conductorId, adminId }) => {
  const [complaint, setComplaint] = useState("");
  const [issueType, setIssueType] = useState("Potholes");
  const [otherIssue, setOtherIssue] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!complaint.trim()) {
      Alert.alert("Error", "Please enter complaint details.");
      return;
    }

    setLoading(true);
    const complaintData = new FormData();
    complaintData.append("conductorId", conductorId);
    complaintData.append("adminId", adminId);
    complaintData.append("issueType", issueType === "Other" ? otherIssue : issueType);
    complaintData.append("complaint", complaint);
    complaintData.append("complaintTime", new Date().toISOString());

    if (image) {
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];

      complaintData.append("image", {
        uri: image,
        name: `complaint_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/complaints/add`, complaintData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Complaint submitted successfully!");
        setComplaint("");
        setIssueType("Potholes");
        setOtherIssue("");
        setImage(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report an Issue</Text>
      
      <Text style={styles.label}>Issue Type</Text>
      <Picker selectedValue={issueType} onValueChange={setIssueType} style={styles.picker}>
        <Picker.Item label="Potholes" value="Potholes" />
        <Picker.Item label="Broken Seats" value="Broken Seats" />
        <Picker.Item label="Lighting Issues" value="Lighting Issues" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      {issueType === "Other" && (
        <TextInput 
          style={styles.input} 
          placeholder="Specify the issue..." 
          value={otherIssue} 
          onChangeText={setOtherIssue} 
        />
      )}

      <Text style={styles.label}>Complaint Details</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Describe the issue..." 
        value={complaint} 
        onChangeText={setComplaint} 
        multiline 
      />

      <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ComplaintForm;
