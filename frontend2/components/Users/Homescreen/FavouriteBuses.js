import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import styles from "./FavouriteBusesStyles"; // Ensure this path is correct
import { API_BASE_URL } from "../../../apiurl";
import { useLanguage } from "../../../LanguageContext"; // Ensure this path is correct
import Footer from "./Footer/Footer";

// Define translations for all text in the component
const translations = {
  English: {
    searchTitle: "Search Bus by Number",
    favoritesTitle: "Your Favorite Buses",
    placeholder: "Enter Bus Number",
    loading: "Loading buses...",
    noBusesFound: "No buses found",
    noFavorites: "No favorite buses yet",
    viewDetails: "View Details",
    error: "Error",
    errorFetchBuses: "Failed to fetch bus data.",
    errorUserId: "User ID not found. Please try again.",
    errorUpdateFavorite: "Could not update favorite status.",
  },
  Tamil: {
    searchTitle: "பேருந்து எண்ணால் தேடு",
    favoritesTitle: "உங்கள் பிடித்த பேருந்துகள்",
    placeholder: "பேருந்து எண்ணை உள்ளிடவும்",
    loading: "பேருந்துகளை ஏற்றுகிறது...",
    noBusesFound: "பேருந்துகள் எதுவும் கிடைக்கவில்லை",
    noFavorites: "இதுவரை பிடித்த பேருந்துகள் இல்லை",
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    error: "பிழை",
    errorFetchBuses: "பேருந்து தரவைப் பெற முடியவில்லை.",
    errorUserId: "பயனர் ஐடி கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்.",
    errorUpdateFavorite: "பிடித்த நிலையை புதுப்பிக்க முடியவில்லை.",
  },
  Hindi: {
    searchTitle: "बस नंबर से खोजें",
    favoritesTitle: "आपकी पसंदीदा बसें",
    placeholder: "बस नंबर दर्ज करें",
    loading: "बसें लोड हो रही हैं...",
    noBusesFound: "कोई बस नहीं मिली",
    noFavorites: "अभी तक कोई पसंदीदा बस नहीं",
    viewDetails: "विवरण देखें",
    error: "त्रुटि",
    errorFetchBuses: "बस डेटा प्राप्त करने में विफल।",
    errorUserId: "उपयोगकर्ता आईडी नहीं मिली। कृपया पुनः प्रयास करें।",
    errorUpdateFavorite: "पसंदीदा स्थिति अपडेट नहीं कर सका।",
  },
};

const fetchId = async () => {
  try {
    const id = await SecureStore.getItemAsync("currentUserId");
    return id ? id : null;
  } catch (error) {
    console.error("❌ Error fetching ID:", error);
    return null;
  }
};

