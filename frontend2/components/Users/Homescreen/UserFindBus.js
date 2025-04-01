import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import styles from "./UserFindBusStyles";
import { API_BASE_URL } from "../../../apiurl";

const UserFindBus = ({ route, navigation }) => {
  const { userData } = route.params || {};
  const defaultState = userData?.state || "TamilNadu"; // Ensure a default value
  const defaultCity = userData?.city || "Coimbatore";
console.log(defaultState)
  const [state, setState] = useState(defaultState);
  const [city, setCity] = useState(defaultCity);

  useEffect(() => {
    if (userData?.state) setState(userData.state);
    if (userData?.city) setCity(userData.city);
  }, [userData]);

  useEffect(() => {
    if (city) fetchBuses(city);
  }, [city]); // Fetch buses only when city changes

  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [allStages, setAllStages] = useState([]);

  // State & City Mapping
  const states = ["Maharashtra", "Karnataka", "TamilNadu", "Delhi"];
  const cities = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bangalore", "Mysore"],
    TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
    Delhi: ["New Delhi"],
  };

  // Fetch Buses API
  const fetchBuses = async (selectedCity) => {
    if (!selectedCity) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchBy/cities/${selectedCity}`
      );

      const data = response.data?.data || [];

      if (data.length > 0) {
        setBuses(data);
        setFilteredBuses(data);

        // Extract all unique stages from bus timings
        const allStagesSet = new Set();
        data.forEach((bus) => {
          Object.keys(bus.timings || {}).forEach((stage) =>
            allStagesSet.add(stage)
          );
        });

        setAllStages([...allStagesSet]);
      } else {
        resetData();
        Alert.alert("No buses found for this city.");
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      Alert.alert("Error", "Failed to fetch bus data.");
    }
  };

  // Fetch buses when the city changes
  useEffect(() => {
    if (city) fetchBuses(city);
  }, [city]);

  // Reset Bus Data
  const resetData = () => {
    setBuses([]);
    setFilteredBuses([]);
    setAllStages([]);
    setFromLocation("");
    setToLocation("");
  };

  // Bus Filtering Logic
  const filterBuses = () => {
    if (!fromLocation || !toLocation) {
      Alert.alert("Error", "Please select both From and To locations.");
      return;
    }

    const filtered = buses.filter((bus) => {
      if (!bus.LoggedIn) return false; // Ensure the bus is logged in

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
  };

  // Navigate to Bus Details Screen
  const navigateToBusDetails = (bus) => {
    if (!fromLocation || !toLocation) {
      Alert.alert("Error", "Please select both From and To locations.");
      return;
    }
    navigation.navigate("Busdetails", { bus, fromLocation, toLocation });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Buses</Text>

      {/* State Picker */}
      <Picker
        selectedValue={state}
        onValueChange={(value) => {
          setState(value);
          setCity(""); // Reset city when state changes
          resetData(); // Clear previous buses and locations
        }}
        style={styles.picker}
      >
        <Picker.Item label="Select State" value="" />
        {states.map((st) => (
          <Picker.Item key={st} label={st} value={st} />
        ))}
      </Picker>

      {/* City Picker */}
      <Picker
        selectedValue={city}
        onValueChange={(value) => {
          setCity(value);
        }}
        style={styles.picker}
        enabled={!!state}
      >
        <Picker.Item label="Select City" value="" />
        {cities[state]?.map((ct) => (
          <Picker.Item key={ct} label={ct} value={ct} />
        ))}
      </Picker>

      {/* From & To Location Pickers */}
      <Picker
        selectedValue={fromLocation}
        onValueChange={setFromLocation}
        style={styles.picker}
        enabled={allStages.length > 0}
      >
        <Picker.Item label="From Location" value="" />
        {allStages.map((stage) => (
          <Picker.Item key={stage} label={stage} value={stage} />
        ))}
      </Picker>

      <Picker
        selectedValue={toLocation}
        onValueChange={setToLocation}
        style={styles.picker}
        enabled={allStages.length > 0}
      >
        <Picker.Item label="To Location" value="" />
        {allStages.map((stage) => (
          <Picker.Item key={stage} label={stage} value={stage} />
        ))}
      </Picker>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={filterBuses}>
        <Text style={styles.searchText}>Search Buses</Text>
      </TouchableOpacity>

      {/* Bus Listing */}
      {fromLocation && toLocation ? (
        <FlatList
          data={filteredBuses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const formattedTime = item.timings?.[fromLocation] || "N/A";
            return (
              <TouchableOpacity onPress={() => navigateToBusDetails(item)}>
                <View style={styles.busCard}>
                  <View style={styles.row}>
                    <Text style={styles.busIcon}>🚌</Text>
                    <Text style={styles.column}>{item.busRouteNo}</Text>
                    <Text style={styles.column}>{item.fromStage}</Text>
                    <Text style={styles.column}>{item.toStage}</Text>
                    <Text style={styles.column}>{formattedTime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Text style={styles.infoText}>
          Please select both From and To locations to view available buses.
        </Text>
      )}
    </View>
  );
};

export default UserFindBus;
