import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "./AdbusesStyles";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { API_BASE_URL } from "../../../apiurl";
import axios from "axios";

const AdBuses = ({ navigation, route }) => {
  const { adminData } = route.params || {};
  const [activeTab, setActiveTab] = useState("route");
  const [busRouteNo, setBusRouteNo] = useState("");
  const [busNo, setBusNo] = useState("");
  const [busPassword, setBusPassword] = useState("");
  const [totalShifts, setTotalShifts] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [busType, setBusType] = useState("");
  const [state, setState] = useState("");
  const [states, setStates] = useState([]);
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [stages, setStages] = useState([]);
  const [prices, setPrices] = useState({});
  const [timings, setTimings] = useState({});
  const [fromStage, setFromStage] = useState("");
  const [toStage, setToStage] = useState("");
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState("");

  const busTypes = ["AC", "Non-AC"];

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesres = await axios.get(
          `${API_BASE_URL}/api/busroutes/getstates`
        );
        setStates(statesres.data.states);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  const handleStateChange = async (selectedState) => {
    setState(selectedState);
    setCity(""); // Reset city selection
    setCities([]); // Clear old cities
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/busroutes/getcities/${selectedState}`
      );
      if (response.data.success) {
        setCities(response.data.cities);
      } else {
        Alert.alert("No Cities Found", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      Alert.alert("Error", "Failed to load cities. Please try again.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleCityChange = async (selectedCity) => {
    setCity(selectedCity);
    setStages([]); // Reset stages
    setPrices({});
    setTimings({});
    setFromStage("");
    setToStage("");
    setLoading(true); // Show loading indicator

    try {
      console.log(state);
      const response = await axios.post(
        `${API_BASE_URL}/api/busroutes/getstages`,
        { selectedCity, state }
      );

      if (response.data.success) {
        setStages(response.data.stages); // ✅ Update stages dropdown
      } else {
        Alert.alert("No Stages Found", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching stages:", error);
      Alert.alert("Error", "Failed to load stages. Please try again.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handlePriceChange = (from, to, value) => {
    setPrices((prevPrices) => ({ ...prevPrices, [`${from}-${to}`]: value }));
  };

  const handleAddBus = async () => {
    const requiredFields = {
      "Bus Route No": busRouteNo,
      "Bus Number": busNo,
      "Bus Password": busPassword,
      "Total Shifts": totalShifts,
      "Total Seats": totalSeats,
      "Available Seats": availableSeats,
      "Bus Type": busType,
      State: state,
      City: city,
      "From Stage": fromStage,
      "To Stage": toStage,
    };

    // Check for empty fields
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    // Check if we have stages for pricing/schedule
    const hasStages = filteredStages().length > 0;

    if (missingFields.length > 0) {
      const errorMessage = `Please fill in the following fields:\n${missingFields.join(
        "\n"
      )}`;
      Alert.alert("Missing Information", errorMessage);
      return;
    }

    if (!hasStages) {
      Alert.alert("Route Error", "Please select valid From and To stages");
      return;
    }

    // Check if all timings are set
    const missingTimings = filteredStages()
      .filter((stage) => !timings[stage])
      .map((stage) => `Timing for ${stage}`);

    if (missingTimings.length > 0) {
      Alert.alert(
        "Missing Timings",
        `Please set timings for:\n${missingTimings.join("\n")}`
      );
      return;
    }

    // Check if all required prices are set
    const missingPrices = [];
    filteredStages().forEach((from, i) => {
      filteredStages()
        .slice(i + 1)
        .forEach((to) => {
          if (!prices[`${from}-${to}`]) {
            missingPrices.push(`Price from ${from} to ${to}`);
          }
        });
    });

    if (missingPrices.length > 0) {
      Alert.alert(
        "Missing Prices",
        `Please set prices for:\n${missingPrices.join("\n")}`
      );
      return;
    }

    const busData = {
      busRouteNo,
      busNo,
      busPassword,
      totalShifts,
      totalSeats,
      availableSeats,
      busType,
      state,
      city,
      fromStage,
      toStage,
      prices,
      timings,
      adminId: adminData._id,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/buses/add`,
        busData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Bus added successfully!");
        resetForm();
      } else {
        Alert.alert("Error", response.data.message || "Failed to add bus");
      }
    } catch (error) {
      console.error("Error adding bus:", error);
      Alert.alert(
        "Error",
        error.response?.data.message || error.message || "Failed to add bus"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBusRouteNo("");
    setBusNo("");
    setBusPassword("");
    setTotalShifts("");
    setTotalSeats("");
    setBusType("");
    setState("");
    setCity("");
    setPrices({});
    setTimings({});
    setFromStage("");
    setToStage("");
  };

  const showTimePicker = (stage) => {
    setCurrentStage(stage);
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleConfirmTime = (time) => {
    if (time && currentStage) {
      const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTimings((prevTimings) => ({
        ...prevTimings,
        [currentStage]: formattedTime,
      }));
      console.log(`Selected Time for ${currentStage}:`, formattedTime);
    }
    hideTimePicker();
  };

  const filteredStages = () => {
    if (!fromStage || !toStage) return [];
    const fromIndex = stages.indexOf(fromStage);
    const toIndex = stages.indexOf(toStage);
    if (fromIndex === -1 || toIndex === -1) return [];
    return fromIndex <= toIndex ? stages.slice(fromIndex, toIndex + 1) : [];
  };

  // Sort states alphabetically
  const sortedStates = [...states].sort((a, b) => a.localeCompare(b));

  // Sort cities alphabetically
  const sortedCities = [...cities].sort((a, b) => a.localeCompare(b));

  // Sort stages alphabetically
  const sortedStages = [...stages].sort((a, b) => a.localeCompare(b));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Bus</Text>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "route" && styles.activeTab]}
          onPress={() => setActiveTab("route")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "route" && styles.activeTabText,
            ]}
          >
            Route Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "basic" && styles.activeTab]}
          onPress={() => setActiveTab("basic")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "basic" && styles.activeTabText,
            ]}
          >
            Basic Info
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "schedule" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("schedule")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "schedule" && styles.activeTabText,
            ]}
          >
            Schedule
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bus Route No</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter route number"
                value={busRouteNo}
                onChangeText={setBusRouteNo}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bus Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter bus number"
                value={busNo}
                onChangeText={setBusNo}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bus Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Set password"
                value={busPassword}
                onChangeText={setBusPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bus Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={busType}
                  onValueChange={setBusType}
                  style={styles.picker}
                >
                  {busTypes.map((type, index) => (
                    <Picker.Item key={index} label={type} value={type} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Seats</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                placeholder="Set Total Seats"
                value={totalSeats}
                onChangeText={setTotalSeats}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Available seats</Text>
              <TextInput
                style={styles.input}
                placeholder=" Set Available seats"
                value={availableSeats}
                onChangeText={setAvailableSeats}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Shifts</Text>
              <TextInput
                style={styles.input}
                placeholder="Set Total Shifts"
                value={totalShifts}
                onChangeText={setTotalShifts}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {/* Route Details Tab */}
        {activeTab === "route" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Route Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>State</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={state}
                  onValueChange={handleStateChange}
                  style={styles.picker}
                >
                  {sortedStates.map((s, index) => (
                    <Picker.Item key={index} label={s} value={s} />
                  ))}
                </Picker>
              </View>
            </View>

            {state && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>City</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={city}
                    onValueChange={handleCityChange}
                    style={styles.picker}
                  >
                    {sortedCities.map((c, index) => (
                      <Picker.Item key={index} label={c} value={c} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {city && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>From Stage</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={fromStage}
                      onValueChange={setFromStage}
                      style={styles.picker}
                    >
                      {sortedStages.map((stage, index) => (
                        <Picker.Item key={index} label={stage} value={stage} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>To Stage</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={toStage}
                      onValueChange={setToStage}
                      style={styles.picker}
                    >
                      {sortedStages.map((stage, index) => (
                        <Picker.Item key={index} label={stage} value={stage} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Schedule & Pricing</Text>

            {filteredStages().length > 0 && (
              <>
                <Text style={styles.subtitle}>Set Timings</Text>
                {filteredStages().map((stage) => (
                  <View key={stage} style={styles.timeInputGroup}>
                    <Text style={styles.stageLabel}>{stage}</Text>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => showTimePicker(stage)}
                    >
                      <Text style={styles.timeButtonText}>
                        {timings[stage] || "Select Time"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <Text style={styles.subtitle}>Set Prices</Text>
                {filteredStages().map((from, i) =>
                  filteredStages()
                    .slice(i + 1)
                    .map((to) => (
                      <View
                        key={`${from}-${to}`}
                        style={styles.priceInputGroup}
                      >
                        <Text style={styles.routeLabel}>
                          {from} to {to}
                        </Text>
                        <TextInput
                          style={styles.priceInput}
                          placeholder="Enter price"
                          keyboardType="numeric"
                          value={prices[`${from}-${to}`] || ""}
                          onChangeText={(value) =>
                            handlePriceChange(from, to, value)
                          }
                        />
                      </View>
                    ))
                )}
              </>
            )}
          </View>
        )}

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={hideTimePicker}
        />

        {activeTab === "schedule" && (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddBus}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Add Bus</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};
export default AdBuses;
