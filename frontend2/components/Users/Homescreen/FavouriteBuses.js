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
import { useNavigation } from "@react-navigation/native"; // ✅ Import Navigation Hook
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import styles from "./FavouriteBusesStyles";
import { API_BASE_URL } from "../../../apiurl";

const fetchId = async () => {
  try {
    const id = await SecureStore.getItemAsync("currentUserId");
    return id ? id : null;
  } catch (error) {
    console.error("❌ Error fetching ID:", error);
    return null;
  }
};

const FavouriteBuses = () => {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [busNumber, setBusNumber] = useState("");
  const [favoriteBuses, setFavoriteBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation(); // ✅ Navigation Hook

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
      Alert.alert("Error", "Failed to fetch bus data.");
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
            (bus.from && bus.from.toLowerCase().includes(text.toLowerCase())) || // ✅ Match "from" location
            (bus.to && bus.to.toLowerCase().includes(text.toLowerCase()))       // ✅ Match "to" location
          )
        : []
    );
  };
  

  const toggleFavorite = async (bus) => {
    if (!userId) {
      Alert.alert("Error", "User ID not found. Please try again.");
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
      Alert.alert("Error", "Could not update favorite status.");
    }
  };

  const isFavorite = (bus) => favoriteBuses.some((fav) => fav.busRouteNo === bus.busRouteNo);

  const goToDetails = (busRouteNo) => {
    const busDetails = buses.find((b) => b.busRouteNo === busRouteNo);

    if (!busDetails) {
        Alert.alert("Error", "Bus details not found.");
        return;
    }

    // Automatically set start and end locations
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Search Bus by Number</Text>

        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Bus Number"
            value={busNumber}
            onChangeText={handleSearch}
            placeholderTextColor="#9E9E9E"
          />
          {busNumber.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setBusNumber("")}>
              <Ionicons name="close-circle" size={20} color="#9E9E9E" />
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Loading buses...</Text>
          </View>
        ) : filteredBuses.length > 0 ? (
          <FlatList
            data={filteredBuses}
            keyExtractor={(item, index) => item._id || item.busRouteNo + index}
            renderItem={({ item }) => (
              <View style={styles.busCard}>
                <Text style={styles.busNumber}>{item.busRouteNo}</Text>
                <Text style={styles.busType}>{item.busType || "Regular"}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                  <Ionicons
                    name={isFavorite(item) ? "heart" : "heart-outline"}
                    size={24}
                    color={isFavorite(item) ? "red" : "#777"}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="bus-outline" size={60} color="#CCCCCC" />
            <Text style={styles.noResultsText}>No buses found</Text>
          </View>
        )}

        <Text style={styles.title}>Your Favorite Buses</Text>
        {favoriteBuses.length > 0 ? (
          <FlatList
            data={favoriteBuses}
            keyExtractor={(item, index) => item._id || item.busRouteNo + index}
            renderItem={({ item }) => (
              <View style={styles.busCard}>
                <Text style={styles.busNumber}>{item.busRouteNo}</Text>

                <View style={styles.actionsContainer}>
                  <TouchableOpacity onPress={() => toggleFavorite(item)}>
                    <Ionicons name="heart" size={24} color="red" />
                  </TouchableOpacity>

                  {/* ✅ View Details Button */}
                  <TouchableOpacity 
    style={styles.viewDetailsButton}
    onPress={() => {
        console.log("Full Item Object:", item); // Debugging
        console.log("Bus Number:", item.busRouteNo); // Correct key
        goToDetails(item.busRouteNo);
    }}
>
    <Text style={styles.detailsButtonText}>View Details</Text>
</TouchableOpacity>


                </View>
              </View>
            )}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="heart-outline" size={60} color="#CCCCCC" />
            <Text style={styles.noResultsText}>No favorite buses yet</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FavouriteBuses;
