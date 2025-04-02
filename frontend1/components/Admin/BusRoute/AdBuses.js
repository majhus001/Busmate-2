import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import styles from "./AdbusesStyles";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { API_BASE_URL } from "../../../apiurl";
import axios from "axios";

const AdBuses = ({ navigation, route }) => {
  const { adminData } = route.params || {};
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [busRouteNo, setBusRouteNo] = useState("");
  const [busNo, setBusNo] = useState("");
  const [busPassword, setBusPassword] = useState("");
  const [totalShifts, setTotalShifts] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [busType, setBusType] = useState("");
  const [state, setState] = useState("");
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
  const states = ["Tamilnadu", "Kerala", "Karnataka"];

  const allStages = {
    Coimbatore: ["Ukkadam", "Kurichi", "Kinathukadavu", "Pollachi"],
    Chennai: ["Koyambedu", "T Nagar", "Guindy"],
    Madurai: ["Periyar", "Mattuthavani", "Thirunagar"],
    Kochi: ["Ernakulam", "Aluva", "Kalamassery"],
    Palakkad: ["Chandranagar", "Olavakode", "Vadakkanthara"],
    Bangalore: ["Majestic", "Silk Board", "Electronic City"],
    Mysore: ["City Bus Stand", "Chamundi Hill", "Vijayanagar"],
  };

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
        setCities(response.data.cities); // ✅ Update city dropdown
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
    if (
      !busRouteNo ||
      !busNo ||
      !busPassword ||
      !totalShifts ||
      !totalSeats ||
      !availableSeats ||
      !busType ||
      !state ||
      !city ||
      !fromStage ||
      !toStage ||
      filteredStages().length === 0
    ) {
      alert("Please fill all the fields correctly.");
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

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/buses/add`,
        busData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        alert("Bus added successfully!");
        resetForm();
      } else {
        alert("Failed to add bus: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding bus:", error);
      alert(
        "Error adding bus: " + (error.response?.data.message || error.message)
      );
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Bus Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Bus Route No"
        value={busRouteNo}
        onChangeText={setBusRouteNo}
        keyboardType="text"
      />
      <TextInput
        style={styles.input}
        placeholder="Bus No"
        value={busNo}
        onChangeText={setBusNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Bus Password"
        value={busPassword}
        onChangeText={setBusPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Total No of Shifts"
        value={totalShifts}
        onChangeText={setTotalShifts}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Total Seats"
        value={totalSeats}
        onChangeText={setTotalSeats}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Available Seats"
        value={availableSeats}
        onChangeText={setAvailableSeats}
        keyboardType="numeric"
      />

      <Picker
        selectedValue={busType}
        onValueChange={setBusType}
        style={styles.picker}
      >
        {busTypes.map((type, index) => (
          <Picker.Item key={index} label={type} value={type} />
        ))}
      </Picker>

      <Picker
        selectedValue={state}
        onValueChange={handleStateChange}
        style={styles.picker}
      >
        {states.map((s, index) => (
          <Picker.Item key={index} label={s} value={s} />
        ))}
      </Picker>

      {loading && <ActivityIndicator size="large" color="#007bff" />}

      {state && cities.length > 0 && (
        <Picker
          selectedValue={city}
          onValueChange={handleCityChange}
          style={styles.picker}
        >
          {cities.map((c, index) => (
            <Picker.Item key={index} label={c} value={c} />
          ))}
        </Picker>
      )}

      {city && (
        <View>
          <Text style={styles.subtitle}>Select Stages</Text>
          <Picker
            selectedValue={fromStage}
            onValueChange={setFromStage}
            style={styles.picker}
          >
            {stages.map((stage, index) => (
              <Picker.Item key={index} label={stage} value={stage} />
            ))}
          </Picker>
          <Picker
            selectedValue={toStage}
            onValueChange={setToStage}
            style={styles.picker}
          >
            {stages.map((stage, index) => (
              <Picker.Item key={index} label={stage} value={stage} />
            ))}
          </Picker>

          <Text style={styles.subtitle}>Set Timings for Selected Stages</Text>
          {filteredStages().map((stage) => (
            <View key={stage} style={styles.row}>
              <Text>{stage}:</Text>
              <TouchableOpacity onPress={() => showTimePicker(stage)}>
                <Text style={styles.timeText}>
                  {timings[stage] || "Select Time"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePicker}
          />

          <Text style={styles.subtitle}>Set Prices for Selected Stages</Text>
          {filteredStages().map((from, i) =>
            filteredStages()
              .slice(i + 1)
              .map((to) => (
                <View key={`${from}-${to}`} style={styles.row}>
                  <Text>
                    {from} to {to}:
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Price"
                    keyboardType="numeric"
                    value={prices[`${from}-${to}`] || ""}
                    onChangeText={(value) => handlePriceChange(from, to, value)}
                  />
                </View>
              ))
          )}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAddBus}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Bus</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdBuses;
