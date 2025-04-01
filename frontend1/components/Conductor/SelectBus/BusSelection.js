import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import styles from "./BusSelectionStyles"; // Import styles
import { API_BASE_URL } from "../../../apiurl";

const BusSelection = ({ navigation }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState(null);
  const [fromLocations, setFromLocations] = useState([]);
  const [toLocations, setToLocations] = useState([]);

  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);

  const [busNumbers, setBusNumbers] = useState([]);
  const [selectedBusNo, setSelectedBusNo] = useState(null);
  const [busplateNo, setBusplateNo] = useState("");

  const states = ["Maharashtra", "TamilNadu", "Karnataka"];

  // Fetch bus data based on state
  const fetchBusesByState = async (state) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Admin/buses/fetchstate`, {
        params: { state },
      });
      setBusData(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setBusData([]);
    }
    setLoading(false);
  };

  // Fetch From & To locations based on city
  const fetchStagesByCity = async (city) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Admin/buses/fetchcities`, {
        params: { city },
      });

      setFromLocations(response.data.fromStages || []);
      setToLocations(response.data.toStages || []);
    } catch (error) {
      console.error("Error fetching stages:", error);
      setFromLocations([]);
      setToLocations([]);
    }
    setLoading(false);
  };

  // Fetch Bus Numbers based on "From" and "To" locations
  const fetchBusNumbers = async (from, to) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Admin/buses/fetchbusno`, {
        params: { from, to },
      });

      setBusNumbers(response.data.busNumbers || []);
      setBusplateNo(""); // Reset bus plate number initially
    } catch (error) {
      console.error("Error fetching bus numbers:", error);
      setBusNumbers([]);
      setBusplateNo("");
    }
    setLoading(false);
  };

  // Update bus plate number when selected bus number changes
  useEffect(() => {
    if (selectedBusNo) {
      const foundBus = busData.find((bus) => bus.busRouteNo === selectedBusNo);
      setBusplateNo(foundBus ? foundBus.busNo : "");
    }
  }, [selectedBusNo, busData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚌 Select Your Bus</Text>

      {/* State Dropdown */}
      <Text style={styles.label}>State</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setSelectedState(value);
          setBusData([]);
          setSelectedCity(null);
          setSelectedFrom(null);
          setSelectedTo(null);
          setBusNumbers([]);
          fetchBusesByState(value);
        }}
        items={states.map((state, index) => ({ label: state, value: state, key: index.toString() }))}
        style={{ ...styles.picker }}
        placeholder={{ label: "Select State...", value: null }}
      />

      {loading && <ActivityIndicator size="large" color="blue" />}

      {/* City Dropdown */}
      {busData.length > 0 && (
        <>
          <Text style={styles.label}>City</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedCity(value);
              setSelectedFrom(null);
              setSelectedTo(null);
              setBusNumbers([]);
              fetchStagesByCity(value);
            }}
            items={[...new Set(busData.map((bus) => bus.city))].map((city, index) => ({
              label: city,
              value: city,
              key: index.toString(),
            }))}
            style={{ ...styles.picker }}
            placeholder={{ label: "Select City...", value: null }}
          />
        </>
      )}

      {/* From Dropdown */}
      {selectedCity && fromLocations.length > 0 && (
        <>
          <Text style={styles.label}>From</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedFrom(value);
              setSelectedTo(null);
              setBusNumbers([]);
            }}
            items={fromLocations.map((stage, index) => ({
              label: stage,
              value: stage,
              key: index.toString(),
            }))}
            style={{ ...styles.picker }}
            placeholder={{ label: "Select Departure Location...", value: null }}
          />
        </>
      )}

      {/* To Dropdown */}
      {selectedFrom && toLocations.length > 0 && (
        <>
          <Text style={styles.label}>To</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedTo(value);
              fetchBusNumbers(selectedFrom, value);
            }}
            items={toLocations.map((stage, index) => ({
              label: stage,
              value: stage,
              key: index.toString(),
            }))}
            style={{ ...styles.picker }}
            placeholder={{ label: "Select Destination...", value: null }}
          />
        </>
      )}

      {/* Bus Number Dropdown */}
      {selectedTo && busNumbers.length > 0 && (
        <>
          <Text style={styles.label}>Bus Number</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedBusNo(value)}
            items={busNumbers.map((bus, index) => ({
              label: `Bus No: ${bus}`,
              value: bus,
              key: index.toString(),
            }))}
            style={{ ...styles.picker }}
            placeholder={{ label: "Select Bus Number...", value: null }}
          />
        </>
      )}

      {/* Proceed Button */}
      {selectedBusNo && (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("buslogin", {
              busplateNo,
              selectedFrom,
              selectedTo,
              selectedBusNo,
              selectedCity,
              selectedState,
            })
          }
        >
          <Text style={styles.buttonText}>✅ Proceed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BusSelection;
