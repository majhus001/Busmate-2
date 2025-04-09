import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { Card, ActivityIndicator } from "react-native-paper";
import { API_BASE_URL } from "../../../apiurl";
import styles from "./AdminHomeStyles";
import * as SecureStore from "expo-secure-store";

const AdminHome = ({ navigation, route }) => {
  const [buses, setBuses] = useState([]);
  const [conductors, setConductors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTab, setSelectedTab] = useState("Buses");
  const [expandedConductor, setExpandedConductor] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const busesPerPage = 5;
  const conductorsPerPage = 10;

  const [adminData, setAdminData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const storedData = await SecureStore.getItemAsync("currentUserData");
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setAdminData(parsedData);
            console.log(parsedData);
            const adminId = parsedData._id;
            const [busResponse, conductorResponse] = await Promise.all([
              axios.get(`${API_BASE_URL}/api/Admin/buses/fetchbus/${adminId}`),
              axios.get(
                `${API_BASE_URL}/api/Admin/conductor/fetchconductor/${adminId}`
              ),
            ]);

            setBuses(
              busResponse.data.data.map((bus) => ({ ...bus, expanded: false }))
            );
            setConductors(conductorResponse.data.data);
          }
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      };

      const fetchComplaints = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/Conductor/complaints`
          );
          const unresolvedComplaints = response.data.filter(
            (item) => item.status === false
          );
          setComplaints(unresolvedComplaints); // Store unresolved complaints
        } catch (error) {
          Alert.alert("Error", "Failed to load complaints.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      fetchComplaints();
    }, [])
  );

  if (!buses || !conductors) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.loader} />
    );
  }

  const toggleDropdownbus = (id) => {
    setBuses((prevBuses) =>
      prevBuses.map((bus) =>
        bus._id === id ? { ...bus, expanded: !bus.expanded } : bus
      )
    );
  };

  const toggleDropdowncon = (id) => {
    setExpandedConductor(expandedConductor === id ? null : id);
  };
  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  const handleBusNextPage = () => {
    if ((currentPage + 1) * busesPerPage < buses.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBusPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleConNextPage = () => {
    if ((currentPage + 1) * conductorsPerPage < conductors.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleConPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Search and Pagination Logic
  const filteredBuses = buses.filter((bus) => {
    const searchLower = searchQuery.toLowerCase();

    return (
      bus.busNo?.toString().toLowerCase().startsWith(searchLower) ||
      bus.busRouteNo?.toString().toLowerCase().startsWith(searchLower) ||
      bus.fromStage?.toString().toLowerCase().startsWith(searchLower) ||
      bus.toStage?.toString().toLowerCase().startsWith(searchLower) ||
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

  const filteredConductors = conductors.filter((conductor) =>
    conductor.Username.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const paginatedConductors = filteredConductors.slice(
    currentPage * conductorsPerPage,
    (currentPage + 1) * conductorsPerPage
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("addash", { buses, conductors })}
          style={styles.profileTouchable}
        >
          <View style={styles.profileSection}>
            <Image
              source={{
                uri:
                  adminData.image ||
                  "https://th.bing.com/th/id/OIP.aKiTvd6drTIayNy2hddhiQHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain",
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>
                {adminData?.Username || "Admin"}
              </Text>
              <Text style={styles.profileRole}>Administrator</Text>
              <View style={styles.locationContainer}>
                <Icon name="location-outline" size={14} color="#007AFF" />
                <Text style={styles.profileDetail}>
                  {adminData?.city || "city"}, {adminData?.state || "state"}
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#C7C7CC" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("statuscomplient")}
          style={styles.complaintIcon}
        >
          <Icon name="alert-circle-outline" size={28} color="#FF3B30" />
        </TouchableOpacity>
      </View>

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
          <Text style={styles.statNumber}>{complaints.length}</Text>
          <Text style={styles.statLabel}>Alerts</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("AddBuses")}
        >
          <Icon name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Add Bus</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("AddConductor")}
        >
          <Icon name="person-add" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Add Conductor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("adroutes")}
        >
          <Icon name="map" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Manage Routes</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedTab === "Buses" && styles.activeToggleButton,
          ]}
          onPress={() => setSelectedTab("Buses")}
        >
          <Icon
            name="bus"
            size={18}
            color={selectedTab === "Buses" ? "#fff" : "#007AFF"}
          />
          <Text
            style={[
              styles.toggleButtonText,
              selectedTab === "Buses" && styles.activeToggleButtonText,
            ]}
          >
            Buses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedTab === "Conductors" && styles.activeToggleButton,
          ]}
          onPress={() => setSelectedTab("Conductors")}
        >
          <Icon
            name="people"
            size={18}
            color={selectedTab === "Conductors" ? "#fff" : "#007AFF"}
          />
          <Text
            style={[
              styles.toggleButtonText,
              selectedTab === "Conductors" && styles.activeToggleButtonText,
            ]}
          >
            Conductors
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${
            selectedTab === "Buses"
              ? "by Bus Route, Place, plate no"
              : "Conductors by Name"
          }`}
          placeholderTextColor="#8E8E93"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content Section */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : selectedTab === "Buses" ? (
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Available Buses</Text>

          {paginatedBuses.length > 0 ? (
            paginatedBuses.map((item) => (
              <View key={item._id} style={styles.card}>
                <TouchableOpacity
                  onPress={() => toggleDropdownbus(item._id)}
                  style={styles.cardHeader}
                >
                  <View style={styles.cardHeaderContent}>
                    <Text style={styles.cardTitle}>
                      Route No: {item.busRouteNo}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        item.LoggedIn
                          ? styles.statusActive
                          : styles.statusInactive,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {item.LoggedIn ? "Active" : "Inactive"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardSubtitle}>
                    From: {item.fromStage} ➡️ To: {item.toStage}
                  </Text>
                  <Icon
                    name={item.expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#007AFF"
                    style={styles.chevronIcon}
                  />
                </TouchableOpacity>

                {item.expanded && (
                  <View style={styles.cardBody}>
                    <View style={styles.detailRow}>
                      <Icon
                        name="document-text-outline"
                        size={16}
                        color="#007AFF"
                      />
                      <Text style={styles.detailText}>
                        Bus No: {item.busNo}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Icon
                        name="car-sport-outline"
                        size={16}
                        color="#007AFF"
                      />
                      <Text style={styles.detailText}>
                        Type: {item.busType}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Icon name="people-outline" size={16} color="#007AFF" />
                      <Text style={styles.detailText}>
                        Seats: {item.totalSeats}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Icon name="location-outline" size={16} color="#007AFF" />
                      <Text style={styles.detailText}>
                        {item.city}, {item.state}
                      </Text>
                    </View>

                    <View style={styles.sectionTitleContainer}>
                      <Text style={styles.sectionTitleSmall}>Timings</Text>
                    </View>
                    <View style={styles.timingsContainer}>
                      {item.timings ? (
                        Object.entries(item.timings).map(
                          ([stage, time], index) => (
                            <View key={index} style={styles.timingItem}>
                              <Icon
                                name="time-outline"
                                size={14}
                                color="#007AFF"
                              />
                              <Text style={styles.timingText}>
                                {stage}: {time}
                              </Text>
                            </View>
                          )
                        )
                      ) : (
                        <Text style={styles.noDataTextSmall}>N/A</Text>
                      )}
                    </View>

                    <View style={styles.sectionTitleContainer}>
                      <Text style={styles.sectionTitleSmall}>Fares</Text>
                    </View>
                    <View style={styles.timingsContainer}>
                      {item.prices ? (
                        Object.entries(item.prices).map(
                          ([route, price], index) => (
                            <View key={index} style={styles.timingItem}>
                              <Icon
                                name="pricetag-outline"
                                size={14}
                                color="#007AFF"
                              />
                              <Text style={styles.timingText}>
                                {route}: ₹{price}
                              </Text>
                            </View>
                          )
                        )
                      ) : (
                        <Text style={styles.noDataTextSmall}>N/A</Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="bus-outline" size={50} color="#C7C7CC" />
              <Text style={styles.emptyStateText}>No Buses Found</Text>
            </View>
          )}

          {/* Pagination */}
          {filteredBuses.length > busesPerPage && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 0 && styles.paginationButtonDisabled,
                ]}
                onPress={handleBusPrevPage}
                disabled={currentPage === 0}
              >
                <Text style={styles.paginationButtonText}>Previous</Text>
              </TouchableOpacity>

              <Text style={styles.pageIndicator}>
                Page {currentPage + 1} of{" "}
                {Math.ceil(filteredBuses.length / busesPerPage)}
              </Text>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  (currentPage + 1) * busesPerPage >= filteredBuses.length &&
                    styles.paginationButtonDisabled,
                ]}
                onPress={handleBusNextPage}
                disabled={
                  (currentPage + 1) * busesPerPage >= filteredBuses.length
                }
              >
                <Text style={styles.paginationButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Conductors</Text>

          {paginatedConductors.length > 0 ? (
            paginatedConductors.map((conductor) => (
              <View key={conductor._id} style={styles.card}>
                <TouchableOpacity
                  onPress={() => toggleDropdowncon(conductor._id)}
                  style={styles.cardHeader}
                >
                  <View style={styles.cardHeaderContent}>
                    <View style={styles.conductorInfo}>
                      <Icon name="person-outline" size={18} color="#007AFF" />
                      <Text style={styles.cardTitle}>{conductor.Username}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        conductor.isActive
                          ? styles.statusActive
                          : styles.statusInactive,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {conductor.isActive ? "Active" : "Inactive"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.conductorContact}>
                    <Icon name="call-outline" size={16} color="#007AFF" />
                    <Text style={styles.cardSubtitle}>
                      {conductor.phoneNumber}
                    </Text>
                  </View>
                  <Icon
                    name={
                      expandedConductor === conductor._id
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={20}
                    color="#007AFF"
                    style={styles.chevronIcon}
                  />
                </TouchableOpacity>

                {expandedConductor === conductor._id && (
                  <View style={styles.cardBody}>
                    <View style={styles.detailRow}>
                      <Icon
                        name="transgender-outline"
                        size={16}
                        color="#007AFF"
                      />
                      <Text style={styles.detailText}>
                        Gender: {conductor.gender || "Not specified"}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Icon name="calendar-outline" size={16} color="#007AFF" />
                      <Text style={styles.detailText}>
                        Age: {conductor.age || "Not provided"}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Icon name="home-outline" size={16} color="#007AFF" />
                      <Text style={styles.detailText}>
                        Address: {conductor.address || "Not available"}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="people-outline" size={50} color="#C7C7CC" />
              <Text style={styles.emptyStateText}>No Conductors Found</Text>
            </View>
          )}

          {/* Pagination */}
          {filteredConductors.length > conductorsPerPage && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 0 && styles.paginationButtonDisabled,
                ]}
                onPress={handleConPrevPage}
                disabled={currentPage === 0}
              >
                <Text style={styles.paginationButtonText}>Previous</Text>
              </TouchableOpacity>

              <Text style={styles.pageIndicator}>
                Page {currentPage + 1} of{" "}
                {Math.ceil(filteredConductors.length / conductorsPerPage)}
              </Text>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  (currentPage + 1) * conductorsPerPage >=
                    filteredConductors.length &&
                    styles.paginationButtonDisabled,
                ]}
                onPress={handleConNextPage}
                disabled={
                  (currentPage + 1) * conductorsPerPage >=
                  filteredConductors.length
                }
              >
                <Text style={styles.paginationButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default AdminHome;
