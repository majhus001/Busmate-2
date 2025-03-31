import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "./UserHomeScreenStyles";
import axios from "axios";
import { API_BASE_URL } from "../../../apiurl";

const UserHomeScreen = ({ route, navigation }) => {
  const { userstate = "TamilNadu", usercity = "Coimbatore" } =
    route.params || {};

  const [state, setState] = useState(userstate);
  const [city, setCity] = useState(usercity);
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [fromStages, setFromStages] = useState([]);
  const [toStages, setToStages] = useState([]);
  const [expandedBus, setExpandedBus] = useState(null);
  const [seatAvailability, setSeatAvailability] = useState({});

  const states = ["Maharashtra", "Karnataka", "TamilNadu", "Delhi"];
  const cities = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bangalore", "Mysore"],
    TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
    Delhi: ["New Delhi"],
  };

  const fetchBuses = async (selectedCity) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchBy/cities`,
        {
          params: { city: selectedCity },
        }
      );
      const data = response.data.data;
      if (data.length > 0) {
        setBuses(data);
        setFilteredBuses(data);
        setFromStages([...new Set(data.map((bus) => bus.fromStage))]);
        setToStages([...new Set(data.map((bus) => bus.toStage))]);
      } else {
        setBuses([]);
        setFilteredBuses([]);
        setFromStages([]);
        setToStages([]);
        Alert.alert("No buses found for this city.");
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      Alert.alert("Error", "Failed to fetch bus data.");
    }
  };

  useEffect(() => {
    if (city) {
      fetchBuses(city);
    }
  }, [city]);

  const filterBuses = () => {
    setFilteredBuses(
      buses.filter(
        (bus) =>
          (!fromLocation || bus.fromStage === fromLocation) &&
          (!toLocation || bus.toStage === toLocation)
      )
    );
  };

  const toggleBusDetails = async (busNo) => {
    if (expandedBus === busNo) {
      setExpandedBus(null);
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/tickets/seatcount`,
        {
          params: { busNo },
        }
      );
      const bookedCount = response.data.totalBookedSeats;
      setSeatAvailability((prev) => ({ ...prev, [busNo]: bookedCount }));
      setExpandedBus(busNo);
    } catch (error) {
      console.error("Error fetching ticket count:", error);
      Alert.alert("Error", "Failed to fetch ticket data.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Buses</Text>
      <Picker
        selectedValue={state}
        onValueChange={(value) => {
          setState(value);
          setCity("");
        }}
        style={styles.picker}
      >
        <Picker.Item label="Select State" value="" />
        {states.map((st) => (
          <Picker.Item key={st} label={st} value={st} />
        ))}
      </Picker>
      <Picker
        selectedValue={city}
        onValueChange={(value) => setCity(value)}
        style={styles.picker}
        enabled={state !== ""}
      >
        <Picker.Item label="Select City" value="" />
        {state &&
          cities[state]?.map((ct) => (
            <Picker.Item key={ct} label={ct} value={ct} />
          ))}
      </Picker>
      <Picker
        selectedValue={fromLocation}
        onValueChange={(value) => setFromLocation(value)}
        style={styles.picker}
        enabled={fromStages.length > 0}
      >
        <Picker.Item label="From Location" value="" />
        {fromStages.map((stage) => (
          <Picker.Item key={stage} label={stage} value={stage} />
        ))}
      </Picker>
      <Picker
        selectedValue={toLocation}
        onValueChange={(value) => setToLocation(value)}
        style={styles.picker}
        enabled={toStages.length > 0}
      >
        <Picker.Item label="To Location" value="" />
        {toStages.map((stage) => (
          <Picker.Item key={stage} label={stage} value={stage} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.searchButton} onPress={filterBuses}>
        <Text style={styles.searchText}>Search Buses</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredBuses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          // Get timing from the selected fromLocation
          const formattedTime = fromLocation
            ? item.timings[fromLocation]
            : "N/A";
          const bookedSeats = seatAvailability[item.busRouteNo] || 0;
          const availableSeats = item.totalSeats - bookedSeats;

          return (
            <TouchableOpacity onPress={() => toggleBusDetails(item.busRouteNo)}>
              <View style={styles.busCard}>
                <View style={styles.row}>
                  <Text style={styles.column}>{item.busRouteNo}</Text>
                  <Text style={styles.column}>
                    {fromLocation || "Select From"}
                  </Text>
                  <Text style={styles.column}>{toLocation || "Select To"}</Text>
                  <Text style={styles.column}>{formattedTime}</Text>
                </View>
                {expandedBus === item.busRouteNo && (
                  <View style={styles.expandedDetails}>
                    <Text style={styles.detailText}>
                      Total Seats: {item.totalSeats}
                    </Text>
                    <Text style={styles.detailText}>
                      Booked Seats: {bookedSeats}
                    </Text>
                    <Text style={styles.detailText}>
                      Available Seats: {availableSeats}
                    </Text>
                    <Text style={styles.detailText}>Standings: 0</Text>
                    <TouchableOpacity
                      style={styles.trackButton}
                      onPress={() => navigation.navigate("usmap")}
                    >
                      <Text style={styles.trackButtonText}>Live Track Bus</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default UserHomeScreen;
