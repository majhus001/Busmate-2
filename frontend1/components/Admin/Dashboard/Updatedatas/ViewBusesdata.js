import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import axios from "axios";
import { Card, ActivityIndicator, Button } from "react-native-paper";
import { API_BASE_URL } from "../../../../apiurl";
import styles from "../../Homepage/AdminHomeStyles";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const ViewBusesdata = ({ navigation }) => {
  const [adminData, setAdminData] = useState(null);

  const [buses, setBuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTab, setSelectedTab] = useState("Buses");
  const busesPerPage = 5;

  if (!buses) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.loader} />
    );
  }

  const toggleDropdown = (id) => {
    setBuses((prevBuses) =>
      prevBuses.map((bus) =>
        bus._id === id ? { ...bus, expanded: !bus.expanded } : bus
      )
    );
  };

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
            const [busResponse] = await Promise.all([
              axios.get(`${API_BASE_URL}/api/Admin/buses/fetchbus/${adminId}`),
            ]);

            setBuses(
              busResponse.data.data.map((bus) => ({ ...bus, expanded: false }))
            );
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

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  const handleNextPage = () => {
    if ((currentPage + 1) * busesPerPage < buses.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
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

  return (
    <ScrollView style={styles.Admincontainer}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Bus Route, Place, Plate No"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Available Buses</Text>
          {paginatedBuses.length > 0 ? (
            paginatedBuses.map((item) => (
              <View key={item._id} style={styles.busCard}>
                <TouchableOpacity
                  onPress={() => toggleDropdown(item._id)}
                  style={styles.busHeader}
                >
                  <Text style={styles.busText}>
                    Route No: {item.busRouteNo}
                  </Text>
                  <Text style={styles.busText}>
                    From: {item.fromStage} ➡ To: {item.toStage}
                  </Text>
                  <Text
                    style={[
                      styles.status,
                      item.LoggedIn ? styles.available : styles.onService,
                    ]}
                  >
                    {item.LoggedIn ? "Active" : "Inactive"}
                  </Text>
                </TouchableOpacity>

                {/* Expandable Section */}
                {item.expanded && (
                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownText}>
                      Bus No: {item.busNo}
                    </Text>
                    <Text style={styles.dropdownText}>
                      Bus Type: {item.busType}
                    </Text>
                    <Text style={styles.dropdownText}>
                      Total Seats: {item.totalSeats}
                    </Text>
                    <Text style={styles.dropdownText}>
                      State: {item.state}, City: {item.city}
                    </Text>
                    <Text style={styles.dropdownText}>
                      Shifts: {item.totalShifts}
                    </Text>

                    {/* Timings Section */}
                    <Text style={styles.dropdownText}>Timings:</Text>
                    <View style={styles.bustimingcont}>
                      {item.timings ? (
                        Object.entries(item.timings).map(
                          ([stage, time], index) => (
                            <Text key={index} style={styles.dropdowntimingText}>
                              {stage}: {time}
                            </Text>
                          )
                        )
                      ) : (
                        <Text style={styles.dropdownText}>N/A</Text>
                      )}
                    </View>

                    {/* Prices Section */}
                    <Text style={styles.dropdownText}>Prices:</Text>
                    <View style={styles.bustimingcont}>
                      {item.prices ? (
                        Object.entries(item.prices).map(
                          ([route, price], index) => (
                            <Text key={index} style={styles.dropdowntimingText}>
                              {route}: ₹{price}
                            </Text>
                          )
                        )
                      ) : (
                        <Text style={styles.dropdownText}>N/A</Text>
                      )}
                    </View>

                    <Text style={styles.dropdownText}>
                      Bus Password: {item.busPassword || "Not Set"}
                    </Text>

                    <Button
                      onPress={() =>
                        navigation.navigate("updatebusesdata", {
                          busData: item,
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
            <Text style={styles.noDataText}>No Buses Found</Text>
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
                (currentPage + 1) * busesPerPage >= filteredBuses.length &&
                  styles.disabledButton,
              ]}
              onPress={handleNextPage}
              disabled={
                (currentPage + 1) * busesPerPage >= filteredBuses.length
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
export default ViewBusesdata;
