import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../../apiurl";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./ConProfileStyles"; // Importing styles

const ConProfile = ({ route, navigation }) => {
  const { conData } = route.params || {};
  const [loading, setLoading] = useState(false);

  const handleNavigate = (screen) => {
    if (!conData || !conData._id) {
      Alert.alert("Error", "Conductor ID is missing. Please log in again.");
      return;
    }
    navigation.navigate(screen, { conductorId: conData._id });
  };

  const handleLogout = async () => {
    setLoading(true);
    const conId = conData._id;

    try {
      // Clear login time from SecureStore
      await SecureStore.deleteItemAsync(`loginTime_${conId}`);
      console.log("✅ Login time deleted successfully");

      // Clear user data from SecureStore
      await SecureStore.deleteItemAsync("currentUserData");
      console.log("✅ User data cleared from SecureStore");

      // Update server status
      await axios.put(`${API_BASE_URL}/api/Conductor/logout/${conId}`);
      console.log("✅ Logged out from server");

      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: "login" }],
      });
    } catch (error) {
      console.error("❌ Logout error:", error);
      Alert.alert(
        "Logout Error",
        "There was a problem logging out. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient colors={["#64AEFE", "#007bff"]} style={styles.gradient}>
          <Text style={styles.title}>Conductor Profile</Text>
        </LinearGradient>
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              conData.image ||
              "https://th.bing.com/th/id/OIP.aKiTvd6drTIayNy2hddhiQHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain",
          }}
          style={styles.profileImage}
        />
      </View>

      {/* Profile Details */}
      <View style={styles.card}>
        <ProfileItem label="Username" value={conData.Username} icon="person" />
        <ProfileItem label="Age" value={conData.age} icon="cake" />
        <ProfileItem label="Phone" value={conData.phoneNumber} icon="phone" />
        <ProfileItem label="Gender" value={conData.gender} icon="wc" />
        <ProfileItem
          label="Date of Birth"
          value={new Date(conData.dob).toISOString().split("T")[0]}
          icon="calendar-today"
        />
        <ProfileItem label="Address" value={conData.address} icon="home" />
        <ProfileItem
          label="Status"
          value={conData.LoggedIn ? "Active" : "Inactive"}
          icon="check-circle"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleNavigate("complaintform")}>
          <LinearGradient colors={["#007bff", "#007bff"]} style={styles.button}>
            <Icon name="report" size={24} color="#fff" />
            <Text style={styles.buttonText}>Add Complaint</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigate("viewcomplaintform")}>
          <LinearGradient colors={["#007bff", "#007bff"]} style={styles.button}>
            <Icon name="visibility" size={24} color="#fff" />
            <Text style={styles.buttonText}>View Complaints</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.logoutText}>Logout</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// Profile Item Component
const ProfileItem = ({ label, value, icon }) => (
  <View style={styles.item}>
    <Icon name={icon} size={22} color="#333" style={styles.icon} />
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default ConProfile;