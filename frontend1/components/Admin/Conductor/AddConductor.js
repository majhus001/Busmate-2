import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import moment from "moment";
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
  const [loading, setLoading] = useState(false);
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
    const formattedDate = moment(date).format("DD-MM-YYYY"); // Format DOB
    const calculatedAge = moment().diff(date, "years"); // Calculate Age

    setDob(formattedDate);
    setAge(calculatedAge.toString()); // Ensure age is a string for TextInput

    hideDatePicker();
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

  // Handle image picker
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri); // Correct way to get URI
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

    setLoading(true);

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

    const formData = new FormData();
    formData.append("Username", Username.trim());
    formData.append("phoneNumber", phoneNumber.trim());
    formData.append("dob", formattedDOB);
    formData.append("age", parseInt(age, 10) || null);
    formData.append("gender", gender);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("adminId", adminData._id);

    // Append image if selected
    if (imageUri) {
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("image", {
        uri: imageUri,
        name: `conductor.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/Conductor/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert("Success", "Conductor added successfully!");
      navigation.navigate("AdminHome", { adminData });
    } catch (error) {
      console.error("Error adding conductor:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Something went wrong"
      );
    } finally {
      setLoading(false); // Stop loading
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
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={{
                uri:
                  imageUri ||
                  "https://th.bing.com/th/id/OIP.aKiTvd6drTIayNy2hddhiQHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain",
              }}
              style={styles.profileImage}
              onError={(e) =>
                console.log("Image Load Error", e.nativeEvent.error)
              }
            />
            <TouchableOpacity>
              <Text style={styles.imagePickerButtonText}>
                {imageUri ? "Change Image" : "Pick Image"}
              </Text>
            </TouchableOpacity>
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
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonLoading]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Add Conductor</Text>
            )}
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
