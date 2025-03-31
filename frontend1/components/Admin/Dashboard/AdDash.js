import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import styles from "./AdDashStyles";

const AdDash = ({ navigation, route }) => {
  const { adminData, buses = [], conductors = [] } = route.params || {};
  const [loading, setLoading] = useState(false);

  // Calculate Active and Inactive Buses
  const activeBusesCount = buses.filter((bus) => bus.LoggedIn).length;
  const inactiveBusesCount = buses.length - activeBusesCount;

  // Show loading indicator
  if (loading) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.loader} />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Bus Management Dashboard</Text>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: "https://th.bing.com/th/id/OIP.aKiTvd6drTIayNy2hddhiQHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain",
          }}
          style={styles.profileImage}
        />
        {adminData?.Username && (
          <Text style={styles.welcomeText}>Welcome, {adminData.Username}!</Text>
        )}
      </View>

      {/* Dashboard Cards */}
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Total Buses</Text>
          <Text style={styles.cardValue}>{buses.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Total Conductors</Text>
          <Text style={styles.cardValue}>{conductors.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Active Buses</Text>
          <Text style={styles.cardValue}>{activeBusesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Inactive Buses</Text>
          <Text style={styles.cardValue}>{inactiveBusesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Conductors Logged Out</Text>
          <Text style={styles.cardValue}> {conductors.filter(conductor => !conductor.LoggedIn).length} </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Conductors Logged In</Text>
          <Text style={styles.cardValue}> {conductors.filter(conductor => conductor.LoggedIn).length} </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Reports</Text>
          <Text style={styles.cardValue}>10</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Alerts</Text>
          <Text style={styles.cardValue}>20</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AdDash;
