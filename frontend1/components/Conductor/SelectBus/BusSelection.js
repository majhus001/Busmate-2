import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../apiurl";
import styles, { pickerSelectStyles } from "./BusSelectionStyles";

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
  const [error, setError] = useState(null);

  // Reset all selections except state when state changes
  const resetSelections = (keepState = false) => {
    if (!keepState) setSelectedState(null);
    setSelectedCity(null);
    setFromLocations([]);
    setToLocations([]);
    setSelectedFrom(null);
    setSelectedTo(null);
    setBusNumbers([]);
    setBusplateNo("");
    setError(null);
  };

  // Fetch states only once when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchStates = async () => {
        if (states.length === 0) {
          setLoading(true);
          try {
            const response = await axios.get(
              `${API_BASE_URL}/api/busroutes/getstates`
            );
            if (response.data && response.data.states) {
              setStates(response.data.states);
            } else {
              setError("No states available");
            }
          } catch (err) {
            setError("Failed to fetch states");
            console.error("Error fetching states:", err);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchStates();
      return () => resetSelections(true); // Cleanup on unmount
    }, [states.length])
  );

  // Fetch buses by state
  const fetchBusesByState = useCallback(async (state) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchstate`,
        { params: { state } }
      );
      if (response.data && response.data.length > 0) {
        setBusData(response.data);
      } else {
        setError("No buses available for selected state");
        setBusData([]);
      }
    } catch (err) {
      setError("Failed to fetch buses");
      console.error("Error fetching buses:", err);
      setBusData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stages by city
  const fetchStagesByCity = useCallback(async (city) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchcities`,
        { params: { city } }
      );
      if (response.data) {
        setFromLocations(response.data.fromStages || []);
        setToLocations(response.data.toStages || []);
        if (!response.data.fromStages || !response.data.toStages) {
          setError("No stages available for selected city");
        }
      }
    } catch (err) {
      setError("Failed to fetch stages");
      console.error("Error fetching stages:", err);
      setFromLocations([]);
      setToLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch bus numbers
  const fetchBusNumbers = useCallback(async (from, to) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchbusno`,
        { params: { from, to } }
      );
      if (response.data && response.data.busNumbers) {
        setBusNumbers(response.data.busNumbers);
        if (response.data.busNumbers.length === 0) {
          setError("No buses available for selected route");
        }
      } else {
        setBusNumbers([]);
        setError("No bus data available");
      }
    } catch (err) {
      setError("Failed to fetch bus numbers");
      console.error("Error fetching bus numbers:", err);
      setBusNumbers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect hooks for data fetching
  useEffect(() => {
    if (selectedState) {
      fetchBusesByState(selectedState);
    }
  }, [selectedState, fetchBusesByState]);

  useEffect(() => {
    if (selectedCity) {
      fetchStagesByCity(selectedCity);
    }
  }, [selectedCity, fetchStagesByCity]);

  useEffect(() => {
    if (selectedFrom && selectedTo) {
      fetchBusNumbers(selectedFrom, selectedTo);
    }
  }, [selectedFrom, selectedTo, fetchBusNumbers]);

  // Update bus plate number
  useEffect(() => {
    if (selectedBusNo && busData.length > 0) {
      const foundBus = busData.find((bus) => bus.busRouteNo === selectedBusNo);
      setBusplateNo(foundBus ? foundBus.busNo : "");
    }
  }, [selectedBusNo, busData]);

  const handlebuslogin = () => {
    if (!busplateNo) {
      Alert.alert("Error", "Please select a valid bus");
      return;
    }

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
      {loading && (
      <View style={styles.fullscreenLoader}>
        <ActivityIndicator size="large" color="#3182CE" />
        <Text style={styles.loadingText}>Loading options...</Text>
      </View>
    )}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <MaterialIcons
            name="directions-bus"
            size={36}
            color="#3182CE"
            style={styles.icon}
          />
          <Text style={styles.title}>Select Your Bus</Text>
          <Text style={styles.subtitle}>Choose your route and bus number</Text>
        </View>

        

        {error && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={20} color="#E53E3E" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          {/* State Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <MaterialIcons
                name="location-on"
                size={16}
                color="#1E2761"
                style={styles.icon}
              />
              State
            </Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  resetSelections();
                  setSelectedState(value);
                }}
                items={states.map((state) => ({
                  label: state,
                  value: state,
                  key: state,
                }))}
                style={pickerSelectStyles}
                placeholder={{ label: "Select State...", value: null }}
                Icon={() => (
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color="#A0AEC0"
                  />
                )}
                value={selectedState}
              />
            </View>
          </View>

          {/* City Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <MaterialIcons
                name="location-city"
                size={16}
                color="#1E2761"
                style={styles.icon}
              />
              City
            </Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  setSelectedCity(value);
                  setSelectedFrom(null);
                  setSelectedTo(null);
                  setBusNumbers([]);
                  setBusplateNo("");
                }}
                items={[...new Set(busData.map((bus) => bus.city))]
                  .filter((city) => city)
                  .map((city) => ({
                    label: city,
                    value: city,
                    key: city,
                  }))}
                style={pickerSelectStyles}
                placeholder={{
                  label: selectedState
                    ? "Select City..."
                    : "Select state first",
                  value: null,
                }}
                disabled={!selectedState}
                Icon={() => (
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color="#A0AEC0"
                  />
                )}
                value={selectedCity}
              />
            </View>
          </View>

          {/* From Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <MaterialIcons
                name="trip-origin"
                size={16}
                color="#1E2761"
                style={styles.icon}
              />
              From
            </Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  setSelectedFrom(value);
                  setSelectedTo(null);
                  setBusNumbers([]);
                  setBusplateNo("");
                }}
                items={fromLocations.map((stage) => ({
                  label: stage,
                  value: stage,
                  key: stage,
                }))}
                style={pickerSelectStyles}
                placeholder={{
                  label: selectedCity
                    ? "Select Departure..."
                    : "Select city first",
                  value: null,
                }}
                disabled={!selectedCity}
                Icon={() => (
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color="#A0AEC0"
                  />
                )}
                value={selectedFrom}
              />
            </View>
          </View>

          {/* To Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <MaterialIcons
                name="location-pin"
                size={16}
                color="#1E2761"
                style={styles.icon}
              />
              To
            </Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={setSelectedTo}
                items={toLocations.map((stage) => ({
                  label: stage,
                  value: stage,
                  key: stage,
                }))}
                style={pickerSelectStyles}
                placeholder={{
                  label: selectedFrom
                    ? "Select Destination..."
                    : "Select departure first",
                  value: null,
                }}
                disabled={!selectedFrom}
                Icon={() => (
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color="#fff"
                  />
                )}
                value={selectedTo}
              />
            </View>
          </View>

          {/* Bus Number Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <MaterialIcons
                name="confirmation-number"
                size={16}
                color="#1E2761"
                style={styles.icon}
              />
              Bus Number
            </Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={setSelectedBusNo}
                items={busNumbers.map((bus) => ({
                  label: `Bus No: ${bus}`,
                  value: bus,
                  key: bus,
                }))}
                style={pickerSelectStyles}
                placeholder={{
                  label: selectedTo
                    ? "Select Bus..."
                    : "Complete route selection first",
                  value: null,
                }}
                disabled={!selectedTo}
                Icon={() => (
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color="#A0AEC0"
                  />
                )}
                value={selectedBusNo}
              />
            </View>
          </View>

          {/* Bus Plate Number Display */}
          {busplateNo && (
            <View style={styles.plateContainer}>
              <MaterialIcons
                name="directions-bus"
                size={20}
                color="#1E2761"
                style={styles.icon}
              />
              <Text style={styles.plateLabel}>Bus Plate:</Text>
              <Text style={styles.plateNumber}>{busplateNo}</Text>
            </View>
          )}

          {/* Proceed Button */}
          {selectedBusNo && (
            <TouchableOpacity
              style={styles.button}
              onPress={handlebuslogin}
              activeOpacity={0.9}
            >
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>
                  <MaterialIcons name="arrow-forward" size={18} color="#3182CE" />
                  Proceed to Bus Login
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BusSelection;
