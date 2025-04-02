import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const UserProfile = () => {
  // Example user data
  const conData = {
    Username: "John Doe",
    age: 25,
    phonenumber: "+1234567890",
    gender: "Male",
    password: "hidden",
    dob: "1999-05-12",
    loggedin: true,
    address: "123 Main Street, New York, USA",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.infoContainer}>
        <ProfileItem label="Username" value={conData.Username} />
        <ProfileItem label="Age" value={conData.age} />
        <ProfileItem label="Phone Number" value={conData.phonenumber} />
        <ProfileItem label="Gender" value={conData.gender} />
        <ProfileItem label="Date of Birth" value={conData.dob} />
        <ProfileItem label="Address" value={conData.address} />
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
});

export default UserProfile;
