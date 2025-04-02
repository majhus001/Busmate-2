import React, { useState, useLayoutEffect, useEffect } from "react";
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
import styles from "./ConProfileStyles"; // Importing styles
import { Button } from "react-native-paper";
import { API_BASE_URL } from "../../../apiurl";

const ConProfile = ({ route, navigation }) => {
  // Example user data
  const { conData } = route.params || {};

  const [loading, setLoading] = useState(false);

  const handleNavigate = (screen) => {
    if (!conData || !conData._id) {
      Alert.alert("Error", "Conductor ID is missing. Please log in again.");
      return;
    }
    console.log("Navigating with conductorId:", conData._id);
    navigation.navigate(screen, { conductorId: conData._id });
  };

  const handleLogout = async () => {
    setLoading(true);
    const conId = conData._id;
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/Conductor/logout/${conId}`
      );
      console.log("Logout successful:", response.data);
      navigation.navigate("login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Conductor Profile</Text>
      {/* Display the image at the top */}
      <Image
        source={{
          uri:
            conData.image ||
            "https://th.bing.com/th/id/OIP.aKiTvd6drTIayNy2hddhiQHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain",
        }}
        style={styles.profileImage}
        onError={(e) => console.log("Image Load Error", e.nativeEvent.error)}
      />

      <View style={styles.infoContainer}>
        <ProfileItem label="Username" value={conData.Username} />
        <ProfileItem label="Age" value={conData.age} />
        <ProfileItem label="Phone Number" value={conData.phoneNumber} />
        <ProfileItem label="Gender" value={conData.gender} />
        <ProfileItem
          label="Date of Birth"
          value={new Date(conData.dob).toISOString().split("T")[0]}
        />
        <ProfileItem label="Address" value={conData.address} />
        <ProfileItem
          label="LoggedIn"
          value={conData.LoggedIn ? "Active" : "Inactive"}
        />
        <TouchableOpacity onPress={handleLogout} style={styles.lgbutton}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.lgbuttonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.combtn}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNavigate("complaintform")}
        >
          <Text style={styles.buttonText}> Add Complaints</Text>
        </TouchableOpacity>

        {/* View Complaints Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNavigate("viewcomplaintform")}
        >
          <Text style={styles.buttonText}> View Complaints</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Component to display label-value pairs
const ProfileItem = ({ label, value }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default ConProfile;
