import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./BusSelectionStyles";
import { API_BASE_URL } from "../../../apiurl";

const BusSelection = ({ navigation }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [fromLocations, setFromLocations] = useState([]);
  const [toLocations, setToLocations] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [busNumbers, setBusNumbers] = useState([]);
  const [selectedBusNo, setSelectedBusNo] = useState(null);
  const [busplateNo, setBusplateNo] = useState("");

  // Fetch states only once when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (states.length === 0) {
        setLoading(true);
        axios
          .get(`${API_BASE_URL}/api/busroutes/getstates`)
          .then((response) => setStates(response.data.states || []))
          .catch((error) => console.error("Error fetching states:", error))
          .finally(() => setLoading(false));
      }
    }, [states.length])
  );

  // Fetch buses by state only when selectedState changes
  const fetchBusesByState = useCallback(async (state) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Admin/buses/fetchstate`, { params: { state } });
      setBusData(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setBusData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchBusesByState(selectedState);
    }
  }, [selectedState, fetchBusesByState]);

  // Fetch stages when city changes
  const fetchStagesByCity = useCallback(async (city) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Admin/buses/fetchcities`, { params: { city } });
      setFromLocations(response.data.fromStages || []);
      setToLocations(response.data.toStages || []);
    } catch (error) {
      console.error("Error fetching stages:", error);
      setFromLocations([]);
      setToLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchStagesByCity(selectedCity);
    }
  }, [selectedCity, fetchStagesByCity]);

  // Fetch bus numbers only when both From and To are selected
  const fetchBusNumbers = useCallback(async (from, to) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Admin/buses/fetchbusno`, { params: { from, to } });
      setBusNumbers(response.data.busNumbers || []);
      setBusplateNo("");
    } catch (error) {
      console.error("Error fetching bus numbers:", error);
      setBusNumbers([]);
      setBusplateNo("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedFrom && selectedTo) {
      fetchBusNumbers(selectedFrom, selectedTo);
    }
  }, [selectedFrom, selectedTo, fetchBusNumbers]);

  // Update bus plate number when bus number is selected
  useEffect(() => {
    if (selectedBusNo) {
      const foundBus = busData.find((bus) => bus.busRouteNo === selectedBusNo);
      setBusplateNo(foundBus ? foundBus.busNo : "");
    }
  }, [selectedBusNo, busData]);

  const handlebuslogin = () => {
    console.log("Selected Bus Info on navigating:", {
      busplateNo,
    });

    navigation.navigate("buslogin", {
      busplateNo,
      selectedFrom,
      selectedTo,
      selectedBusNo,
      selectedCity,
      selectedState,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚌 Select Your Bus</Text>

      {loading && <ActivityIndicator size="large" color="blue" />}

      {/* State Dropdown */}
      <Text style={styles.label}>State</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setSelectedState(value);
          setSelectedCity(null);
          setFromLocations([]);
          setToLocations([]);
          setSelectedFrom(null);
          setSelectedTo(null);
          setBusNumbers([]);
          setBusplateNo("");
        }}
        items={states.map((state, index) => ({
          label: state,
          value: state,
          key: index.toString(),
        }))}
        style={styles.picker}
        placeholder={{ label: "Select State...", value: null }}
      />

      {/* City Dropdown */}
      <Text style={styles.label}>City</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setSelectedCity(value);
          setSelectedFrom(null);
          setSelectedTo(null);
          setBusNumbers([]);
          setBusplateNo("");
        }}
        items={[...new Set(busData.map((bus) => bus.city))].map((city, index) => ({
          label: city,
          value: city,
          key: index.toString(),
        }))}
        style={styles.picker}
        placeholder={{ label: "Select City...", value: null }}
      />

      {/* From Location */}
      <Text style={styles.label}>From</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setSelectedFrom(value);
          setSelectedTo(null);
          setBusNumbers([]);
          setBusplateNo("");
        }}
        items={fromLocations.map((stage, index) => ({
          label: stage,
          value: stage,
          key: index.toString(),
        }))}
        style={styles.picker}
        placeholder={{ label: "Select Departure Location...", value: null }}
      />

      {/* To Location */}
      <Text style={styles.label}>To</Text>
      <RNPickerSelect
        onValueChange={setSelectedTo}
        items={toLocations.map((stage, index) => ({
          label: stage,
          value: stage,
          key: index.toString(),
        }))}
        style={styles.picker}
        placeholder={{ label: "Select Destination...", value: null }}
      />

      {/* Bus Number Dropdown */}
      <Text style={styles.label}>Bus Number</Text>
      <RNPickerSelect
        onValueChange={setSelectedBusNo}
        items={busNumbers.map((bus, index) => ({
          label: `Bus No: ${bus}`,
          value: bus,
          key: index.toString(),
        }))}
        style={styles.picker}
        placeholder={{ label: "Select Bus Number...", value: null }}
      />

      {/* Proceed Button */}
      {selectedBusNo && (
        <TouchableOpacity style={styles.button} onPress={handlebuslogin}>
          <Text style={styles.buttonText}>✅ Proceed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BusSelection;
