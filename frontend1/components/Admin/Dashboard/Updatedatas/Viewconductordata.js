import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { ActivityIndicator, Button } from "react-native-paper";
import { API_BASE_URL } from "../../../../apiurl";
import styles from "../../Homepage/AdminHomeStyles";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const Viewconductordata = ({ navigation }) => {
  const [adminData, setAdminData] = useState(null);
  const [conductors, setConductors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedConductor, setExpandedConductor] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const conductorsPerPage = 10;

  useFocusEffect(
    useCallback(() => {
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
        }
      };

      fetchData();
    }, [])
  );

  // Toggle expand for a conductor
  const toggleDropdown = (id) => {
    setExpandedConductor(expandedConductor === id ? null : id);
  };

  // Pagination functions
  const handleNextPage = () => {
    if ((currentPage + 1) * conductorsPerPage < conductors.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filter conductors based on search
  const filteredConductors = conductors.filter((conductor) =>
    conductor.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedConductors = filteredConductors.slice(
    currentPage * conductorsPerPage,
    (currentPage + 1) * conductorsPerPage
  );

  return (
    <ScrollView style={styles.Admincontainer}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Conductors by Name"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Available Conductors</Text>

          {/* Display Conductors */}
          {paginatedConductors.length > 0 ? (
            paginatedConductors.map((conductor) => (
              <View key={conductor._id} style={styles.busCard}>
                <TouchableOpacity
                  onPress={() => toggleDropdown(conductor._id)}
                  style={styles.busHeader}
                >
                  <Text style={styles.busText}>👤 {conductor.Username}</Text>
                  <Text style={styles.busText}>📞 {conductor.phoneNumber}</Text>
                  <Text
                    style={[
                      styles.status,
                      conductor.isActive ? styles.available : styles.onService,
                    ]}
                  >
                    {conductor.isActive ? "Active" : "Inactive"}
                  </Text>
                </TouchableOpacity>

                {/* Expandable Section */}
                {expandedConductor === conductor._id && (
                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownText}>
                      ⚧ Gender: {conductor.gender || "Not Specified"}
                    </Text>
                    <Text style={styles.dropdownText}>
                      📧 Email: {conductor.email || "Not Provided"}
                    </Text>
                    <Text style={styles.dropdownText}>
                      🏠 Address: {conductor.address || "Not Available"}
                    </Text>

                    <Button
                      onPress={() =>
                        navigation.navigate("updateconductordata", {
                          conductorData: conductor,
                        })
                      }
                      style={styles.editbtn_vbd}
                    >
                      Edit
                    </Button>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No Conductors Found</Text>
          )}

          {/* Pagination */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 0 && styles.disabledButton,
              ]}
              onPress={handlePrevPage}
              disabled={currentPage === 0}
            >
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                (currentPage + 1) * conductorsPerPage >=
                  filteredConductors.length && styles.disabledButton,
              ]}
              onPress={handleNextPage}
              disabled={
                (currentPage + 1) * conductorsPerPage >=
                filteredConductors.length
              }
            >
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Viewconductordata;
