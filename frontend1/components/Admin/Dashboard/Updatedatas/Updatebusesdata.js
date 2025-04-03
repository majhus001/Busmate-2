import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import { API_BASE_URL } from "../../../../apiurl";
import { Ionicons } from "@expo/vector-icons"; // For Icons
import styles from "./UpdateBusesDatastyles"; // Import styles

const Updatebusesdata = ({ navigation, route }) => {
  const { busData } = route.params || {};

  const [busDetails, setBusDetails] = useState({
    busNo: busData?.busNo || "",
    busRouteNo: busData?.busRouteNo || "",
    fromStage: busData?.fromStage || "",
    toStage: busData?.toStage || "",
    busType: busData?.busType || "AC",
    totalSeats: busData?.totalSeats?.toString() || "",
    totalShifts: busData?.totalShifts?.toString() || "",
    availableSeats: busData?.availableSeats?.toString() || "",
    state: busData?.state || "Tamil Nadu",
    city: busData?.city || "",
    busPassword: busData?.busPassword || "",
    loggedIn: busData?.LoggedIn || false,
    timings: busData?.timings || {},
    prices: busData?.prices || {},
  });

  const [states, setStates] = useState([]); // Store fetched states
  const [cities, setCities] = useState([]); // Store fetched cities
  const [selectedStage, setSelectedStage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/busroutes/getstates`
        );
        setStates(response.data.states); // Store states
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = (selectedState) => {
    updateField("state", selectedState);
    setCities([]); // Reset cities when state changes
    fetchCities(selectedState); // Fetch new cities for selected state
  };

  const fetchCities = async (selectedState) => {
    try {
      console.log("iiiiiii");
      const response = await axios.get(
        `${API_BASE_URL}/api/busroutes/getcities/${selectedState}`
      );
      setCities(response.data.cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const updateField = (key, value) => {
    setBusDetails((prev) => ({ ...prev, [key]: value }));
  };

  const showDatePicker = (stage) => {
    setSelectedStage(stage);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (selectedStage) {
      updateField("timings", {
        ...busDetails.timings,
        [selectedStage]: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
    hideDatePicker();
  };

  const handleDelete = async () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this bus?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(
              `${API_BASE_URL}/api/Admin/buses/deletebus/${busData._id}`
            );
            alert("Bus deleted successfully!");
            navigation.goBack();
          } catch (error) {
            alert("Failed to delete bus.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/Admin/buses/updatebus/${busData._id}`,
        {
          ...busDetails,
          totalSeats: Number(busDetails.totalSeats),
          totalShifts: Number(busDetails.totalShifts),
          availableSeats: Number(busDetails.availableSeats),
        }
      );
      alert("Bus details updated successfully!");
      navigation.goBack();
    } catch (error) {
      alert("Failed to update bus details.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🚌 Update Bus Details</Text>

      {/* Input Fields with Card UI */}
      <View style={styles.card}>
        {[
          { key: "busNo", label: "Bus Number" },
          { key: "busRouteNo", label: "Route Number" },
          { key: "busPassword", label: "Bus Password" },
          { key: "fromStage", label: "From Stage" },
          { key: "toStage", label: "To Stage" },
          { key: "totalSeats", label: "Total Seats", keyboardType: "numeric" },
          {
            key: "totalShifts",
            label: "Total Shifts",
            keyboardType: "numeric",
          },
          {
            key: "availableSeats",
            label: "Available Seats",
            keyboardType: "numeric",
          },
        ].map((item, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>{item.label}:</Text>
            <TextInput
              style={styles.input}
              value={busDetails[item.key]}
              onChangeText={(value) => updateField(item.key, value)}
              placeholder={item.label}
              keyboardType={item.keyboardType || "default"}
              secureTextEntry={item.secureTextEntry || false}
            />
          </View>
        ))}
      </View>

      {/* Bus Type Picker */}
      <View style={styles.card}>
        <Text style={styles.label}>Bus Type:</Text>
        <Picker
          selectedValue={busDetails.busType}
          style={styles.picker}
          onValueChange={(value) => updateField("busType", value)}
        >
          <Picker.Item label="AC" value="AC" />
          <Picker.Item label="Non-AC" value="Non-AC" />
        </Picker>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>State:</Text>
        <Picker
          selectedValue={busDetails.state}
          style={styles.picker}
          onValueChange={handleStateChange}
        >
          <Picker.Item label="Select State" value="" />
          {states.map((state, index) => (
            <Picker.Item key={index} label={state} value={state} />
          ))}
        </Picker>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>City:</Text>
        <Picker
          selectedValue={busDetails.city}
          style={styles.picker}
          onValueChange={(value) => updateField("city", value)}
          enabled={cities.length > 0} // Disable if no cities available
        >
          <Picker.Item label="Select City" value="" />
          {cities.map((city, index) => (
            <Picker.Item key={index} label={city} value={city} />
          ))}
        </Picker>
      </View>

      {/* Timings Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🕒 Update Timings</Text>
        {Object.entries(busDetails.timings).map(([stage, time], index) => (
          <View key={index} style={styles.timeContainer}>
            <Text style={styles.label}>{stage}:</Text>
            <TouchableOpacity
              onPress={() => showDatePicker(stage)}
              style={styles.timePickerButton}
            >
              <Ionicons name="time-outline" size={20} color="#007BFF" />
              <Text style={styles.timePickerText}>{time || "Select Time"}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* DateTime Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* Update & Delete Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleUpdate}>
          <Text style={styles.buttonPrimaryText}>Update Bus</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonDelete} onPress={handleDelete}>
          <Text style={styles.buttonDeleteText}>Delete Bus</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Updatebusesdata;
