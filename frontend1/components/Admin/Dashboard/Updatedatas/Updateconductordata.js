import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiurl";
import styles from "../../Conductor/AddConductorStyles";
import RNPickerSelect from "react-native-picker-select";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import moment from "moment"; // Install via npm install moment

const Updateconductordata = ({ navigation, route }) => {
  const { conductorData } = route.params || {};

  const [formData, setFormData] = useState({
    Username: conductorData?.Username || "",
    phoneNumber: conductorData?.phoneNumber || "",
    gender: conductorData?.gender || "",
    dob: conductorData?.dob || "",
    age: conductorData?.age || "",
    password: conductorData?.password || "",
    address: conductorData?.address || "",
  });

  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(conductorData?.image || null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Handle Input Changes
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need permission to access your photos."
      );
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  // Handle Image Selection
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri); // Correct way to get URI
      console.log("Selected Image URI:", result.assets[0].uri);
    }
  };

  // Handle Date Picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY"); // Format DOB
    const calculatedAge = moment().diff(date, "years"); // Calculate Age

    setFormData({
      ...formData,
      dob: formattedDate,
      age: calculatedAge.toString(),
    });

    hideDatePicker();
  };

  // Handle Update (Including Image Upload)
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Append Image File to FormData if selected
      if (imageUri) {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formDataToSend.append("image", {
          uri: imageUri,
          name: `conductor.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      await axios.put(
        `${API_BASE_URL}/api/Admin/conductor/update/${conductorData._id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Alert.alert("Success", "Conductor details updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating conductor:", error);
      Alert.alert("Error", "Failed to update conductor details");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this conductor?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.delete(
                `${API_BASE_URL}/api/Admin/conductor/delete/${conductorData._id}`
              );
              Alert.alert("Success", "Conductor deleted successfully");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting conductor:", error);
              Alert.alert("Error", "Failed to delete conductor");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Update Conductor</Text>

          {/* Profile Image */}
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={{
                uri:
                  imageUri ||
                  "https://th.bing.com/th/id/OIP.aKiTvd6drTIayNy2hddhiQHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain",
              }}
              style={styles.profileImage}
            />
            <Text style={styles.imagePickerButtonText}>
              {imageUri ? "Change Image" : "Pick Image"}
            </Text>
          </TouchableOpacity>

          {/* Username */}
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            value={formData.Username}
            onChangeText={(text) => handleChange("Username", text)}
          />

          {/* Phone Number */}
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            value={formData.phoneNumber}
            onChangeText={(text) => handleChange("phoneNumber", text)}
          />

          {/* DOB */}
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.input}>
            <Text>{formData.dob || "Select Date of Birth"}</Text>
          </TouchableOpacity>

          {/* Age (Auto-Calculated) */}
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={formData.age}
            editable={false}
          />

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => handleChange("gender", value)}
              items={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
              style={styles.picker}
              placeholder={{ label: "Select Gender", value: null }}
              value={formData.gender}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Conductor Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Address"
            value={formData.address}
            onChangeText={(text) => handleChange("address", text)}
          />

          {/* Date Picker */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={new Date()}
          />

          {/* Update Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonLoading]}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Update Conductor</Text>
            )}
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Updateconductordata;
