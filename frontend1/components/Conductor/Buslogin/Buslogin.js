import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import styles from "./BusloginStyles";
import { API_BASE_URL } from "../../../apiurl";
import { startLocationSharing } from "../Homepage/locationService";

const Buslogin = ({ route, navigation }) => {
  const {
    busplateNo,
    selectedFrom,
    selectedTo,
    selectedBusNo,
    selectedCity,
    selectedState,
  } = route.params;

  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  // Animate components on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    console.log("Selected Bus Info on login:", { busplateNo, selectedBusNo });
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter the password");
      return;
    }

    setIsLoading(true);
    dismissKeyboard();

    try {
      console.log("Attempting login for bus:", busplateNo);
      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/buses/login`,
        {
          busplateNo,
          password,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Login Successful");

        // Start location sharing
        console.log("Starting location sharing for bus:", selectedBusNo);
        const cleanup = startLocationSharing(selectedBusNo, (location) => {
          console.log("📍 Location shared internally:", location);
        });

        if (!cleanup) {
          console.error(
            "❌ Failed to start location sharing for bus:",
            selectedBusNo
          );
          Alert.alert("Error", "Failed to start location sharing.");
          setIsLoading(false);
          return;
        }

        const BusData = response.data.busDetails;

        // Navigate to taketicket
        navigation.navigate("taketicket", {
          selectedFrom,
          selectedTo,
          selectedBusNo,
          busplateNo,
          selectedCity,
          selectedState,
          BusData,
        });
      } else {
        Alert.alert("Error", response.data.message || "Invalid Credentials");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Server error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bus Login</Text>
        </View>

        <Animated.View
          style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          {/* Title */}
          <Text style={styles.busIcon}>🚌</Text>
          <Text style={styles.title}>Bus Login</Text>

          {/* Bus Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <View style={styles.infoIcon}>
                <FontAwesome5 name="bus" size={18} color="#fff" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Bus Plate Number</Text>
                <Text style={styles.infoText}>{busplateNo}</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.infoIcon}>
                <FontAwesome5 name="route" size={18} color="#fff" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Bus Route Number</Text>
                <Text style={styles.infoText}>{selectedBusNo}</Text>
              </View>
            </View>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enter Bus Password</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={[styles.input, isPasswordFocused && styles.inputFocused]}
                  placeholder="Enter bus password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 15, top: 15 }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color={isPasswordFocused ? "#007AFF" : "#a0aec0"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#0A84FF', '#007AFF', '#0056B3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="lock-closed" size={18} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Login</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Having trouble logging in?</Text>
            <TouchableOpacity>
              <Text style={styles.helpLink}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Buslogin;
