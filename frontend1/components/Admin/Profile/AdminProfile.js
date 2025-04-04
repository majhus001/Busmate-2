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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./AdminProfileStyles";
import { API_BASE_URL } from "../../../apiurl";

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
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchAdminData = async () => {
        try {
          const storedData = await SecureStore.getItemAsync("currentUserData");
          if (storedData) {
            setAdminData(JSON.parse(storedData));
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
      setProfileImage(adminData.image || "https://via.placeholder.com/150");
    }
  }, [adminData]);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need access to your photo library to change the profile image."
        );
      }
    };
    requestPermission();
  }, []);

  const pickImage = async () => {
    if (!isEditing) return;
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    setLoading(false);
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleChange = (field, value) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (!user.name.trim() || !user.age.trim() || !user.city.trim() || !user.state.trim()) {
      Alert.alert("Error", "All fields must be filled!");
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
      if (profileImage !== "https://via.placeholder.com/150") {
        const uriParts = profileImage.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("image", {
          uri: profileImage,
          name: `profile_${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      if (!adminData?._id) {
        Alert.alert("Error", "Admin ID not found.");
        return;
      }
      const response = await axios.put(
        `${API_BASE_URL}/api/userdata/admin/profileupdate/${adminData._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
        setIsEditing(false);
        await SecureStore.setItemAsync("currentUserData", JSON.stringify(response.data.admin));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.gradient}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Admin Profile</Text>

          <TouchableOpacity onPress={pickImage} disabled={!isEditing} style={styles.profileContainer}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            {isEditing && <Icon name="photo-camera" size={24} color="white" style={styles.cameraIcon} />}
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#lightblue" style={styles.loader} />}

          <View style={styles.form}>
            {[
              { label: "Name", field: "name", icon: "person" },
              { label: "Email", field: "email", icon: "email", editable: false },
              { label: "Password", field: "password", icon: "lock" },
              { label: "Age", field: "age", icon: "calendar-today", keyboardType: "numeric" },
              { label: "City", field: "city", icon: "location-city" },
              { label: "State", field: "state", icon: "place" },
            ].map(({ label, field, icon, keyboardType, editable = true }) => (
              <View key={field} style={styles.inputContainer}>
                <Icon name={icon} size={20} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, !editable && styles.disabledInput]}
                  value={user[field]}
                  onChangeText={(text) => handleChange(field, text)}
                  editable={isEditing && editable}
                  keyboardType={keyboardType}
                />
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            {!isEditing ? (
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Icon name="edit" size={20} color="#fff" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Icon name="save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AdminProfile;
