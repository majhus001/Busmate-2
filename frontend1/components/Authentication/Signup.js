import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView
} from "react-native";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_BASE_URL } from "../../apiurl";
import styles from "./SignupStyles";
import Icon from "react-native-vector-icons/FontAwesome5";

const Signup = ({ navigation }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [Username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const { width } = Dimensions.get("window");

 
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      city: "",
      state: "",
    },
  });
  
  const onSubmit = async (data) => {
    setIsSignupLoading(true);
    
    const userData = {
      username: data.username,
      email: data.email,
      password: data.password,
      role,
      city: data.city,
      state: data.state,
    };

    console.log("Signup Data:", userData);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/authSign/signup`, userData);
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => {
            if (role === "Admin") {
              navigation.navigate("AdminHome", { city: data.city, state: data.state });
            } else {
              navigation.navigate("ushomescreen", { city: data.city, state: data.state });
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Signup Error:", error.response ? error.response.data : error.message);
      Alert.alert("Error", error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setIsSignupLoading(false);
    }
  };

  const getInputIcon = (name) => {
    switch (name) {
      case 'username':
        return <Ionicons name="person-outline" size={20} color={activeInput === 'username' ? "#007BFF" : "#999"} />;
      case 'email':
        return <Ionicons name="mail-outline" size={20} color={activeInput === 'email' ? "#007BFF" : "#999"} />;
      case 'password':
        return <Ionicons name="lock-closed-outline" size={20} color={activeInput === 'password' ? "#007BFF" : "#999"} />;
      case 'city':
        return <Ionicons name="business-outline" size={20} color={activeInput === 'city' ? "#007BFF" : "#999"} />;
      case 'state':
        return <Ionicons name="location-outline" size={20} color={activeInput === 'state' ? "#007BFF" : "#999"} />;
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.container}>
    
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <Icon name="smile-wink" size={40} color="#fff" style={styles.icon} />
            <Text style={styles.welcome}>Hello There!</Text>
          </View>
          
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardContainer}
          >
            <Animated.View style={styles.card}>
              <View style={styles.logoContainer}>
                <MaterialCommunityIcons name="account-plus" size={40} color="#007BFF" />
                <Text style={styles.title}>Create Account</Text>
              </View>

              <ScrollView 
                style={styles.formScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContentContainer}
              >
                {/* Username Input */}
                <View style={styles.inputContainer}>
                  <View style={[
                    styles.inputWrapper,
                    activeInput === 'username' && styles.inputWrapperActive,
                    errors.username && styles.inputWrapperError
                  ]}>
                    {getInputIcon('username')}
                    <Controller
                      control={control}
                      name="username"
                      rules={{
                        required: "Username is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._-]+$/,
                          message: "Username can only contain letters, numbers, dots, or underscores",
                        },
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters long",
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.input}
                          placeholder="Username"
                          placeholderTextColor="#999"
                          onFocus={() => setActiveInput('username')}
                          onBlur={(e) => {
                            onBlur(e);
                            setActiveInput(null);
                          }}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                  </View>
                  {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <View style={[
                    styles.inputWrapper,
                    activeInput === 'email' && styles.inputWrapperActive,
                    errors.email && styles.inputWrapperError
                  ]}>
                    {getInputIcon('email')}
                    <Controller
                      control={control}
                      name="email"
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email address",
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.input}
                          placeholder="Email Address"
                          placeholderTextColor="#999"
                          keyboardType="email-address"
                          onFocus={() => setActiveInput('email')}
                          onBlur={(e) => {
                            onBlur(e);
                            setActiveInput(null);
                          }}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                  </View>
                  {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View style={[
                    styles.inputWrapper,
                    activeInput === 'password' && styles.inputWrapperActive,
                    errors.password && styles.inputWrapperError
                  ]}>
                    {getInputIcon('password')}
                    <Controller
                      control={control}
                      name="password"
                      rules={{
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        pattern: {
                          value: /^(?=.[a-z])(?=.[A-Z])(?=.*\d).+$/,
                          message: "Password must contain uppercase, lowercase, and number",
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.input}
                          placeholder="Password"
                          placeholderTextColor="#999"
                          secureTextEntry={!showPassword}
                          onFocus={() => {
                            setActiveInput('password');
                            setIsPasswordFocused(true);
                          }}
                          onBlur={(e) => {
                            onBlur(e);
                            setActiveInput(null);
                            setIsPasswordFocused(false);
                          }}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color={activeInput === 'password' ? "#007BFF" : "#999"}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                </View>

                <View style={styles.locationContainer}>
                  {/* City Input */}
                  <View style={[styles.inputContainer, styles.halfInput]}>
                    <View style={[
                      styles.inputWrapper,
                      activeInput === 'city' && styles.inputWrapperActive,
                      errors.city && styles.inputWrapperError
                    ]}>
                      {getInputIcon('city')}
                      <Controller
                        control={control}
                        name="city"
                        rules={{ required: "City is required" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            style={styles.input}
                            placeholder="City"
                            placeholderTextColor="#999"
                            onFocus={() => setActiveInput('city')}
                            onBlur={(e) => {
                              onBlur(e);
                              setActiveInput(null);
                            }}
                            onChangeText={onChange}
                            value={value}
                          />
                        )}
                      />
                    </View>
                    {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
                  </View>

                  {/* State Input */}
                  <View style={[styles.inputContainer, styles.halfInput]}>
                    <View style={[
                      styles.inputWrapper,
                      activeInput === 'state' && styles.inputWrapperActive,
                      errors.state && styles.inputWrapperError
                    ]}>
                      {getInputIcon('state')}
                      <Controller
                        control={control}
                        name="state"
                        rules={{ required: "State is required" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            style={styles.input}
                            placeholder="State"
                            placeholderTextColor="#999"
                            onFocus={() => setActiveInput('state')}
                            onBlur={(e) => {
                              onBlur(e);
                              setActiveInput(null);
                            }}
                            onChangeText={onChange}
                            value={value}
                          />
                        )}
                      />
                    </View>
                    {errors.state && <Text style={styles.errorText}>{errors.state.message}</Text>}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSignupLoading}
                >
                  <LinearGradient
                    colors={isSignupLoading ? ['#cccccc', '#aaaaaa'] : ['#007BFF', '#0056b3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.signupButton}
                  >
                    {isSignupLoading ? (
                      <View style={styles.loadingContainer}>
                        <Text style={styles.buttonText}>Loading...</Text>
                      </View>
                    ) : (
                      <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={() => navigation.navigate("login")}
                >
                  <Text style={styles.loginText}>Already have an account? Log In</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </>
  );
};

export default Signup;