import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_BASE_URL } from "../../../apiurl"; 
const { width } = Dimensions.get("window");

axios.defaults.timeout = 10000;

const UserComplaint = () => {
  const [userId, setUserId] = useState(null);
  const [busRoutes, setBusRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [errorRoutes, setErrorRoutes] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [fetchedConductorId, setFetchedConductorId] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [errorMetadata, setErrorMetadata] = useState(null);
  const [complaint, setComplaint] = useState("");
  const [issueType, setIssueType] = useState("Potholes");
  const [otherIssue, setOtherIssue] = useState("");
  const [image, setImage] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const issueTypes = [
 
    { label: "Traffic Congestion", value: "Traffic", icon: "traffic-cone" },
    { label: "Accidents", value: "Accidents", icon: "car-crash" },
    { label: "Road Blockage", value: "Blockage", icon: "road-barrier" },
    { label: "Bus Not Arrived", value: "NoShow", icon: "bus-alert" },
    { label: "Late Arrival", value: "Late", icon: "clock-alert" },
    { label: "Overcrowded Bus", value: "Overcrowded", icon: "account-group" },
    { label: "Driver Misbehavior", value: "DriverIssue", icon: "alert-octagon" },
    { label: "Other", value: "Other", icon: "alert-circle" },
  ];

  useEffect(() => {
    const fetchIdAndUser = async () => {
      try {
        let id = await SecureStore.getItemAsync("currentUserId");
        if (id) {
          id = id.trim();
          setUserId(id);
        } else {
          console.warn("⚠️ No ID found in SecureStore");
        }
      } catch (error) {
        console.error("❌ Error fetching ID:", error);
      }
    };
    fetchIdAndUser();
  }, []);

  useEffect(() => {
    const fetchBusRoutes = async () => {
      try {
        setLoadingRoutes(true);
        const response = await axios.get(`${API_BASE_URL}/api/bus/bus-routes`);
        setBusRoutes(response.data);
        setLoadingRoutes(false);
      } catch (err) {
        setErrorRoutes("Failed to load bus routes.");
        setLoadingRoutes(false);
      }
    };
    fetchBusRoutes();
  }, []);

  useEffect(() => {
    if (!selectedRoute) {
      setAdminId(null);
      setFetchedConductorId(null);
      setErrorMetadata(null);
      return;
    }

    const fetchMetadata = async () => {
      try {
        setLoadingMetadata(true);
        const response = await axios.get(`${API_BASE_URL}/api/bus/metadata/${selectedRoute}`);
        if (!response.data.conductorId || !response.data.adminId) throw new Error("Missing IDs");
        setAdminId(response.data.adminId);
        setFetchedConductorId(response.data.conductorId);
      } catch (err) {
        setErrorMetadata("Error fetching metadata.");
        setAdminId(null);
        setFetchedConductorId(null);
      } finally {
        setLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, [selectedRoute]);

  const retryFetchRoutes = () => {
    setErrorRoutes(null);
    setLoadingRoutes(true);
    setBusRoutes([]);
    const fetchAgain = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bus/bus-routes`);
        setBusRoutes(response.data);
        setLoadingRoutes(false);
      } catch {
        setErrorRoutes("Failed to load bus routes again.");
        setLoadingRoutes(false);
      }
    };
    fetchAgain();
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ 
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 0.7 
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ 
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 0.7 
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!selectedRoute || !complaint.trim() || !adminId || !fetchedConductorId || !userId) {
      Alert.alert("Error", "Please complete all required fields.");
      return;
    }

    if (issueType === "Other" && !otherIssue.trim()) {
      Alert.alert("Error", "Please specify the custom issue type.");
      return;
    }

    setLoadingSubmit(true);
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("conductorId", fetchedConductorId);
    formData.append("busRouteNo", selectedRoute);
    formData.append("complaint", complaint);
    formData.append("issueType", issueType);
    if (issueType === "Other") {
      formData.append("customIssueType", otherIssue);
    }
    formData.append("complaintTime", new Date().toISOString());
    formData.append("adminId", adminId);

    if (image) {
      formData.append("image", {
        uri: image,
        name: `complaint_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Usercomplaints/complaints`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", Accept: "application/json" } }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Complaint submitted successfully");
        setSelectedRoute("");
        setComplaint("");
        setIssueType("Potholes");
        setOtherIssue("");
        setImage(null);
        setAdminId(null);
        setFetchedConductorId(null);
      } else throw new Error("Unexpected response");
    } catch (error) {
      let errorMessage = "Failed to submit complaint. ";
      if (error.code === "ECONNABORTED") {
        errorMessage += "Request timed out.";
      } else if (error.response) {
        errorMessage += error.response.data.message || "Server error.";
      } else {
        errorMessage += error.message;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingRoutes) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading bus routes...</Text>
      </View>
    );
  }

  if (errorRoutes) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>{errorRoutes}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryFetchRoutes}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#6C63FF', '#4A42E8']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.title}>File a Complaint</Text>
          <Text style={styles.subtitle}>Report issues with bus service</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bus Information</Text>
          
          <Text style={styles.label}>Select Bus Route:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedRoute}
              onValueChange={(itemValue) => setSelectedRoute(itemValue)}
              style={styles.picker}
              dropdownIconColor="#6C63FF"
            >
              <Picker.Item label="Select a route" value="" />
              {busRoutes.map((route, index) => (
                <Picker.Item key={index} label={route} value={route} />
              ))}
            </Picker>
          </View>

          {loadingMetadata && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6C63FF" />
              <Text style={styles.loadingText}>Loading route details...</Text>
            </View>
          )}
          {errorMetadata && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={20} color="#FF6B6B" />
              <Text style={styles.errorTextSmall}>{errorMetadata}</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Issue Details</Text>
          
          <Text style={styles.label}>Issue Type:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={issueType}
              onValueChange={(itemValue) => setIssueType(itemValue)}
              style={styles.picker}
              dropdownIconColor="#6C63FF"
            >
              {issueTypes.map((type) => (
                <Picker.Item 
                  key={type.value} 
                  label={type.label} 
                  value={type.value} 
                />
              ))}
            </Picker>
          </View>

          {issueType === "Other" && (
            <TextInput
              style={styles.input}
              placeholder="Please specify the issue..."
              placeholderTextColor="#999"
              value={otherIssue}
              onChangeText={setOtherIssue}
            />
          )}

          <Text style={styles.label}>Complaint Details:</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Describe the issue in detail..."
            placeholderTextColor="#999"
            value={complaint}
            onChangeText={setComplaint}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Add Evidence (Optional)</Text>
          
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity onPress={takePhoto} style={[styles.button, styles.photoButton]}>
              <Ionicons name="camera" size={20} color="white" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={pickImage} style={[styles.button, styles.galleryButton]}>
              <Ionicons name="image" size={20} color="white" />
              <Text style={styles.buttonText}>Choose Image</Text>
            </TouchableOpacity>
          </View>

          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>
              Submit Complaint
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
    backgroundColor: "#F8F9FA",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 8,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "500",
    color: "#555",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#FAFAFA",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "48%",
  },
  photoButton: {
    backgroundColor: "#6C63FF",
  },
  galleryButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
  errorTextSmall: {
    color: "#FF6B6B",
    marginLeft: 5,
    fontSize: 14,
  },
  retryButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#6C63FF",
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "500",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  imagePreviewContainer: {
    position: "relative",
    marginTop: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
  },
});

export default UserComplaint;