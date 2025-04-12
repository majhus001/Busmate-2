import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../apiurl";
import styles from "./UserProfileStyles"; // Ensure this path is correct
import { useLanguage } from "../../../LanguageContext";
import Footer from "../Homescreen/Footer/Footer";

// Define translations for all text in the component
const translations = {
  English: {
    headerTitle: "Profile",
    fullName: "Full Name",
    email: "Email",
    password: "Password",
    age: "Age",
    city: "City",
    state: "State",
    loadingProfile: "Loading profile...",
    saveButton: "Save Changes",
    cancelButton: "Cancel",
    footerText: (date) => `Account created on ${date}`,
    permissionRequired: "Permission Required",
    permissionMessage: "Please allow access to your photo library to change profile picture.",
    error: "Error",
    errorLoading: "Failed to load profile data. Please try again.",
    errorImage: "Failed to pick image. Please try again.",
    errorNameEmpty: "Name field cannot be empty!",
    errorUpdate: "Failed to update profile. Please try again.",
    success: "Success",
    successMessage: "Profile updated successfully!",
    cancelTitle: "Cancel Editing",
    cancelMessage: "Are you sure you want to cancel? All changes will be lost.",
    cancelNo: "No",
    cancelYes: "Yes",
  },
  Tamil: {
    headerTitle: "சுயவிவரம்",
    fullName: "முழு பெயர்",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    age: "வயது",
    city: "நகரம்",
    state: "மாநிலம்",
    loadingProfile: "சுயவிவரத்தை ஏற்றுகிறது...",
    saveButton: "மாற்றங்களை சேமி",
    cancelButton: "ரத்து செய்",
    footerText: (date) => `கணக்கு உருவாக்கப்பட்டது: ${date}`,
    permissionRequired: "அனுமதி தேவை",
    permissionMessage: "சுயவிவர படத்தை மாற்ற உங்கள் புகைப்பட நூலகத்திற்கு அணுகலை அனுமதிக்கவும்.",
    error: "பிழை",
    errorLoading: "சுயவிவர தரவை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    errorImage: "படத்தை தேர்ந்தெடுக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    errorNameEmpty: "பெயர் புலம் காலியாக இருக்கக்கூடாது!",
    errorUpdate: "சுயவிவரத்தை புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    success: "வெற்றி",
    successMessage: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    cancelTitle: "திருத்தத்தை ரத்து செய்",
    cancelMessage: "ரத்து செய்ய விரும்புகிறீர்களா? அனைத்து மாற்றங்களும் இழக்கப்படும்.",
    cancelNo: "இல்லை",
    cancelYes: "ஆம்",
  },
  Hindi: {
    headerTitle: "प्रोफाइल",
    fullName: "पूरा नाम",
    email: "ईमेल",
    password: "पासवर्ड",
    age: "उम्र",
    city: "शहर",
    state: "राज्य",
    loadingProfile: "प्रोफाइल लोड हो रहा है...",
    saveButton: "परिवर्तन सहेजें",
    cancelButton: "रद्द करें",
    footerText: (date) => `खाता बनाया गया: ${date}`,
    permissionRequired: "अनुमति आवश्यक",
    permissionMessage: "प्रोफाइल चित्र बदलने के लिए अपनी फोटो लाइब्रेरी तक पहुंच की अनुमति दें।",
    error: "त्रुटि",
    errorLoading: "प्रोफाइल डेटा लोड करने में विफल। कृपया पुनः प्रयास करें।",
    errorImage: "छवि चुनने में विफल। कृपया पुनः प्रयास करें।",
    errorNameEmpty: "नाम क्षेत्र खाली नहीं हो सकता!",
    errorUpdate: "प्रोफाइल अपडेट करने में विफल। कृपया पुनः प्रयास करें।",
    success: "सफलता",
    successMessage: "प्रोफाइल सफलतापूर्वक अपडेट की गई!",
    cancelTitle: "संपादन रद्द करें",
    cancelMessage: "क्या आप रद्द करना चाहते हैं? सभी परिवर्तन खो जाएंगे।",
    cancelNo: "नहीं",
    cancelYes: "हाँ",
  },
};

