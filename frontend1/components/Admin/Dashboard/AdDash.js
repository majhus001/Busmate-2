import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ToastAndroid,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import styles from "./AdDashStyles";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { API_BASE_URL } from "../../../apiurl";

const AdDash = ({ navigation, route }) => {
  const { buses = [], conductors = [] } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [alertsCount, setAlertsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminData = async () => {
    try {
      const storedData = await SecureStore.getItemAsync("currentUserData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAdminData(parsedData);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/Conductor/complaints`
      );
      const unresolvedComplaints = response.data.filter(
        (item) => item.status === false
      );
      setComplaints(unresolvedComplaints);
      setAlertsCount(unresolvedComplaints.length);
    } catch (error) {
      Alert.alert("Error", "Failed to load complaints.");
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAdminData();
      fetchComplaints();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminData();
    fetchComplaints();
    ToastAndroid.show("Dashboard refreshed ", ToastAndroid.SHORT);
  };

  const activeBusesCount = buses.filter((bus) => bus.LoggedIn).length;
  const inactiveBusesCount = buses.length - activeBusesCount;
  const loggedOutConductors = conductors.filter(
    (conductor) => !conductor.LoggedIn
  ).length;
  const loggedInConductors = conductors.length - loggedOutConductors;

  if (loading) {
    return <ActivityIndicator animating size="large" style={styles.loader} />;
  }

  const handleProfile = () => {
    if (!adminData) {
      console.error("adminData is undefined! Navigation aborted.");
      return;
    }
    navigation.navigate("adprofile");
  };

  // Card data configuration
  const cardData = [
    {
      title: "Total Buses",
      value: buses.length,
      icon: "bus-outline",
      color: "#007AFF",
      onPress: () => navigation.navigate("ViewBuses", { buses }),
    },
    {
      title: "Total Conductors",
      value: conductors.length,
      icon: "people-outline",
      color: "#007AFF",
      onPress: () => navigation.navigate("ViewConductors", { conductors }),
    },
    {
      title: "Active Buses",
      value: activeBusesCount,
      icon: "checkmark-circle-outline",
      color: "#34C759",
    },
    {
      title: "Inactive Buses",
      value: inactiveBusesCount,
      icon: "close-circle-outline",
      color: "#FF3B30",
    },
    {
      title: "Logged In",
      value: loggedInConductors,
      icon: "log-in-outline",
      color: "#34C759",
    },
    {
      title: "Logged Out",
      value: loggedOutConductors,
      icon: "log-out-outline",
      color: "#FF3B30",
    },
    {
      title: "Assign Conductors",
      value: "Manage",
      icon: "people-circle-outline",
      color: "#5856D6",
      onPress: () => navigation.navigate("AssignConductors", { conductors, buses }),
    },
    {
      title: "Reports",
      value: "10+",
      icon: "document-text-outline",
      color: "#AF52DE",
      onPress: () => navigation.navigate("adreports"),
    },
    {
      title: "Alerts",
      value: alertsCount > 0 ? `${alertsCount}+` : "0",
      icon: "alert-circle-outline",
      color: "#FF3B30",
      onPress: () => navigation.navigate("statuscomplient", { complaints }),
    },
    {
      title: "User Complaints",
      value: complaints.length > 0 ? `${complaints.length}+` : "0",
      icon: "chatbox-ellipses-outline",
      color: "#FF9500",
      onPress: () => navigation.navigate("AdminUserComplaints", { complaints }),
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#007AFF"
        />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => navigation.navigate("Alerts", { complaints })}
        >
          <Icon name="notifications-outline" size={24} color="#007AFF" />
          {alertsCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>
                {alertsCount > 9 ? "9+" : alertsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <TouchableOpacity
        onPress={handleProfile}
        style={styles.profileCard}
        activeOpacity={0.8}
      >
        <Image
          source={{
            uri:
              adminData?.image ||
              "https://th.bing.com/th/id/OIP.aKiTvd6drTIayNy2hddhiQHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain",
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.adminName}>{adminData?.Username || "Admin"}</Text>
          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={14} color="#8E8E93" />
            <Text style={styles.locationText}>
              {adminData?.city || "City"}, {adminData?.state || "State"}
            </Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={20} color="#C7C7CC" />
      </TouchableOpacity>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="bus" size={20} color="#007AFF" />
          <Text style={styles.statNumber}>{buses.length}</Text>
          <Text style={styles.statLabel}>Buses</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Icon name="people" size={20} color="#007AFF" />
          <Text style={styles.statNumber}>{conductors.length}</Text>
          <Text style={styles.statLabel}>Conductors</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Icon name="alert-circle" size={20} color="#007AFF" />
          <Text style={styles.statNumber}>{alertsCount}</Text>
          <Text style={styles.statLabel}>Alerts</Text>
        </View>
      </View>

      {/* Dashboard Cards Grid */}
      <View style={styles.gridContainer}>
        {cardData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { borderTopColor: item.color }]}
            activeOpacity={0.8}
            onPress={item.onPress}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${item.color}20` },
                ]}
              >
                <Icon name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <Text style={[styles.cardValue, { color: item.color }]}>
              {item.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default AdDash;