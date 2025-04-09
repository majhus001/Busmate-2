import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { API_BASE_URL } from "../../../../apiurl";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import styles from "./UpdateBusesDatastyles";

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

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/busroutes/getstates`
        );
        setStates(response.data.states);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = (selectedState) => {
    updateField("state", selectedState);
    setCities([]);
    fetchCities(selectedState);
  };

  const fetchCities = async (selectedState) => {
    try {
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
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to permanently delete this bus?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `${API_BASE_URL}/api/Admin/buses/deletebus/${busData._id}`
              );
              Alert.alert("Success", "Bus deleted successfully!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert("Error", "Failed to delete bus. Please try again.");
            }
          },
        },
      ]
    );
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
      Alert.alert("Success", "Bus details updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update bus details. Please try again.");
    }
  };

  const updatePrice = (stage, price) => {
    setBusDetails((prev) => ({
      ...prev,
      prices: {
        ...prev.prices,
        [stage]: price,
      },
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["#fff", "#2575fc"]}
        style={styles.gradientBackground}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#2575fc" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Update Bus Details</Text>
            <View style={{ width: 24 }} /> {/* Spacer for alignment */}
          </View>

          <View style={styles.busInfoCard}>
            <View style={styles.busNumberBadge}>
              <Text style={styles.busNumberText}>{busDetails.busNo}</Text>
            </View>
            <Text style={styles.routeText}>
              {busDetails.fromStage} → {busDetails.toStage}
            </Text>
            <View style={styles.busTypeBadge}>
              <Text style={styles.busTypeText}>{busDetails.busType}</Text>
            </View>
          </View>

          {/* Navigation Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "details" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("details")}
            >
              <MaterialIcons
                name="details"
                size={20}
                color={activeTab === "details" ? "#2575fc" : "#666"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "details" && styles.activeTabText,
                ]}
              >
                Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "timings" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("timings")}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={activeTab === "timings" ? "#2575fc" : "#666"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "timings" && styles.activeTabText,
                ]}
              >
                Timings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "pricing" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("pricing")}
            >
              <FontAwesome
                name="rupee"
                size={20}
                color={activeTab === "pricing" ? "#2575fc" : "#666"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "pricing" && styles.activeTabText,
                ]}
              >
                Pricing
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "details" && (
            <View style={styles.contentCard}>
              <Text style={styles.sectionHeader}>Basic Information</Text>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bus Number</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="bus"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      value={busDetails.busNo}
                      onChangeText={(value) => updateField("busNo", value)}
                      placeholder="Enter bus number"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Route Number</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons
                      name="route"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      value={busDetails.busRouteNo}
                      onChangeText={(value) => updateField("busRouteNo", value)}
                      placeholder="Enter route number"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>From Stage</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons
                      name="location-on"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      value={busDetails.fromStage}
                      onChangeText={(value) => updateField("fromStage", value)}
                      placeholder="Starting point"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>To Stage</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons
                      name="location-on"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      value={busDetails.toStage}
                      onChangeText={(value) => updateField("toStage", value)}
                      placeholder="Destination"
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.sectionHeader}>Capacity Information</Text>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Total Seats</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="people"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      value={busDetails.totalSeats}
                      onChangeText={(value) => updateField("totalSeats", value)}
                      placeholder="Total seats"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Available Seats</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      value={busDetails.availableSeats}
                      onChangeText={(value) =>
                        updateField("availableSeats", value)
                      }
                      placeholder="Available seats"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Total Shifts</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons
                      name="repeat"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      value={busDetails.totalShifts}
                      onChangeText={(value) =>
                        updateField("totalShifts", value)
                      }
                      placeholder="Number of shifts"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bus Type</Text>
                  <View
                    style={[styles.inputContainer, { paddingHorizontal: 0 }]}
                  >
                    <Picker
                      selectedValue={busDetails.busType}
                      style={styles.picker}
                      onValueChange={(value) => updateField("busType", value)}
                      dropdownIconColor="#666"
                    >
                      <Picker.Item label="AC" value="AC" />
                      <Picker.Item label="Non-AC" value="Non-AC" />
                    </Picker>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionHeader}>Location Information</Text>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>State</Text>
                  <View
                    style={[styles.inputContainer, { paddingHorizontal: 0 }]}
                  >
                    <Picker
                      selectedValue={busDetails.state}
                      style={styles.picker}
                      onValueChange={handleStateChange}
                      dropdownIconColor="#666"
                    >
                      {states.map((state, index) => (
                        <Picker.Item key={index} label={state} value={state} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>City</Text>
                  <View
                    style={[styles.inputContainer, { paddingHorizontal: 0 }]}
                  >
                    <Picker
                      selectedValue={busDetails.city}
                      style={styles.picker}
                      onValueChange={(value) => updateField("city", value)}
                      enabled={cities.length > 0}
                      dropdownIconColor="#666"
                    >
                      <Picker.Item label="Select City" value="" />
                      {cities.map((city, index) => (
                        <Picker.Item key={index} label={city} value={city} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bus Password</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="vpn-key"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.inputField}
                    value={busDetails.busPassword}
                    onChangeText={(value) => updateField("busPassword", value)}
                    placeholder="Set bus password"
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          )}

          {activeTab === "timings" && (
            <View style={styles.contentCard}>
              <Text style={styles.sectionHeader}>Bus Timings</Text>
              {Object.entries(busDetails.timings).map(
                ([stage, time], index) => (
                  <View key={index} style={styles.timingItem}>
                    <Text style={styles.timingStage}>{stage}</Text>
                    <TouchableOpacity
                      onPress={() => showDatePicker(stage)}
                      style={styles.timePickerButton}
                    >
                      <Ionicons name="time-outline" size={20} color="#2575fc" />
                      <Text style={styles.timeText}>{time || "Set Time"}</Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
            </View>
          )}

          {activeTab === "pricing" && (
            <View style={styles.contentCard}>
              <Text style={styles.sectionHeader}>Fare Prices</Text>
              {Object.entries(busDetails.prices).map(
                ([stage, price], index) => (
                  <View key={index} style={styles.priceItem}>
                    <Text style={styles.priceStage}>{stage}</Text>
                    <View style={styles.priceInputContainer}>
                      <Text style={styles.currencySymbol}>₹</Text>
                      <TextInput
                        style={styles.priceInput}
                        value={price.toString()}
                        onChangeText={(value) => updatePrice(stage, value)}
                        placeholder="0.00"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                )
              )}
            </View>
          )}

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
            >
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Update Bus</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <LinearGradient
                colors={["#ff758c", "#ff7eb3"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Delete Bus</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          headerTextIOS="Select Time"
          confirmTextIOS="Confirm"
          cancelTextIOS="Cancel"
          isDarkModeEnabled={false}
        />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Updatebusesdata;