const FavouriteBuses = ({navigation}) => {
  const { language, darkMode } = useLanguage(); // Use the language context with darkMode
  const t = translations[language] || translations.English; // Fallback to English

  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [busNumber, setBusNumber] = useState("");
  const [favoriteBuses, setFavoriteBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await fetchId();
      if (id) {
        setUserId(id);
        fetchFavoriteBuses(id);
      }
    };

    getUserId();
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/Admin/buses/fetchAllBuses`);
      setBuses(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error fetching buses:", error);
      Alert.alert(t.error, t.errorFetchBuses);
      setIsLoading(false);
    }
  };

  const fetchFavoriteBuses = async (id) => {
    if (!id) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/favorites/${id}`);
      setFavoriteBuses(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching favorite buses:", error);
    }
  };

  const handleSearch = (text) => {
    setBusNumber(text.toLowerCase());
    setFilteredBuses(
      text.length > 0
        ? buses.filter((bus) =>
            bus.busRouteNo.toLowerCase().includes(text.toLowerCase()) ||
            (bus.from && bus.from.toLowerCase().includes(text.toLowerCase())) ||
            (bus.to && bus.to.toLowerCase().includes(text.toLowerCase()))
          )
        : []
    );
  };

  const toggleFavorite = async (bus) => {
    if (!userId) {
      Alert.alert(t.error, t.errorUserId);
      return;
    }

    const isFav = favoriteBuses.some((fav) => fav.busRouteNo === bus.busRouteNo);
    const url = isFav
      ? `${API_BASE_URL}/api/favorites/remove`
      : `${API_BASE_URL}/api/favorites/add`;

    try {
      const response = await axios.post(url, { userId, busRouteNo: bus.busRouteNo });
      console.log("✅ Favorite updated:", response.data);

      setFavoriteBuses((prevFavorites) =>
        isFav
          ? prevFavorites.filter((fav) => fav.busRouteNo !== bus.busRouteNo)
          : [...prevFavorites, bus]
      );
    } catch (error) {
      console.error("❌ Error updating favorite:", error.response?.data || error.message);
      Alert.alert(t.error, t.errorUpdateFavorite);
    }
  };

  const isFavorite = (bus) => favoriteBuses.some((fav) => fav.busRouteNo === bus.busRouteNo);

  const goToDetails = (busRouteNo) => {
    const busDetails = buses.find((b) => b.busRouteNo === busRouteNo);

    if (!busDetails) {
      Alert.alert(t.error, "Bus details not found.");
      return;
    }

    const fromLocation = busDetails.fromStage;
    const toLocation = busDetails.toStage;

    console.log("Navigating with:", busDetails);
    console.log("From:", fromLocation, "To:", toLocation);

    navigation.navigate("Busdetails", {
      bus: busDetails,
      fromLocation,
      toLocation,
    });
  };

  return (
    <>
    
    <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSafeArea]}>
      <View style={[styles.container, darkMode && styles.darkContainer]}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>{t.searchTitle}</Text>

        <View style={[styles.searchSection, darkMode && styles.darkSearchSection]}>
          <TextInput
            style={[styles.searchInput, darkMode && styles.darkSearchInput]}
            placeholder={t.placeholder}
            value={busNumber}
            onChangeText={handleSearch}
            placeholderTextColor={darkMode ? "#9E9E9E" : "#9E9E9E"}
          />
          {busNumber.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setBusNumber("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={darkMode ? "#CCCCCC" : "#9E9E9E"}
              />
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={[styles.loadingContainer, darkMode && styles.darkLoadingContainer]}>
            <ActivityIndicator size="large" color={darkMode ? "#4DA8FF" : "#007bff"} />
            <Text style={[styles.loadingText, darkMode && styles.darkLoadingText]}>
              {t.loading}
            </Text>
          </View>
        ) : filteredBuses.length > 0 ? (
          <FlatList
            data={filteredBuses}
            keyExtractor={(item, index) => item._id || item.busRouteNo + index}
            renderItem={({ item }) => (
              <View style={[styles.busCard, darkMode && styles.darkBusCard]}>
                <Text style={[styles.busNumber, darkMode && styles.darkBusNumber]}>
                  {item.busRouteNo}
                </Text>
                <Text style={[styles.busType, darkMode && styles.darkBusType]}>
                  {item.busType || "Regular"}
                </Text>
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                  <Ionicons
                    name={isFavorite(item) ? "heart" : "heart-outline"}
                    size={24}
                    color={isFavorite(item) ? "red" : darkMode ? "#AAAAAA" : "#777"}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={[styles.noResultsContainer, darkMode && styles.darkNoResultsContainer]}>
            <Ionicons name="bus-outline" size={60} color={darkMode ? "#666" : "#CCCCCC"} />
            <Text style={[styles.noResultsText, darkMode && styles.darkNoResultsText]}>
              {t.noBusesFound}
            </Text>
          </View>
        )}

        <Text style={[styles.title, darkMode && styles.darkTitle]}>{t.favoritesTitle}</Text>
        {favoriteBuses.length > 0 ? (
          <FlatList
            data={favoriteBuses}
            keyExtractor={(item, index) => item._id || item.busRouteNo + index}
            renderItem={({ item }) => (
              <View style={[styles.busCard, darkMode && styles.darkBusCard]}>
                <Text style={[styles.busNumber, darkMode && styles.darkBusNumber]}>
                  {item.busRouteNo}
                </Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity onPress={() => toggleFavorite(item)}>
                    <Ionicons name="heart" size={24} color="red" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.viewDetailsButton, darkMode && styles.darkViewDetailsButton]}
                    onPress={() => {
                      console.log("Full Item Object:", item);
                      console.log("Bus Number:", item.busRouteNo);
                      goToDetails(item.busRouteNo);
                    }}
                  >
                    <Text style={styles.detailsButtonText}>{t.viewDetails}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={[styles.noResultsContainer, darkMode && styles.darkNoResultsContainer]}>
            <Ionicons name="heart-outline" size={60} color={darkMode ? "#666" : "#CCCCCC"} />
            <Text style={[styles.noResultsText, darkMode && styles.darkNoResultsText]}>
              {t.noFavorites}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
    <Footer navigation={navigation}/>
    </>
  );
};

export default FavouriteBuses;