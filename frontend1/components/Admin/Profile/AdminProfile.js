import React, { useState, useEffect } from "react";
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
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import styles from "./AdminProfileStyles";
import { API_BASE_URL } from "../../../apiurl";

const AdminProfile = ({ route, navigation }) => {
  const { adminData } = route.params || {};

  const [user, setUser] = useState({
    name: adminData?.Username || "",
    email: adminData?.email || "",
    password: adminData?.password || "",
    age: adminData?.age ? String(adminData.age) : "",
    city: adminData?.city || "",
    state: adminData?.state || "",
  });

  const [profileImage, setProfileImage] = useState(
    adminData?.image || "https://via.placeholder.com/150"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (
      !user.name.trim() ||
      !user.age.trim() ||
      !user.city.trim() ||
      !user.state.trim()
    ) {
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
      const adminId = adminData._id;

      console.log("uppppp")
      const response = await axios.put(
        `${API_BASE_URL}/api/userdata/admin/profileupdate/${adminId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!... login again to see the changes");
        setIsEditing(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Profile</Text>
        <TouchableOpacity onPress={pickImage} disabled={!isEditing}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.changeText}>
          {isEditing ? "Tap to change image" : ""}
        </Text>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={user.name}
            onChangeText={(text) => handleChange("name", text)}
            editable={isEditing}
          />
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={user.email}
            editable={false}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={user.password}
            onChangeText={(text) => handleChange("password", text)}
            editable={isEditing}
          />
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={user.age}
            onChangeText={(text) => handleChange("age", text)}
            keyboardType="numeric"
            editable={isEditing}
          />
          <Text style={styles.label}>City:</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={user.city}
            onChangeText={(text) => handleChange("city", text)}
            editable={isEditing}
          />
          <Text style={styles.label}>State:</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={user.state}
            onChangeText={(text) => handleChange("state", text)}
            editable={isEditing}
          />
        </View>

        {!isEditing ? (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default AdminProfile;
