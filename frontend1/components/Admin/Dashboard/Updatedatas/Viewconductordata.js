import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { API_BASE_URL } from "../../../../apiurl";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import styles from "./ViewConductorStyles";

const Viewconductordata = ({ navigation }) => {
  const [adminData, setAdminData] = useState(null);
  const [conductors, setConductors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedConductor, setExpandedConductor] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const conductorsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const storedData = await SecureStore.getItemAsync("currentUserData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAdminData(parsedData);
        const adminId = parsedData._id;
        const response = await axios.get(
          `${API_BASE_URL}/api/Admin/conductor/fetchconductor/${adminId}`
        );
        setConductors(response.data.data);
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
    setExpandedConductor(expandedConductor === id ? null : id);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * conductorsPerPage < filteredConductors.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredConductors = conductors.filter((conductor) =>
    conductor.Username.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    conductor.Username.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const paginatedConductors = filteredConductors.slice(
    currentPage * conductorsPerPage,
    (currentPage + 1) * conductorsPerPage
  );

  const totalPages = Math.ceil(filteredConductors.length / conductorsPerPage);

  return (
    <LinearGradient colors={["#fff", "#f5f7fa"]} style={styles.gradientContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Conductor Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddConductor")}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conductors..."
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
            <Text style={styles.statNumber}>{filteredConductors.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredConductors.filter(c => c.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredConductors.filter(c => !c.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Inactive</Text>
          </View>
        </View>

        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <>
            {/* Conductor List */}
            {paginatedConductors.length > 0 ? (
              paginatedConductors.map((conductor) => (
                <View key={conductor._id} style={styles.conductorCard}>
                  <TouchableOpacity
                    style={styles.conductorHeader}
                    activeOpacity={0.8}
                    onPress={() => toggleDropdown(conductor._id)}
                  >
                    <View style={styles.conductorAvatar}>
                      <Ionicons 
                        name="person" 
                        size={24} 
                        color={conductor.isActive ? "#007AFF" : "#888"} 
                      />
                    </View>
                    <View style={styles.conductorInfo}>
                      <Text style={styles.conductorName}>{conductor.Username}</Text>
                      <Text style={styles.conductorPhone}>{conductor.phoneNumber}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      conductor.isActive ? styles.activeBadge : styles.inactiveBadge
                    ]}>
                      <Text style={styles.statusText}>
                        {conductor.isActive ? "Active" : "Inactive"}
                      </Text>
                    </View>
                    <Ionicons
                      name={expandedConductor === conductor._id ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#007AFF"
                    />
                  </TouchableOpacity>

                  {/* Expanded Content */}
                  {expandedConductor === conductor._id && (
                    <View style={styles.expandedContent}>
                      <View style={styles.infoRow}>
                        <Ionicons name="transgender" size={20} color="#007AFF" />
                        <Text style={styles.infoText}>Gender: {conductor.gender || "Not specified"}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <MaterialIcons name="cake" size={20} color="#007AFF" />
                        <Text style={styles.infoText}>Age: {conductor.age || "Not provided"}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <MaterialIcons name="home" size={20} color="#007AFF" />
                        <Text style={styles.infoText}>Address: {conductor.address || "Not available"}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                          navigation.navigate("updateconductordata", {
                            conductorData: conductor,
                          })
                        }
                      >
                        <MaterialIcons name="edit" size={18} color="white" />
                        <Text style={styles.buttonText}>Edit Conductor</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="people" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No conductors found</Text>
                {searchQuery && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Text style={styles.clearSearchText}>Clear search</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Pagination */}
            {filteredConductors.length > conductorsPerPage && (
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

                <Text style={styles.pageIndicator}>
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
    </LinearGradient>
  );
};

export default Viewconductordata;