import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  Alert, ActivityIndicator, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import axios from "axios";
import styles from "./AdRoutesStyles"; // Import styles
import { API_BASE_URL } from "../../../apiurl"; // Your API URL

const AdRoutes = () => {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [numStages, setNumStages] = useState("");
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state

  // Handle number of stages change
  const handleNumStagesChange = (value) => {
    setNumStages(value);
    setStages(Array.from({ length: Number(value) }, () => "")); // Reset stages array
  };

  // Update a specific stage name
  const handleStageChange = (index, value) => {
    const updatedStages = [...stages];
    updatedStages[index] = value;
    setStages(updatedStages);
  };

  // Submit form data to backend
  const handleSave = async () => {
    if (!state || !city || !numStages || stages.includes("")) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true); // Start loader
    const routeData = { state, city, numStages, stages };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/busroutes/add`, routeData);
      if (response.data.success) {
        Alert.alert("Success", "Route added successfully!");
      } else {
        Alert.alert("Error", response.data.message || "Failed to add route.");
      }
    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("Error", "Server error. Please try again.");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>🚌 Add Bus Route</Text>

          <Text style={styles.label}>State</Text>
          <TextInput style={styles.input} placeholder="Enter State" value={state} onChangeText={setState} />

          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} placeholder="Enter City" value={city} onChangeText={setCity} />

          <Text style={styles.label}>Number of Stages</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Number of Stages"
            keyboardType="numeric"
            value={numStages}
            onChangeText={handleNumStagesChange}
          />

          {stages.map((stage, index) => (
            <View key={index}>
              <Text style={styles.label}>Stage {index + 1}</Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter Stage ${index + 1}`}
                value={stage}
                onChangeText={(value) => handleStageChange(index, value)}
              />
            </View>
          ))}

          <TouchableOpacity style={[styles.button, loading && styles.buttonLoading]} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>💾 Save Route</Text>}
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AdRoutes;
