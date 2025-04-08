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
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiurl";
import RNPickerSelect from "react-native-picker-select";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import styles from "./Updateconductordatastyle";

const Updateconductordata = ({ navigation, route }) => {
  const { conductorData } = route.params || {};

  const initialDob = conductorData?.dob
    ? moment(conductorData.dob, ["DD-MM-YYYY", moment.ISO_8601]).isValid()
      ? moment(conductorData.dob, ["DD-MM-YYYY", moment.ISO_8601]).toDate()
      : null
    : null;

  const [formData, setFormData] = useState({
    Username: conductorData?.Username || "",
    phoneNumber: conductorData?.phoneNumber || "",
    gender: conductorData?.gender || "",
    dob: initialDob ? moment(initialDob).format("DD-MM-YYYY") : "",
    age: conductorData?.age || "",
    password: conductorData?.password || "",
    address: conductorData?.address || "",
  });

  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(conductorData?.image || null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDob);
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

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setSelectedDate(date);
    const formattedDate = moment(date).format("DD-MM-YYYY");
    const calculatedAge = moment().diff(date, "years").toString();

    setFormData({
      ...formData,
      dob: formattedDate,
      age: calculatedAge,
    });
    hideDatePicker();
  };

  const handleUpdate = async () => {
    if (!formData.Username || !formData.phoneNumber) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

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
      <LinearGradient colors={["#ffffff", "#f5f9ff"]} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Conductor</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Profile Image Section */}
            <View style={styles.profileSection}>
              <TouchableOpacity onPress={handleImagePick}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={{
                      uri: imageUri || "https://i.imgur.com/Td9XQYX.png",
                    }}
                    style={styles.profileImage}
                  />
                  <View style={styles.editIcon}>
                    <FontAwesome name="pencil" size={16} color="white" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              {/* Username */}
              <View style={styles.inputField}>
                <Text style={styles.label}>Full Name *</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="person-outline"
                    size={20}
                    color="#7a7a7a"
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor="#999"
                    value={formData.Username}
                    onChangeText={(text) => handleChange("Username", text)}
                  />
                </View>
              </View>

              {/* Phone Number */}
              <View style={styles.inputField}>
                <Text style={styles.label}>Phone Number *</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="phone"
                    size={20}
                    color="#7a7a7a"
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="9876543210"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={(text) => handleChange("phoneNumber", text)}
                  />
                </View>
              </View>

              {/* DOB */}
              <View style={styles.inputField}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.inputContainer}
                >
                  <MaterialIcons
                    name="event"
                    size={20}
                    color="#7a7a7a"
                    style={styles.fieldIcon}
                  />
                  <Text
                    style={[styles.input, !formData.dob && { color: "#999" }]}
                  >
                    {formData.dob || "Select your birth date"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Age */}
              <View style={styles.inputField}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="cake"
                    size={20}
                    color="#7a7a7a"
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: "#7a7a7a" }]}
                    placeholder="Auto-calculated"
                    placeholderTextColor="#999"
                    value={
                      formData.age
                        ? formData.age.toString()
                        : conductorData?.age?.toString() || ""
                    }
                    editable={false}
                  />
                </View>
              </View>

              {/* Gender */}
              <View style={styles.inputField}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    onValueChange={(value) => handleChange("gender", value)}
                    items={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                    style={pickerSelectStyles}
                    placeholder={{ label: "Select gender", value: null }}
                    value={formData.gender}
                    Icon={() => (
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={24}
                        color="#7a7a7a"
                      />
                    )}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputField}>
                <Text style={styles.label}>Password *</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color="#7a7a7a"
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Set a password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => handleChange("password", text)}
                  />
                </View>
              </View>

              {/* Address */}
              <View style={styles.inputField}>
                <Text style={styles.label}>Address</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="home"
                    size={20}
                    color="#7a7a7a"
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="123 Main St, City"
                    placeholderTextColor="#999"
                    value={formData.address}
                    onChangeText={(text) => handleChange("address", text)}
                  />
                </View>
              </View>
            </View>

            {/* Date Picker */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={selectedDate || new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              maximumDate={new Date()}
            />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={handleUpdate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <MaterialIcons name="save" size={20} color="white" />
                    <Text style={styles.buttonText}>Update Conductor</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
              >
                <MaterialIcons name="delete" size={20} color="white" />
                <Text style={styles.buttonText}>Delete Conductor</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "#333",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#333",
    paddingRight: 30,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
  placeholder: {
    color: "#999",
  },
});

export default Updateconductordata;
