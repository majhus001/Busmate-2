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
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../apiurl";
import styles from "./UserProfileStyles";

const UserProfile = ({ navigation }) => {
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
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchIdAndUser = async () => {
      try {
        let id = await SecureStore.getItemAsync("currentUserId");
        if (id) {
          id = id.trim();
          setUserId(id);
          fetchUserProfile(id);
        } else {
          console.warn("⚠️ No ID found in SecureStore");
        }
      } catch (error) {
        console.error("❌ Error fetching ID:", error);
      }
    };
    fetchIdAndUser();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const userId = await SecureStore.getItemAsync("currentUserId");
      if (!userId) {
        console.warn("⚠️ No User ID found in SecureStore");
        return;
      }
  
      const response = await axios.post(`${API_BASE_URL}/api/userdata/admin/profile`, {
        userId: userId.trim(),
      });
  
      if (response.status === 200) {
        setUser({
          name: response.data.Username || "",
          email: response.data.email || "",
          password: response.data.password || "",
          age: response.data.age ? String(response.data.age) : "",
          city: response.data.city || "",
          state: response.data.state || "",
        });
        setProfileImage(response.data.image || "https://via.placeholder.com/150");
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const pickImage = async () => {
    if (!isEditing) return;
    
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Please allow access to your photo library to change profile picture.");
        return;
      }
      
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Editing",
      "Are you sure you want to cancel? All changes will be lost.",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => {
            fetchUserProfile();
            setIsEditing(false);
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!user.name.trim()) {
      Alert.alert("Error", "Name field cannot be empty!");
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
      
      const response = await axios.put(
        `${API_BASE_URL}/api/userdata/user/profileupdate/${userId.trim()}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderFieldIcon = (fieldName) => {
    switch (fieldName) {
      case "name":
        return <Ionicons name="person-outline" size={20} color="#5e72e4" />;
      case "email":
        return <Ionicons name="mail-outline" size={20} color="#5e72e4" />;
      case "password":
        return <Ionicons name="lock-closed-outline" size={20} color="#5e72e4" />;
      case "age":
        return <Ionicons name="calendar-outline" size={20} color="#5e72e4" />;
      case "city":
        return <Ionicons name="location-outline" size={20} color="#5e72e4" />;
      case "state":
        return <MaterialIcons name="location-city" size={20} color="#5e72e4" />;
      default:
        return null;
    }
  };

  if (loading && !user.name) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5e72e4" />
        <Text style={styles.loaderText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing ? (
          <TouchableOpacity style={styles.editIcon} onPress={handleEdit}>
            <Feather name="edit-2" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.editIcon} />
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                <Feather name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          {user.city && user.state && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#8898aa" />
              <Text style={styles.locationText}>{user.city}, {user.state}</Text>
            </View>
          )}
        </View>

        <View style={styles.formContainer}>
          {Object.entries(user).map(([key, value]) => (
            <View key={key} style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                {renderFieldIcon(key)}
                <Text style={styles.label}>
                  {key === "name" ? "Full Name" : 
                   key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.disabledInput,
                  key === "email" && isEditing && styles.emailDisabled
                ]}
                value={value}
                onChangeText={(text) => handleChange(key, text)}
                editable={key !== "email" && isEditing}
                placeholder={`Enter your ${key}`}
                placeholderTextColor="#a0aec0"
                secureTextEntry={key === "password"}
                keyboardType={key === "age" ? "numeric" : "default"}
              />
            </View>
          ))}
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Account created on {new Date().toLocaleDateString()}</Text>
        </View>
      </ScrollView>
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5e72e4" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default UserProfile;