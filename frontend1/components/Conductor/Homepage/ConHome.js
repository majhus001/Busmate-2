import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, RefreshControl, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { API_BASE_URL } from "../../../apiurl";
import * as SecureStore from "expo-secure-store";
import styles from "./ConHomeStyles";
import UserComplaint from "../Complaintform/UserCompliants";
import NotificationAlert from "./NotificationAlert";

// Simple helper function to format time elapsed
const getTimeElapsed = (date) => {
  const now = new Date();
  const diff = now - date;

  // Convert to seconds, minutes, hours, days
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

const ConHome = ({ navigation, route }) => {
  const { conData } = route.params || {};
  const [assignedBus, setAssignedBus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loginTime, setLoginTime] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalTickets: 0,
    totalRevenue: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [showStatusCard, setShowStatusCard] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Fetch assigned bus details
  const fetchAssignedBus = async () => {
    if (!conData || !conData._id) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/Conductor/assigned-bus/${conData._id}`
      );

      if (response.data && response.data.success && response.data.data) {
        setAssignedBus(response.data.data.bus);
      }
    } catch (error) {
      console.error('Error fetching assigned bus:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch login time from secure storage
  const fetchLoginTime = async () => {
    try {
      const storedLoginTime = await SecureStore.getItemAsync(`loginTime_${conData._id}`);
      if (storedLoginTime) {
        setLoginTime(new Date(storedLoginTime));
      } else {
        // If no stored login time, set current time and store it
        const currentTime = new Date();
        setLoginTime(currentTime);
        await SecureStore.setItemAsync(`loginTime_${conData._id}`, currentTime.toISOString());
      }
    } catch (error) {
      console.error('Error fetching login time:', error);
    }
  };

  // Fetch conductor stats
  const fetchConductorStats = async () => {
    try {
      // This would be an API call in a real app
      // For demo purposes, we'll use mock data
      setStats({
        totalTrips: Math.floor(Math.random() * 50) + 10,
        totalTickets: Math.floor(Math.random() * 500) + 100,
        totalRevenue: Math.floor(Math.random() * 10000) + 1000
      });
    } catch (error) {
      console.error('Error fetching conductor stats:', error);
    }
  };

  // Fetch weather data
  const fetchWeatherData = async () => {
    try {
      // This would be an API call to a weather service in a real app
      // For demo purposes, we'll use mock data
      setWeatherData({
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 30) + 50 // 50-80%
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      // This would be an API call in a real app
      // For demo purposes, we'll use mock data
      setNotifications([
        { id: 1, title: 'Schedule Change', message: 'Your shift has been updated for tomorrow.', time: new Date(Date.now() - 3600000) },
        { id: 2, title: 'Maintenance Alert', message: 'Bus maintenance scheduled for next week.', time: new Date(Date.now() - 86400000) }
      ]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch all data
  const fetchAllData = () => {
    fetchAssignedBus();
    fetchLoginTime();
    fetchConductorStats();
    fetchWeatherData();
    fetchNotifications();
  };

  // Fetch data on component mount
  useEffect(() => {
    if (conData && conData._id) {
      fetchAllData();
    }
  }, [conData]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const handleProfile = () => {
    navigation.navigate("conprofile", { conData });
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007bff"]} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>🚍 BusMate</Text>
          <Text style={styles.panelName}>Conductor Panel</Text>
        </View>

        {/* Status Card */}
        {showStatusCard && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Status</Text>
              <TouchableOpacity onPress={() => setShowStatusCard(false)}>
                <Icon name="close" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <View style={styles.statusContent}>
              <View style={styles.statusItem}>
                <Icon name="time-outline" size={20} color="#007AFF" />
                <Text style={styles.statusText}>
                  Logged in: {loginTime ? getTimeElapsed(loginTime) : "Just now"}
                </Text>
              </View>

              <View style={styles.statusItem}>
                <Icon name="radio-outline" size={20} color={conData.LoggedIn ? "#34C759" : "#FF3B30"} />
                <Text style={[styles.statusText, { color: conData.LoggedIn ? "#34C759" : "#FF3B30" }]}>
                  {conData.LoggedIn ? "Online" : "Offline"}
                </Text>
              </View>

              {weatherData && (
                <View style={styles.statusItem}>
                  <Icon
                    name={
                      weatherData.condition === "Sunny" ? "sunny-outline" :
                      weatherData.condition === "Cloudy" ? "cloud-outline" :
                      weatherData.condition === "Rainy" ? "rainy-outline" : "partly-sunny-outline"
                    }
                    size={20}
                    color="#FF9500"
                  />
                  <Text style={styles.statusText}>
                    {weatherData.temperature}°C, {weatherData.condition}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Statistics Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Icon name="stats-chart" size={24} color="#5856D6" style={styles.statsIcon} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.cardTitle}>Your Statistics</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalTrips}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalTickets}</Text>
              <Text style={styles.statLabel}>Tickets</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹{stats.totalRevenue}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
        </View>

      {/* Conductor Card */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.cardHeader, expanded && styles.cardHeaderExpanded]}
          onPress={toggleExpanded}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeaderContent}>
            <Image
              source={{ uri: conData.image || "https://via.placeholder.com/150" }}
              style={styles.profileImage}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.conductorName}>{conData.Username}</Text>
              <Text style={styles.conductorPhone}>{conData.phoneNumber}</Text>

              {/* Show bus route if assigned */}
              {assignedBus && (
                <View style={styles.busInfoRow}>
                  <Icon name="bus" size={14} color="#007AFF" />
                  <Text style={styles.busInfoText}>
                    {assignedBus.busRouteNo}
                  </Text>
                </View>
              )}
            </View>
            <Icon
              name={expanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="#8E8E93"
            />
          </View>
        </TouchableOpacity>

        {/* Expanded Details */}
        {expanded && (
          <View style={styles.expandedContent}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="person" size={18} color="#8E8E93" />
              </View>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Gender:</Text> {conData.gender || "Not specified"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="calendar" size={18} color="#8E8E93" />
              </View>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Age:</Text> {conData.age || "Not specified"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="location" size={18} color="#8E8E93" />
              </View>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Address:</Text> {conData.address || "Not specified"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleProfile}
            >
              <Text style={styles.profileButtonText}>View Full Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Assigned Bus Card */}
      {assignedBus ? (
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Icon name="bus" size={28} color="#007AFF" style={styles.busIcon} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.cardTitle}>Assigned Bus</Text>
                <Text style={styles.busRouteText}>{assignedBus.busRouteNo} - {assignedBus.busNo}</Text>
              </View>
            </View>
          </View>

          <View style={styles.busDetailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="map" size={18} color="#8E8E93" />
              </View>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Route:</Text> {assignedBus.route}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.startRideButton}
              onPress={() => navigation.navigate("conbusselect", { preselectedBus: assignedBus })}
            >
              <Icon name="play-circle" size={20} color="#FFFFFF" />
              <Text style={styles.startRideButtonText}>Start Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.cardContainer}>
          <View style={styles.noAssignmentContainer}>
            <Icon name="alert-circle" size={40} color="#FF9500" />
            <Text style={styles.noAssignmentText}>No bus assigned yet</Text>
            <Text style={styles.noAssignmentSubtext}>Please contact your administrator</Text>
          </View>

          <TouchableOpacity
            style={styles.startRideButton}
            onPress={() => navigation.navigate("conbusselect")}
          >
            <Icon name="play-circle" size={20} color="#FFFFFF" />
            <Text style={styles.startRideButtonText}>Select Bus Manually</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Icon name="notifications" size={24} color="#FF9500" style={styles.notificationIcon} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.cardTitle}>Notifications</Text>
              </View>
            </View>
          </View>

          <View style={styles.notificationsContainer}>
            {notifications.map(notification => (
              <View key={notification.id} style={styles.notificationItem}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationTime}>
                    {getTimeElapsed(notification.time)}
                  </Text>
                </View>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("complaintform", { conductorId: conData._id })}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FF3B30' }]}>
              <Icon name="warning" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Report Issue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("viewcomplaintform", { conductorId: conData._id })}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#5856D6' }]}>
              <Icon name="document-text" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>View Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleProfile}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#34C759' }]}>
              <Icon name="person" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </ScrollView>
    <UserComplaint/>
    <NotificationAlert/>
    </>
  );
};

export default ConHome;