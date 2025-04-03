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

      fetchData();
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
    <ScrollView style={styles.Admincontainer}>
      {/* Header Section */}
      <TouchableOpacity
        onPress={() => navigation.navigate("addash", { buses, conductors })}
      >
        <View style={styles.leftSection}>
          <Image
            source={{
              uri:
                adminData.image ||
                "https://th.bing.com/th/id/OIP.aKiTvd6drTIayNy2hddhiQHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {adminData?.Username || "Admin"}
          </Text>
          <Text style={styles.profileRole}>Administrator</Text>

          <Text style={styles.profileDetail}>
            📍 {adminData?.city || "city"}, {adminData?.state || "state"}
          </Text>
          <View style={styles.busconinfo}>
            <Text style={styles.busconbtn}>Total buses : {buses.length}</Text>
            <Text style={styles.busconbtn}>
              Total conductors: {conductors.length}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("statuscomplient", {
            adminData,
            buses,
            conductors,
          })
        }
        style={styles.complaintIcon} // Apply styling
      >
        <Icon name="alert-circle-outline" size={28} color="red" />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddConductor", { adminData })}
        >
          <Text style={styles.addButtonText}>Add Conductor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("adroutes", { adminData })}
        >
          <Text style={styles.addButtonText}>Add Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddBuses", { adminData })}
        >
          <Text style={styles.addButtonText}>Add Bus</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle Buttons for Buses and Conductors */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedTab === "Buses" ? styles.activeTab : null,
          ]}
          onPress={() => setSelectedTab("Buses")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              selectedTab === "Buses" ? styles.activeTabText : null,
            ]}
          >
            Buses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedTab === "Conductors"
              ? styles.activeTab
              : styles.toggleButtonText,
          ]}
          onPress={() => setSelectedTab("Conductors")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              selectedTab === "Conductors"
                ? styles.activeTabText
                : styles.toggleButtonText,
            ]}
          >
            Conductors
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder={`Search ${
          selectedTab === "Buses"
            ? "by Bus Route, Place, plate no"
            : "Conductors by Name"
        }`}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      {/* Conditional Rendering */}

      {loading ? (
        // Show Loading Indicator
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : selectedTab === "Buses" ? (
        <>
          <Text style={styles.sectionTitle}>Available Buses</Text>
          <ScrollView>
            {paginatedBuses.length > 0 ? (
              paginatedBuses.map((item) => (
                <View key={item._id} style={styles.busCard}>
                  <TouchableOpacity
                    onPress={() => toggleDropdownbus(item._id)}
                    style={styles.busHeader}
                  >
                    <Text style={styles.busText}>
                      Route No: {item.busRouteNo}
                    </Text>
                    <Text style={styles.busText}>
                      From: {item.fromStage} ➡️ To: {item.toStage}
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

                      {/* Display Timings with Line Breaks */}
                      <Text style={styles.dropdownText}>Timings:</Text>
                      <View style={styles.bustimingcont}>
                        {item.timings ? (
                          Object.entries(item.timings).map(
                            ([stage, time], index) => (
                              <Text
                                key={index}
                                style={styles.dropdowntimingText}
                              >
                                {stage}: {time}
                              </Text>
                            )
                          )
                        ) : (
                          <Text style={styles.dropdownText}>N/A</Text>
                        )}
                      </View>

                      {/* Display Prices with Line Breaks */}
                      <Text style={styles.dropdownText}>Prices:</Text>
                      <View style={styles.bustimingcont}>
                        {item.prices ? (
                          Object.entries(item.prices).map(
                            ([route, price], index) => (
                              <Text
                                key={index}
                                style={styles.dropdowntimingText}
                              >
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
                onPress={handleBusPrevPage}
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
                onPress={handleBusNextPage}
                disabled={
                  (currentPage + 1) * busesPerPage >= filteredBuses.length
                }
              >
                <Text style={styles.paginationButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={styles.rightSection}>
          <Text style={styles.sectionTitle}>List of Conductors</Text>

          {paginatedConductors.length > 0 ? (
            paginatedConductors.map((conductor) => (
              <View key={conductor._id} style={styles.busCard}>
                <TouchableOpacity
                  onPress={() => toggleDropdowncon(conductor._id)}
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
                {conductor.expanded && (
                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownText}>
                      ⚧ Gender: {conductor.gender || "Not Specified"}
                    </Text>
                    <Text style={styles.dropdownText}>
                       Age: {conductor.age || "Not Provided"}
                    </Text>
                    <Text style={styles.dropdownText}>
                      🏠 Address: {conductor.address || "Not Available"}
                    </Text>

                  
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No Conductors Found</Text>
          )}
          <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 0 && styles.disabledButton,
                ]}
                onPress={handleConPrevPage}
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
                onPress={handleConNextPage}
                disabled={
                  (currentPage + 1) * busesPerPage >= filteredBuses.length
                }
              >
                <Text style={styles.paginationButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
        </View>
      )}
    </ScrollView>
  );
};

export default AdminHome;