const UserProfile = ({ navigation }) => {
  const { language, darkMode } = useLanguage(); // Use the language context with darkMode
  const t = translations[language] || translations.English;

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    city: "",
    state: "",
  });

  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchIdAndUser = async () => {
      try {
        let id = await SecureStore.getItemAsync("currentUserId");
        if (id) {
          id = id.trim();
          setUserId(id);
          fetchUserProfile(id);
        } else {
          console.warn("⚠️ No ID found in SecureStore");
        }
      } catch (error) {
        console.error("❌ Error fetching ID:", error);
      }
    };
    fetchIdAndUser();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const userId = await SecureStore.getItemAsync("currentUserId");
      if (!userId) {
        console.warn("⚠️ No User ID found in SecureStore");
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/userdata/admin/profile`, {
        userId: userId.trim(),
      });

      if (response.status === 200) {
        setUser({
          name: response.data.Username || "",
          email: response.data.email || "",
          password: response.data.password || "",
          age: response.data.age ? String(response.data.age) : "",
          city: response.data.city || "",
          state: response.data.state || "",
        });
        setProfileImage(response.data.image || "https://via.placeholder.com/150");
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      Alert.alert(t.error, t.errorLoading);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    if (!isEditing) return;

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(t.permissionRequired, t.permissionMessage);
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(t.error, t.errorImage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    Alert.alert(
      t.cancelTitle,
      t.cancelMessage,
      [
        { text: t.cancelNo, style: "cancel" },
        { 
          text: t.cancelYes, 
          onPress: () => {
            fetchUserProfile();
            setIsEditing(false);
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!user.name.trim()) {
      Alert.alert(t.error, t.errorNameEmpty);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("age", user.age);
      formData.append("city", user.city);
      formData.append("state", user.state);

      if (profileImage !== "https://via.placeholder.com/150") {
        const uriParts = profileImage.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("image", {
          uri: profileImage,
          name: `profile_${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/userdata/user/profileupdate/${userId.trim()}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        Alert.alert(t.success, t.successMessage);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(t.error, t.errorUpdate);
    } finally {
      setLoading(false);
    }
  };

  const renderFieldIcon = (fieldName) => {
    switch (fieldName) {
      case "name":
        return <Ionicons name="person-outline" size={20} color={darkMode ? "#4DA8FF" : "#5e72e4"} />;
      case "email":
        return <Ionicons name="mail-outline" size={20} color={darkMode ? "#4DA8FF" : "#5e72e4"} />;
      case "password":
        return <Ionicons name="lock-closed-outline" size={20} color={darkMode ? "#4DA8FF" : "#5e72e4"} />;
      case "age":
        return <Ionicons name="calendar-outline" size={20} color={darkMode ? "#4DA8FF" : "#5e72e4"} />;
      case "city":
        return <Ionicons name="location-outline" size={20} color={darkMode ? "#4DA8FF" : "#5e72e4"} />;
      case "state":
        return <MaterialIcons name="location-city" size={20} color={darkMode ? "#4DA8FF" : "#5e72e4"} />;
      default:
        return null;
    }
  };

  if (loading && !user.name) {
    return (
      <View style={[styles.loaderContainer, darkMode && styles.darkLoaderContainer]}>
        <ActivityIndicator size="large" color={darkMode ? "#4DA8FF" : "#5e72e4"} />
        <Text style={[styles.loaderText, darkMode && styles.darkLoaderText]}>
          {t.loadingProfile}
        </Text>
      </View>
    );
  }

  return (
    <>
    
    <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSafeArea]}>
      <StatusBar barStyle={darkMode ? "light-content" : "light-content"} backgroundColor={darkMode ? "#222" : "#00468b"} />
      <View style={[styles.header, darkMode && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, darkMode && styles.darkHeaderTitle]}>
          {t.headerTitle}
        </Text>
        {!isEditing ? (
          <TouchableOpacity style={styles.editIcon} onPress={handleEdit}>
            <Feather name="edit-2" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.editIcon} />
        )}
      </View>

      <ScrollView style={[styles.scrollView, darkMode && styles.darkScrollView]} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileImageSection, darkMode && styles.darkProfileImageSection]}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            {isEditing && (
              <TouchableOpacity style={[styles.changePhotoButton, darkMode && styles.darkChangePhotoButton]} onPress={pickImage}>
                <Feather name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.userName, darkMode && styles.darkUserName]}>{user.name}</Text>
          {user.city && user.state && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={darkMode ? "#AAAAAA" : "#8898aa"} />
              <Text style={[styles.locationText, darkMode && styles.darkLocationText]}>
                {user.city}, {user.state}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.formContainer, darkMode && styles.darkFormContainer]}>
          {Object.entries(user).map(([key, value]) => (
            <View key={key} style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                {renderFieldIcon(key)}
                <Text style={[styles.label, darkMode && styles.darkLabel]}>{t[key]}</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.disabledInput,
                  key === "email" && isEditing && styles.emailDisabled,
                  darkMode && styles.darkInput,
                  darkMode && !isEditing && styles.darkDisabledInput,
                  darkMode && key === "email" && isEditing && styles.darkEmailDisabled
                ]}
                value={value}
                onChangeText={(text) => handleChange(key, text)}
                editable={key !== "email" && isEditing}
                placeholder={t[key] ? `Enter your ${t[key].toLowerCase()}` : `Enter your ${key}`}
                placeholderTextColor={darkMode ? "#666" : "#a0aec0"}
                secureTextEntry={key === "password"}
                keyboardType={key === "age" ? "numeric" : "default"}
              />
            </View>
          ))}
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.saveButton, darkMode && styles.darkSaveButton]} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t.saveButton}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelButton, darkMode && styles.darkCancelButton]} onPress={handleCancel}>
              <Text style={[styles.cancelButtonText, darkMode && styles.darkCancelButtonText]}>{t.cancelButton}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.footer, darkMode && styles.darkFooter]}>
          <Text style={[styles.footerText, darkMode && styles.darkFooterText]}>
            {t.footerText(new Date().toLocaleDateString())}
          </Text>
        </View>
      </ScrollView>

      {loading && (
        <View style={[styles.loadingOverlay, darkMode && styles.darkLoadingOverlay]}>
          <ActivityIndicator size="large" color={darkMode ? "#4DA8FF" : "#5e72e4"} />
        </View>
      )}
    </SafeAreaView>
    <Footer navigation={navigation} />
    </>
  );
};

export default UserProfile;