import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiurl";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import styles from "./ViewBusesStyles";

const ViewBusesdata = ({ navigation }) => {
  const [adminData, setAdminData] = useState(null);
  const [buses, setBuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const busesPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const storedData = await SecureStore.getItemAsync("currentUserData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAdminData(parsedData);
        const adminId = parsedData._id;
        const [busResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/Admin/buses/fetchbus/${adminId}`),
        ]);
        setBuses(busResponse.data.data.map((bus) => ({ ...bus, expanded: false })));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const toggleDropdown = (id) => {
    setBuses((prevBuses) =>
      prevBuses.map((bus) =>
        bus._id === id ? { ...bus, expanded: !bus.expanded } : bus
      )
    );
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * busesPerPage < filteredBuses.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredBuses = buses.filter((bus) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      bus.busNo?.toString().toLowerCase().includes(searchLower) ||
      bus.busRouteNo?.toString().toLowerCase().includes(searchLower) ||
      bus.fromStage?.toString().toLowerCase().includes(searchLower) ||
      bus.toStage?.toString().toLowerCase().includes(searchLower)
    );
  });

  const paginatedBuses = filteredBuses.slice(
    currentPage * busesPerPage,
    (currentPage + 1) * busesPerPage
  );

  const totalPages = Math.ceil(filteredBuses.length / busesPerPage);

  return (
    <View style={styles.container}>
      <ScrollView
      showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bus Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddBuses")}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search buses..."
            placeholderTextColor="#888"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close" size={20} color="#888" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{filteredBuses.length}</Text>
            <Text style={styles.statLabel}>Total Buses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredBuses.filter(b => b.LoggedIn).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredBuses.filter(b => !b.LoggedIn).length}
            </Text>
            <Text style={styles.statLabel}>Inactive</Text>
          </View>
        </View>

        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <>
            {/* Bus List */}
            {paginatedBuses.length > 0 ? (
              paginatedBuses.map((item) => (
                <View key={item._id} style={styles.busCard}>
                  <TouchableOpacity
                    style={styles.busHeader}
                    activeOpacity={0.8}
                    onPress={() => toggleDropdown(item._id)}
                  >
                    <View style={styles.busNumberContainer}>
                      <Text style={styles.busNumber}>{item.busNo}</Text>
                    </View>
                    <View style={styles.busInfo}>
                      <Text style={styles.routeText}>
                        {item.fromStage} → {item.toStage}
                      </Text>
                      <Text style={styles.routeNumber}>Route #{item.busRouteNo}</Text>
                    </View>
                    <View style={[
                      styles.statusIndicator,
                      item.LoggedIn ? styles.active : styles.inactive
                    ]}>
                      <Text style={styles.statusText}>
                        {item.LoggedIn ? "Active" : "Inactive"}
                      </Text>
                    </View>
                    <Ionicons
                      name={item.expanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#007AFF"
                    />
                  </TouchableOpacity>

                  {/* Expanded Content */}
                  {item.expanded && (
                    <View style={styles.expandedContent}>
                      {/* Basic Info */}
                      <View style={styles.infoRow}>
                        <MaterialIcons name="directions-bus" size={20} color="#007AFF" />
                        <Text style={styles.infoText}>Type: {item.busType}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="people" size={20} color="#007AFF" />
                        <Text style={styles.infoText}>Seats: {item.totalSeats}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <MaterialIcons name="repeat" size={20} color="#007AFF" />
                        <Text style={styles.infoText}>Shifts: {item.totalShifts}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <MaterialIcons name="location-on" size={20} color="#007AFF" />
                        <Text style={styles.infoText}>
                          {item.city}, {item.state}
                        </Text>
                      </View>

                      {/* Timings Section */}
                      <Text style={styles.sectionTitle}>Timings</Text>
                      {item.timings ? (
                        Object.entries(item.timings).map(([stage, time], index) => (
                          <View key={index} style={styles.timingRow}>
                            <Text style={styles.timingStage}>{stage}</Text>
                            <View style={styles.timeBadge}>
                              <Ionicons name="time" size={14} color="#007AFF" />
                              <Text style={styles.timingText}>{time}</Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noDataText}>No timings available</Text>
                      )}

                      {/* Prices Section */}
                      <Text style={styles.sectionTitle}>Fares</Text>
                      {item.prices ? (
                        Object.entries(item.prices).map(([route, price], index) => (
                          <View key={index} style={styles.priceRow}>
                            <Text style={styles.priceRoute}>{route}</Text>
                            <View style={styles.priceBadge}>
                              <Text style={styles.priceText}>₹{price}</Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noDataText}>No fares available</Text>
                      )}

                      {/* Action Button */}
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                          navigation.navigate("updatebusesdata", {
                            busData: item,
                          })
                        }
                      >
                        <MaterialIcons name="edit" size={18} color="white" />
                        <Text style={styles.buttonText}>Edit Bus</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="directions-bus" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No buses found</Text>
                {searchQuery && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Text style={styles.clearSearch}>Clear search</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Pagination */}
            {filteredBuses.length > busesPerPage && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === 0 && styles.disabledButton,
                  ]}
                  onPress={handlePrevPage}
                  disabled={currentPage === 0}
                >
                  <Ionicons name="chevron-back" size={20} color={currentPage === 0 ? "#ccc" : "#007AFF"} />
                </TouchableOpacity>

                <Text style={styles.pageText}>
                  Page {currentPage + 1} of {totalPages}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage + 1 >= totalPages && styles.disabledButton,
                  ]}
                  onPress={handleNextPage}
                  disabled={currentPage + 1 >= totalPages}
                >
                  <Ionicons name="chevron-forward" size={20} color={currentPage + 1 >= totalPages ? "#ccc" : "#007AFF"} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ViewBusesdata;