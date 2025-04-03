import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import styles from "./UserFindBusStyles";
import { API_BASE_URL } from "../../../apiurl";

const UserFindBus = ({ navigation }) => {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [allStages, setAllStages] = useState([]);
  const [filteredFromStages, setFilteredFromStages] = useState([]);
  const [filteredToStages, setFilteredToStages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Fetch All Buses API
  const fetchBuses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/Admin/buses/fetchAllBuses`);
      const data = response.data || [];

      if (data.length > 0) {
        setBuses(data);

        // Extract all unique stages
        const allStagesSet = new Set();
        data.forEach((bus) => {
          Object.keys(bus.timings || {}).forEach((stage) =>
            allStagesSet.add(stage)
          );
        });

        setAllStages([...allStagesSet]);
      } else {
        Alert.alert("No buses available.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching buses:", error);
      Alert.alert("Error", "Failed to fetch bus data.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // Filter Suggestions based on User Input
  const handleFromSearch = (text) => {
    setFromLocation(text);
    setFilteredFromStages(
      text.length > 0
        ? allStages.filter((stage) => stage.toLowerCase().includes(text.toLowerCase()))
        : []
    );
  };

  const handleToSearch = (text) => {
    setToLocation(text);
    setFilteredToStages(
      text.length > 0
        ? allStages.filter((stage) => stage.toLowerCase().includes(text.toLowerCase()))
        : []
    );
  };

  // Swap locations
  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  // Filter Buses
  const filterBuses = () => {
    if (!fromLocation || !toLocation) {
      Alert.alert("Error", "Please enter both From and To locations.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const filtered = buses.filter((bus) => {
        if (!bus.LoggedIn) return false;

        const stages = Object.keys(bus.timings);
        const fromIndex = stages.indexOf(fromLocation);
        const toIndex = stages.indexOf(toLocation);

        const isIntermediateRoute =
          fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
        const isDirectRoute =
          bus.fromStage === fromLocation && bus.toStage === toLocation;

        return isDirectRoute || isIntermediateRoute;
      });

      if (filtered.length === 0) {
        Alert.alert("No buses available for the selected route.");
      }
      setFilteredBuses(filtered);
      setSearchPerformed(true);
      setIsLoading(false);
    }, 600); // Adding slight delay for better UX
  };

  const navigateToBusDetails = (bus) => {
    if (!fromLocation || !toLocation) {
      Alert.alert("Error", "Please enter both From and To locations.");
      return;
    }
    navigation.navigate("Busdetails", { bus, fromLocation, toLocation });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Track your bus</Text>

        <View style={styles.searchSection}>
          {/* Origin Location */}
          <View style={styles.locationContainer}>
            <View style={styles.markerIconContainer}>
              <View style={styles.originMarker}>
                <Ionicons name="location" size={20} color="#4CAF50" />
              </View>
            </View>
            
            <View style={styles.dotLine} />
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Your Location"
                value={fromLocation}
                onChangeText={handleFromSearch}
                placeholderTextColor="#9E9E9E"
              />
              {fromLocation.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setFromLocation("")}
                >
                  <Ionicons name="close-circle" size={20} color="#9E9E9E" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {filteredFromStages.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={filteredFromStages.slice(0, 4)}
                keyExtractor={(item) => `from-${item}`}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.suggestionItem} 
                    onPress={() => {
                      setFromLocation(item);
                      setFilteredFromStages([]);
                    }}
                  >
                    <Ionicons name="location-outline" size={16} color="#007bff" />
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Destination Location */}
          <View style={styles.locationContainer}>
            <View style={styles.markerIconContainer}>
              <View style={styles.destinationMarker}>
                <Ionicons name="navigate" size={20} color="#3F51B5" />
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Your Destination"
                value={toLocation}
                onChangeText={handleToSearch}
                placeholderTextColor="#9E9E9E"
              />
              {toLocation.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setToLocation("")}
                >
                  <Ionicons name="close-circle" size={20} color="#9E9E9E" />
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity onPress={swapLocations} style={styles.swapButton}>
              <MaterialIcons name="swap-vert" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>

          {filteredToStages.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={filteredToStages.slice(0, 4)}
                keyExtractor={(item) => `to-${item}`}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.suggestionItem} 
                    onPress={() => {
                      setToLocation(item);
                      setFilteredToStages([]);
                    }}
                  >
                    <Ionicons name="location-outline" size={16} color="#007bff" />
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Search Button */}
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={filterBuses}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.startText}>Search</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Finding available buses...</Text>
          </View>
        ) : searchPerformed ? (
          filteredBuses.length > 0 ? (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsHeader}>
                {filteredBuses.length} {filteredBuses.length === 1 ? 'bus' : 'buses'} found
              </Text>
              <FlatList
                data={filteredBuses}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                  const departureTime = item.timings?.[fromLocation] || "N/A";
                  const arrivalTime = item.timings?.[toLocation] || "N/A";
                  
                  return (
                    <TouchableOpacity 
                      style={styles.busCard}
                      onPress={() => navigateToBusDetails(item)}
                    >
                      <View style={styles.busCardHeader}>
                        <View style={styles.busNumberContainer}>
                          <Text style={styles.busNumber}>{item.busRouteNo}</Text>
                        </View>
                        <Text style={styles.busType}>{item.busType || "Regular"}</Text>
                      </View>
                      
                      <View style={styles.routeContainer}>
                        <View style={styles.routeInfo}>
                          <View style={styles.routePoint}>
                            <View style={styles.timeContainer}>
                              <Text style={styles.timeText}>{departureTime}</Text>
                            </View>
                            <Text style={styles.locationText}>{fromLocation}</Text>
                          </View>
                          
                          <View style={styles.routeLineContainer}>
                            <View style={styles.routeLine} />
                          </View>
                          
                          <View style={styles.routePoint}>
                            <View style={styles.timeContainer}>
                              <Text style={styles.timeText}>{arrivalTime}</Text>
                            </View>
                            <Text style={styles.locationText}>{toLocation}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.viewDetailsButton}
                        onPress={() => navigateToBusDetails(item)}
                      >
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <Ionicons name="chevron-forward" size={16} color="#007bff" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name="bus-outline" size={60} color="#CCCCCC" />
              <Text style={styles.noResultsText}>No buses available for this route</Text>
              <Text style={styles.tryAgainText}>Try a different route or time</Text>
            </View>
          )
        ) : (
          <View style={styles.initialStateContainer}>
            <Image 
              source={{ uri: "https://static.vecteezy.com/system/resources/previews/009/589/758/large_2x/location-location-pin-location-icon-transparent-free-png.png" }} 
            
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={styles.infoText}>
              Enter your location and destination to find available buses
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserFindBus;