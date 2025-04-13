import React, { useState } from "react";
import { 
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  Alert, ActivityIndicator, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import styles from "./AdRoutesStyles";
import { API_BASE_URL } from "../../../apiurl";
import Icon from 'react-native-vector-icons/MaterialIcons';

// Static data for Indian states and cities
const INDIA_STATES = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamilnadu",
  "Telangana",
  "Uttar Pradesh"
].sort((a, b) => a.localeCompare(b)); // Sorted alphabetically

const STATE_CITIES = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kakinada"].sort((a, b) => a.localeCompare(b)),
  "Delhi": ["New Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"].sort((a, b) => a.localeCompare(b)),
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"].sort((a, b) => a.localeCompare(b)),
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi"].sort((a, b) => a.localeCompare(b)),
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"].sort((a, b) => a.localeCompare(b)),
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"].sort((a, b) => a.localeCompare(b)),
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"].sort((a, b) => a.localeCompare(b)),
  "Tamilnadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"].sort((a, b) => a.localeCompare(b)),
  "Telangana": ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"].sort((a, b) => a.localeCompare(b)),
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj"].sort((a, b) => a.localeCompare(b))
};

const AdRoutes = () => {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [numStages, setNumStages] = useState("");
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [citiesList, setCitiesList] = useState([]);

  const handleStateChange = (value) => {
    setState(value);
    setCitiesList(STATE_CITIES[value] || []);
    setCity("");
  };

  const handleNumStagesChange = (value) => {
    setNumStages(value);
    setStages(Array.from({ length: Number(value) }, () => ""));
  };

  const handleStageChange = (index, value) => {
    const updatedStages = [...stages];
    updatedStages[index] = value;
    setStages(updatedStages);
  };

  const handleSave = async () => {
    if (!state || !city || !numStages || stages.includes("")) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const routeData = { state, city, numStages, stages };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/busroutes/add`, routeData);
      if (response.data.success) {
        Alert.alert("Success", "Route added successfully!");
        setState("");
        setCity("");
        setNumStages("");
        setStages([]);
      } else {
        Alert.alert("Error", response.data.message || "Failed to add route.");
      }
    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("Error", "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <LinearGradient
        colors={['#007AFF', '#0047AB']}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Add New Bus Route</Text>
      </LinearGradient>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* State Dropdown */}
          <View style={styles.inputCard}>
            <Text style={styles.label}>State</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={state}
                onValueChange={handleStateChange}
                style={styles.picker}
                dropdownIconColor="#007AFF"
              >
                <Picker.Item 
                  label="Select State" 
                  value="" 
                  style={styles.placeholderItem}
                />
                {INDIA_STATES.map((stateName) => (
                  <Picker.Item 
                    key={stateName} 
                    label={stateName} 
                    value={stateName} 
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* City Dropdown */}
          {state && (
            <View style={styles.inputCard}>
              <Text style={styles.label}>City</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={city}
                  onValueChange={(value) => setCity(value)}
                  style={styles.picker}
                  dropdownIconColor="#007AFF"
                >
                  <Picker.Item 
                    label="Select City" 
                    value="" 
                    style={styles.placeholderItem}
                  />
                  {citiesList.map((cityName) => (
                    <Picker.Item 
                      key={cityName} 
                      label={cityName} 
                      value={cityName} 
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {/* Number of Stages */}
          <View style={styles.inputCard}>
            <Text style={styles.label}>Number of Stages</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number (e.g., 5)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={numStages}
              onChangeText={handleNumStagesChange}
            />
          </View>

          {/* Stage Inputs */}
          {stages.map((stage, index) => (
            <View style={styles.inputCard} key={index}>
              <Text style={styles.label}>Stage {index + 1}</Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter stage ${index + 1} name`}
                placeholderTextColor="#999"
                value={stage}
                onChangeText={(value) => handleStageChange(index, value)}
              />
            </View>
          ))}

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSave} 
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#007AFF', '#0047AB']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  <Icon name="save" size={18} color="#fff" /> Save Route
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AdRoutes;