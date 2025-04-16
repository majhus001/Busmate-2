import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  RefreshControl,
  ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import styles from "./AssignConductorsStyles";
import { API_BASE_URL } from "../../../apiurl";

const AssignConductors = ({ route ,navigation }) => {
  const { conductors = [], buses = [] } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminData, setAdminData] = useState(null);
  const [allConductors, setAllConductors] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [filteredConductors, setFilteredConductors] = useState([]);
  const [selectedConductor, setSelectedConductor] = useState(null);
  const [selectedBus, setSelectedBus] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState("all"); // all, assigned, unassigned
  const [assignmentStatus, setAssignmentStatus] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [expandedConductors, setExpandedConductors] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [paginatedConductors, setPaginatedConductors] = useState([]);

  // Fetch admin data
  const fetchAdminData = async () => {
    try {
      const storedData = await SecureStore.getItemAsync("currentUserData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAdminData(parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
    return null;
  };

  // Fetch conductors
  const fetchConductors = async () => {
    try {
      setLoading(true);
      const admin = adminData || (await fetchAdminData());
      if (!admin) {
        console.error("No admin data available");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/conductor/fetchconductor/${admin._id}`
      );

      if (response.data && response.data.data) {
        setAllConductors(response.data.data);
        applyFilters(response.data.data, searchQuery, filter);
      }
    } catch (error) {
      console.error("Error fetching conductors:", error);
      Alert.alert("Error", "Failed to load conductors.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch buses
  const fetchBuses = async () => {
    try {
      const admin = adminData || (await fetchAdminData());
      if (!admin) {
        console.error("No admin data available");
        return;
      }

      // Fetch buses by admin ID
      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchbus/${admin._id}`
      );

      if (response.data && response.data.data) {
        setAllBuses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  // Apply filters to conductors
  const applyFilters = (conductors, query, filterType) => {
    let filtered = [...conductors];

    // Apply search query filter
    if (query) {
      filtered = filtered.filter(
        (conductor) =>
          conductor.Username.toLowerCase().includes(query.toLowerCase()) ||
          conductor.phoneNumber.includes(query)
      );
    }

    // Apply status filter
    if (filterType === "active") {
      filtered = filtered.filter((conductor) => conductor.LoggedIn);
    } else if (filterType === "inactive") {
      filtered = filtered.filter((conductor) => !conductor.LoggedIn);
    }

    setFilteredConductors(filtered);
    updatePagination(filtered, 1); // Reset to first page when filters change
  };

  // Update pagination
  const updatePagination = (items, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    setPaginatedConductors(paginatedItems);
    setCurrentPage(page);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    updatePagination(filteredConductors, newPage);
  };

  // Handle search input change
  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilters(allConductors, text, filter);
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilters(allConductors, searchQuery, newFilter);
  };

  // Handle conductor selection for assignment
  const handleAssignConductor = (conductor) => {
    setSelectedConductor(conductor);
    setModalVisible(true);
  };

  // Handle bus selection in modal
  const handleBusSelection = (busId) => {
    setSelectedBus(busId);
  };

  // Toggle conductor expanded state
  const toggleConductorExpanded = (conductorId) => {
    setExpandedConductors(prev => ({
      ...prev,
      [conductorId]: !prev[conductorId]
    }));
  };

  // Handle assignment confirmation
  const handleConfirmAssignment = async () => {
    if (!selectedConductor || !selectedBus) {
      Alert.alert("Error", "Please select both a conductor and a bus.");
      return;
    }

    try {
      setLoading(true);

      console.log("Assigning conductor:", selectedConductor._id, "to bus:", selectedBus);
      // Make API call to update the conductor with the assigned bus
      const response = await axios.put(
        `${API_BASE_URL}/api/Admin/conductor/update/${selectedConductor._id}`,
        {
          assignedBusId: selectedBus
        }
      );

      console.log("Assignment response:", response.data);

      if (response.data) {
        // Find the bus details to include in the success message
        const assignedBus = allBuses.find(bus => bus._id === selectedBus);
        const busDetails = assignedBus ?
          `${assignedBus.busRouteNo} - ${assignedBus.busNo} (${assignedBus.fromStage} to ${assignedBus.toStage})` :
          "selected bus";

        setAssignmentStatus({
          success: true,
          message: `Conductor ${selectedConductor.Username} assigned to ${busDetails} successfully!`,
        });
        ToastAndroid.show(`Conductor assigned to ${assignedBus?.busRouteNo || 'bus'} successfully!`, ToastAndroid.SHORT);

        // Refresh the data
        fetchConductors();
        fetchAssignments();
      } else {
        setAssignmentStatus({
          success: false,
          message: response.data?.message || "Failed to assign conductor.",
        });
      }
    } catch (error) {
      console.error("Error assigning conductor:", error);

      // Log detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }

      setAssignmentStatus({
        success: false,
        message: error.response?.data?.message || "An error occurred while assigning the conductor. Please check the console for details.",
      });
    } finally {
      setLoading(false);
      setModalVisible(false);
      // Clear the status after a delay
      setTimeout(() => {
        setAssignmentStatus(null);
      }, 3000);
    }
  };

  // Refresh data
  const onRefresh = () => {
    setRefreshing(true);
    fetchConductors();
    fetchBuses();
    fetchAssignments();
    ToastAndroid.show("Conductors refreshed", ToastAndroid.SHORT);
  };

  // Fetch conductor assignments
  const fetchAssignments = async () => {
    try {
      // We'll just fetch conductors with assignedBusId
      const admin = adminData || (await fetchAdminData());
      if (!admin) {
        console.error("No admin data available");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/conductor/fetchconductor/${admin._id}`
      );

      if (response.data && response.data.data) {
        // Filter conductors with assignedBusId
        const assignedConductors = response.data.data.filter(c => c.assignedBusId);
        setAssignments(assignedConductors);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  // Initial data loading
  useFocusEffect(
    useCallback(() => {
      fetchAdminData();
      fetchConductors();
      fetchBuses();
      fetchAssignments();
    }, [])
  );

  // Update filtered conductors when all conductors change
  useEffect(() => {
    applyFilters(allConductors, searchQuery, filter);
  }, [allConductors]);

  // Update pagination when filtered conductors change
  useEffect(() => {
    updatePagination(filteredConductors, currentPage);
  }, [filteredConductors, currentPage, itemsPerPage]);

  if (loading && !refreshing) {
    return <ActivityIndicator animating size="large" style={styles.loader} />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Assign Conductors</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conductors..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#8E8E93"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Icon name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "all" && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterChange("all")}
          >
            <Icon
              name="people"
              size={16}
              color={filter === "all" ? "#007AFF" : "#8E8E93"}
            />
            <Text
              style={[
                styles.filterText,
                filter === "all" && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "active" && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterChange("active")}
          >
            <Icon
              name="checkmark-circle"
              size={16}
              color={filter === "active" ? "#007AFF" : "#8E8E93"}
            />
            <Text
              style={[
                styles.filterText,
                filter === "active" && styles.filterTextActive,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "inactive" && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterChange("inactive")}
          >
            <Icon
              name="close-circle"
              size={16}
              color={filter === "inactive" ? "#007AFF" : "#8E8E93"}
            />
            <Text
              style={[
                styles.filterText,
                filter === "inactive" && styles.filterTextActive,
              ]}
            >
              Inactive
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Assignment Status Message */}
      {assignmentStatus && (
        <Text
          style={
            assignmentStatus.success ? styles.successText : styles.errorText
          }
        >
          {assignmentStatus.message}
        </Text>
      )}

      {/* Conductors List */}
      <Text style={styles.sectionTitle}>
        Conductors ({filteredConductors.length})
      </Text>

      {paginatedConductors.length > 0 ? (
        paginatedConductors.map((conductor) => {
          // Find assigned bus details if any
          const assignedBus = conductor.assignedBusId ?
            allBuses.find(bus => bus._id === conductor.assignedBusId) : null;
          const isExpanded = expandedConductors[conductor._id];

          return (
            <TouchableOpacity
              key={conductor._id}
              style={[styles.conductorCard, !isExpanded && styles.conductorCardCompact]}
              onPress={() => toggleConductorExpanded(conductor._id)}
              activeOpacity={0.7}
            >
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => toggleConductorExpanded(conductor._id)}
              >
                <Icon
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#8E8E93"
                  style={styles.expandIcon}
                />
              </TouchableOpacity>

              <View style={styles.conductorHeader}>
                <Image
                  source={{
                    uri:
                      conductor.image ||
                      "https://th.bing.com/th/id/OIP.aKiTvd6drTIayNy2hddhiQHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain",
                  }}
                  style={styles.conductorImage}
                />
                <View style={styles.conductorInfo}>
                  <Text style={styles.conductorName}>{conductor.Username}</Text>
                  <Text style={styles.conductorPhone}>{conductor.phoneNumber}</Text>

                  {/* Show bus route in compact view */}
                  {!isExpanded && assignedBus && (
                    <View style={styles.busInfoRow}>
                      <Icon name="bus" size={14} color="#007AFF" />
                      <Text style={styles.busInfoText}>
                        {assignedBus.busRouteNo}
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.conductorStatus,
                    conductor.LoggedIn
                      ? styles.statusActive
                      : styles.statusInactive,
                  ]}
                >
                  {conductor.LoggedIn ? "Active" : "Inactive"}
                </Text>
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Icon name="calendar" size={16} color="#8E8E93" />
                    </View>
                    <Text style={styles.detailText}>
                      Age: {conductor.age || "Not specified"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Icon name="location" size={16} color="#8E8E93" />
                    </View>
                    <Text style={styles.detailText}>
                      Address: {conductor.address || "Not specified"}
                    </Text>
                  </View>

                  {/* Assigned Bus Information - Detailed */}
                  {assignedBus && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <Icon name="bus" size={16} color="#007AFF" />
                      </View>
                      <Text style={[styles.detailText, { color: '#007AFF', fontWeight: '500' }]}>
                        {assignedBus.busRouteNo} - {assignedBus.busNo}
                        {` (${assignedBus.fromStage} to ${assignedBus.toStage})`}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.assignButton}
                    onPress={(e) => {
                      e.stopPropagation(); // Prevent card expansion toggle
                      handleAssignConductor(conductor);
                    }}
                  >
                    <Text style={styles.assignButtonText}>
                      {conductor.assignedBusId ? "Reassign to Bus" : "Assign to Bus"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="people" size={50} color="#ccc" />
          <Text style={styles.emptyText}>
            No conductors found. Try adjusting your search or filters.
          </Text>
        </View>
      )}

      {/* Pagination Controls */}
      {filteredConductors.length > 0 && (
        <View style={styles.paginationContainer}>
          {/* Previous Page Button */}
          <TouchableOpacity
            style={[styles.pageArrow, currentPage === 1 && styles.disabledPageArrow]}
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Icon name="chevron-back" size={18} color="#8E8E93" />
          </TouchableOpacity>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, Math.ceil(filteredConductors.length / itemsPerPage)) }, (_, i) => {
            // Calculate page numbers to show
            const totalPages = Math.ceil(filteredConductors.length / itemsPerPage);
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + 4);

            if (endPage - startPage < 4) {
              startPage = Math.max(1, endPage - 4);
            }

            const pageNumber = startPage + i;
            if (pageNumber > totalPages) return null;

            return (
              <TouchableOpacity
                key={pageNumber}
                style={[styles.pageButton, currentPage === pageNumber && styles.activePageButton]}
                onPress={() => handlePageChange(pageNumber)}
              >
                <Text
                  style={[styles.pageButtonText, currentPage === pageNumber && styles.activePageButtonText]}
                >
                  {pageNumber}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Next Page Button */}
          <TouchableOpacity
            style={[styles.pageArrow, currentPage === Math.ceil(filteredConductors.length / itemsPerPage) && styles.disabledPageArrow]}
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredConductors.length / itemsPerPage)}
          >
            <Icon name="chevron-forward" size={18} color="#8E8E93" />
          </TouchableOpacity>

          {/* Page Info */}
          <Text style={styles.pageInfo}>
            {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredConductors.length)} of ${filteredConductors.length}`}
          </Text>

          {/* Items Per Page Selector */}
          <View style={styles.itemsPerPageContainer}>
            <Text style={styles.itemsPerPageText}>Show:</Text>
            <TouchableOpacity
              style={styles.itemsPerPageSelect}
              onPress={() => {
                // Toggle between 10, 20, 50 items per page
                const newItemsPerPage = itemsPerPage === 10 ? 20 : itemsPerPage === 20 ? 50 : 10;
                setItemsPerPage(newItemsPerPage);
                updatePagination(filteredConductors, 1); // Reset to first page
              }}
            >
              <Text style={styles.pageButtonText}>{itemsPerPage}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Assignment Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign to Bus</Text>

            {selectedConductor && (
              <Text style={styles.conductorName}>
                Conductor: {selectedConductor.Username}
              </Text>
            )}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedBus}
                onValueChange={handleBusSelection}
                mode="dropdown"
              >
                <Picker.Item label="Select a bus" value="" />
                {allBuses.map((bus) => (
                  <Picker.Item
                    key={bus._id}
                    label={`${bus.busRouteNo} - ${bus.busNo} (${bus.fromStage} to ${bus.toStage})`}
                    value={bus._id}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmAssignment}
                disabled={!selectedBus}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AssignConductors;
