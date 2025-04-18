import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import axios from "axios";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../apiurl";
import styles from "./LoginStyles";

const Login = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Conductor");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isUsernameActive, setIsUsernameActive] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    animateButton();

    if (!userName || !password) {
      Alert.alert("Error", "Please enter both username and password!");
      return;
    }

    setIsLoginLoading(true);

    try {
      const loginData = {
        Username: userName,
        password: password,
        role: role,
      };

      console.log("Login attempt with:", loginData);
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        loginData
      );

      const userData = response.data.user;
      await SecureStore.setItemAsync("currentUserData", JSON.stringify(userData));
      await SecureStore.setItemAsync("userId", userData._id);

      if (userData) {
        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () => {
              if (role === "Conductor") {
                navigation.navigate("conhomepage", { conData: userData });
              } else if (role === "Admin") {
                navigation.navigate("AdminHome");
              }
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      Alert.alert(
        "Login Failed",
        error.response?.data?.error || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "rgba(0,50,100,0.7)"]}
        style={styles.overlay}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="bus" size={40} color="#007BFF" />
            <Text style={styles.title}>Login</Text>
          </View>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color={isUsernameActive ? "#007BFF" : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                onBlur={() => setIsUsernameActive(false)}
                onFocus={() => setIsUsernameActive(true)}
                onChangeText={(text) => setUserName(text)}
                value={userName}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={isPasswordFocused ? "#007BFF" : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                onBlur={() => setIsPasswordFocused(false)}
                onFocus={() => setIsPasswordFocused(true)}
                onChangeText={(text) => setPassword(text)}
                value={password}
              />
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={isPasswordFocused ? "#007BFF" : "#999"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() =>
              Alert.alert(
                "Reset Password",
                "Please contact your administrator to reset your password."
              )
            }
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Text style={styles.roleText}>Select Role:</Text>
          <View style={styles.radioContainer}>
            {["Admin", "Conductor"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.radioButton,
                  role === item && styles.radioButtonSelected,
                ]}
                onPress={() => setRole(item)}
              >
                {role === item && <View style={styles.radioIndicator} />}
                <Text
                  style={[
                    styles.radioText,
                    role === item && styles.radioTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleLogin} disabled={isLoginLoading}>
            <LinearGradient
              colors={
                isLoginLoading ? ["#cccccc", "#aaaaaa"] : ["#007BFF", "#0056b3"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButton}
            >
              <Text style={styles.buttonText}>
                {isLoginLoading ? "Logging in..." : "Login"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate("signup")}
          >
            <Text style={styles.signupText}>Create New Account</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
