import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import styles from "./AdDashStyles";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const AdDash = ({ navigation, route }) => {
  const { buses = [], conductors = [] } = route.params || {};
  const [loading, setLoading] = useState(false);

  const [adminData, setAdminData] = useState(null);
  useFocusEffect(
    useCallback(() => {
      const fetchAdminData = async () => {
        try {
          const storedData = await SecureStore.getItemAsync("currentUserData");
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setAdminData(parsedData);
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      };

      fetchAdminData();
    }, []) // Empty dependency array ensures it only runs when the page is focused
  );

  const activeBusesCount = buses.filter((bus) => bus.LoggedIn).length;
  const inactiveBusesCount = buses.length - activeBusesCount;
  const loggedOutConductors = conductors.filter(
    (conductor) => !conductor.LoggedIn
  ).length;
  const loggedInConductors = conductors.length - loggedOutConductors;

  // Show loading indicator
  if (loading) {
    return <ActivityIndicator animating size="large" style={styles.loader} />;
  }

  const handleProfile = () => {
    console.log("Admin Data before navigating:", adminData); // Debugging

    if (!adminData) {
      console.error("adminData is undefined! Navigation aborted.");
      return;
    }

    navigation.navigate("adprofile");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Bus Management Dashboard</Text>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <TouchableOpacity
          onPress={handleProfile}
          style={styles.dashheader}
          activeOpacity={0.7}
        >
          <Image
            source={{
              uri:
                adminData?.image ||
                "https://th.bing.com/th/id/OIP.aKiTvd6drTIayNy2hddhiQHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain",
            }}
            style={styles.profileImage}
          />
          {adminData && (
            <View>
              <Text style={styles.welcomeText}>{adminData?.Username}</Text>
              <Text style={styles.welcomeText}>
                {adminData?.state},{adminData?.city}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Dashboard Cards */}
      <View style={styles.gridContainer}>
        {[
          {
            title: "Total Buses",
            value: buses.length,
            onPress: () => navigation.navigate("ViewBuses", { buses }),
          },
          {
            title: "Total Conductors",
            value: conductors.length,
            onPress: () =>
              navigation.navigate("ViewConductors", { conductors }),
          },
          { title: "Active Buses", value: activeBusesCount },
          { title: "Inactive Buses", value: inactiveBusesCount },
          { title: "Conductors Logged In", value: loggedInConductors },
          { title: "Conductors Logged Out", value: loggedOutConductors },
          { title: "Reports", value: 10 },
          { title: "Alerts", value: 20 },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.7}
            onPress={item.onPress} 
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardValue}>{item.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default AdDash;
