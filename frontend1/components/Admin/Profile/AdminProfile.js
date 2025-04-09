import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { API_BASE_URL } from "../../../apiurl";
import styles from "./AdminProfileStyles"

const AdminProfile = ({ navigation }) => {
  const [adminData, setAdminData] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    city: "",
    state: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchAdminData = async () => {
        try {
          const storedData = await SecureStore.getItemAsync("currentUserData");
          if (storedData) {
            const data = JSON.parse(storedData);
            setAdminData(data);
            setProfileImage(data.image || null);
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      };
      fetchAdminData();
    }, [])
  );

  useEffect(() => {
    if (adminData) {
      setUser({
        name: adminData.Username || "",
        email: adminData.email || "",
        password: adminData.password || "",
        age: adminData.age ? String(adminData.age) : "",
        city: adminData.city || "",
        state: adminData.state || "",
      });
    }
  }, [adminData]);

  const pickImage = async () => {
    if (!isEditing) return;
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your photos to change your profile picture.");
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user.name.trim()) {
      Alert.alert("Validation Error", "Please enter your name");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("age", user.age);
      formData.append("city", user.city);
      formData.append("state", user.state);

      if (profileImage && !profileImage.startsWith("http")) {
        const uriParts = profileImage.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("image", {
          uri: profileImage,
          name: `profile_${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/userdata/admin/profileupdate/${adminData._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        await SecureStore.setItemAsync("currentUserData", JSON.stringify(response.data.admin));
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity 
            onPress={pickImage} 
            disabled={!isEditing}
            activeOpacity={0.8}
          >
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: profileImage || "https://i.imgur.com/Td9XQYX.png",
                }}
                style={styles.profileImage}
              />
              {isEditing && (
                <View style={styles.editIcon}>
                  <Icon name="edit" size={18} color="white" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {[
            { label: "Full Name", field: "name", icon: "person", required: true },
            { label: "Email", field: "email", icon: "email", editable: false },
            { label: "Password", field: "password", icon: "lock", secure: true },
            { label: "Age", field: "age", icon: "cake", keyboardType: "numeric" },
            { label: "City", field: "city", icon: "location-city" },
            { label: "State", field: "state", icon: "map" },
          ].map((item) => (
            <View key={item.field} style={styles.inputField}>
              <Text style={styles.inputLabel}>
                {item.label}
                {item.required && <Text style={{ color: '#FF3B30' }}> *</Text>}
              </Text>
              <View style={styles.inputContainer}>
                <Icon
                  name={item.icon}
                  size={20}
                  color="#007AFF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    !isEditing && styles.inputDisabled,
                    item.editable === false && styles.inputDisabled
                  ]}
                  value={user[item.field]}
                  onChangeText={(text) => handleChange(item.field, text)}
                  editable={isEditing && (item.editable !== false)}
                  secureTextEntry={item.secure}
                  keyboardType={item.keyboardType}
                  placeholder={`Enter ${item.label.toLowerCase()}`}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.8}
            >
              <Icon name="edit" size={20} color="white" />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Icon name="save" size={20} color="white" />
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Icon name="close" size={20} color="#007AFF" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminProfile;