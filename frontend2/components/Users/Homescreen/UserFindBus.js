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
  ScrollView,
  RefreshControl,
  Image,
  ToastAndroid,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import styles from "./UserFindBusStyles"; // Ensure this file exists
import { API_BASE_URL } from "../../../apiurl"; // Ensure this file exists
import { useLanguage } from "../../../LanguageContext"; // Ensure this path is correct

// Define translations
const translations = {
  English: {
    title: "Track Your Bus",
    fromPlaceholder: "Your Location",
    toPlaceholder: "Your Destination",
    search: "Search",
    loading: "Finding available buses...",
    noBuses: "No buses available for this route",
    tryAgain: "Try a different route or time",
    initialInfo: "Enter your location and destination to find available buses",
    resultsHeader: (count) => `${count} ${count === 1 ? "bus" : "buses"} found`,
    viewDetails: "View Details",
    errorLocations: "Please enter both From and To locations.",
    errorFetch: "Failed to fetch bus data.",
    noBusesAvailable: "No buses available.",
    nextBus: "Next Bus",
    nextBusTomorrow: "First Bus Tomorrow",
    tomorrow: "Tomorrow",
    departsIn: "Departs in",
    minutes: "mins",
  },
  Tamil: {
    title: "உங்கள் பேருந்தை கண்காணிக்கவும்",
    fromPlaceholder: "உங்கள் இடம்",
    toPlaceholder: "உங்கள் சேருமிடம்",
    search: "தேடு",
    loading: "கிடைக்கும் பேருந்துகளைத் தேடுகிறது...",
    noBuses: "இந்த பாதையில் பேருந்துகள் இல்லை",
    tryAgain: "வேறு பாதையை அல்லது நேரத்தை முயற்சிக்கவும்",
    initialInfo:
      "கிடைக்கும் பேருந்துகளைக் கண்டறிய உங்கள் இடத்தையும் சேருமிடத்தையும் உள்ளிடவும்",
    resultsHeader: (count) =>
      `${count} ${count === 1 ? "பேருந்து" : "பேருந்துகள்"} கிடைத்தன`,
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    errorLocations:
      "தயவுசெய்து 'இருந்து' மற்றும் 'செல்லும்' இடங்களை உள்ளிடவும்.",
    errorFetch: "பேருந்து தரவைப் பெற முடியவில்லை.",
    noBusesAvailable: "பேருந்துகள் எதுவும் இல்லை.",
    nextBus: "அடுத்த பஸ்",
    nextBusTomorrow: "நாளைய முதல் பஸ்",
    tomorrow: "நாளை",
    departsIn: "புறப்படும்",
    minutes: "நிமிடங்களில்",
  },
  Hindi: {
    title: "अपनी बस को ट्रैक करें",
    fromPlaceholder: "आपका स्थान",
    toPlaceholder: "आपका गंतव्य",
    search: "खोजें",
    loading: "उपलब्ध बसें ढूंढ रहा है...",
    noBuses: "इस मार्ग के लिए कोई बस उपलब्ध नहीं है",
    tryAgain: "एक अलग मार्ग या समय आज़माएं",
    initialInfo: "उपलब्ध बसों को खोजने के लिए अपना स्थान और गंतव्य दर्ज करें",
    resultsHeader: (count) => `${count} ${count === 1 ? "बस" : "बसें"} मिलीं`,
    viewDetails: "विवरण देखें",
    errorLocations: "कृपया 'से' और 'तक' दोनों स्थान दर्ज करें।",
    errorFetch: "बस डेटा प्राप्त करने में विफल।",
    noBusesAvailable: "कोई बस उपलब्ध नहीं है।",
    nextBus: "अगली बस",
    nextBusTomorrow: "कल की पहली बस",
    tomorrow: "कल",
    departsIn: "प्रस्थान में",
    minutes: "मिनट",
  },
};

const UserFindBus = ({ navigation }) => {
  const { language, darkMode } = useLanguage();
  const t = translations[language] || translations.English;

  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [allStages, setAllStages] = useState([]);
  const [filteredFromStages, setFilteredFromStages] = useState([]);
  const [filteredToStages, setFilteredToStages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [visibleBuses, setVisibleBuses] = useState(2);

  const loadMoreBuses = () => {
    setVisibleBuses((prev) => prev + 2);
  };

  // Fetch All Buses API
  const fetchBuses = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchAllBuses`
      );
      const data = response.data || [];

      if (data.length > 0) {
        setBuses(data);
        const allStagesSet = new Set();
        data.forEach((bus) => {
          Object.keys(bus.timings || {}).forEach((stage) =>
            allStagesSet.add(stage)
          );
        });
        setAllStages([...allStagesSet]);

        if (searchPerformed) {
          filterBuses();
        }
      } else {
        Alert.alert(t.noBusesAvailable);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      Alert.alert("Error", t.errorFetch);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      if (isManualRefresh) {
        ToastAndroid.show("Buses refreshed", ToastAndroid.LONG);
      }
    }
  };

  const onRefresh = () => {
    fetchBuses(true);
  };

  useEffect(() => {
    fetchBuses();
    if(!fromLocation || !toLocation){
      return;
    }
    const intervalId = setInterval(fetchBuses, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const filterBuses = () => {
    if (!fromLocation || !toLocation) {
      return;
    }

    setIsLoading(true);

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const filtered = buses
      .filter((bus) => {
        if (!bus.LoggedIn) return false;

        const stages = Object.keys(bus.timings || {});
        const fromIndex = stages.indexOf(fromLocation);
        const toIndex = stages.indexOf(toLocation);

        const isIntermediateRoute =
          fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
        const isDirectRoute =
          bus.fromStage === fromLocation && bus.toStage === toLocation;

        return isDirectRoute || isIntermediateRoute;
      })
      .map((bus) => {
        const departureTimeStr = bus.timings?.[fromLocation] || "12:00 am";

        // Accepts both "3:00pm" and "3:00 pm"
        const match = departureTimeStr.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);

        if (!match) {
          console.warn("Invalid time format:", departureTimeStr);
          return null; // skip if time format is invalid
        }

        let [, hrStr, minStr, period] = match;
        let hours = Number(hrStr);
        let minutes = Number(minStr);

        if (period.toLowerCase() === "pm" && hours !== 12) {
          hours += 12;
        } else if (period.toLowerCase() === "am" && hours === 12) {
          hours = 0;
        }

        const departureMinutes = hours * 60 + minutes;
        const isToday = departureMinutes >= currentMinutes;
        const minutesUntilDeparture = isToday
          ? departureMinutes - currentMinutes
          : departureMinutes + 1440 - currentMinutes;

        return {
          ...bus,
          departureMinutes,
          isToday,
          minutesUntilDeparture,
          displayDepartureTime: departureTimeStr,
          sortKey: (isToday ? 0 : 1) * 100000 + departureMinutes,
        };
      })
      .filter(Boolean) // remove null values from map
      .sort((a, b) => a.sortKey - b.sortKey);

    setFilteredBuses(filtered);
    setSearchPerformed(true);

    if (filtered.length === 0) {
      Alert.alert(t.noBuses);
    }

    setIsLoading(false);
  };

  const handleFromSearch = (text) => {
    setFromLocation(text);
    setFilteredFromStages(
      text.length > 0
        ? allStages.filter((stage) =>
            stage.toLowerCase().includes(text.toLowerCase())
          )
        : []
    );
  };

  const handleToSearch = (text) => {
    setToLocation(text);
    setFilteredToStages(
      text.length > 0
        ? allStages.filter((stage) =>
            stage.toLowerCase().includes(text.toLowerCase())
          )
        : []
    );
  };

  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const handleSearch = () => {
    if (!fromLocation || !toLocation) {
      Alert.alert("Error", t.errorLocations);
      return;
    }
    setSearchPerformed(true);
    filterBuses();
  };

  const navigateToBusDetails = (bus) => {
    if (!fromLocation || !toLocation) {
      Alert.alert("Error", t.errorLocations);
      return;
    }
    navigation.navigate("Busdetails", { bus, fromLocation, toLocation });
  };

  return (
    <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSafeArea]}>
      <View style={[styles.container, darkMode && styles.darkContainer]}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>
          {t.title}
        </Text>

        {/* Search Section */}
        <View
          style={[styles.searchSection, darkMode && styles.darkSearchSection]}
        >
          {/* Origin Location */}
          <View style={styles.locationContainer}>
            <View style={styles.markerIconContainer}>
              <View style={styles.originMarker}>
                <Ionicons name="location" size={20} color="#4CAF50" />
              </View>
            </View>

            <View style={[styles.dotLine, darkMode && styles.darkDotLine]} />

            <View
              style={[styles.inputWrapper, darkMode && styles.darkInputWrapper]}
            >
              <TextInput
                style={[styles.searchInput, darkMode && styles.darkSearchInput]}
                placeholder={t.fromPlaceholder}
                value={fromLocation}
                onChangeText={handleFromSearch}
                placeholderTextColor={darkMode ? "#9E9E9E" : "#9E9E9E"}
              />
              {fromLocation.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setFromLocation("")}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={darkMode ? "#CCCCCC" : "#9E9E9E"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {filteredFromStages.length > 0 && (
            <View
              style={[
                styles.suggestionsContainer,
                darkMode && styles.darkSuggestionsContainer,
              ]}
            >
              <FlatList
                data={filteredFromStages.slice(0, 4)}
                keyExtractor={(item) => `from-${item}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.suggestionItem,
                      darkMode && styles.darkSuggestionItem,
                    ]}
                    onPress={() => {
                      setFromLocation(item);
                      setFilteredFromStages([]);
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#007bff"
                    />
                    <Text
                      style={[
                        styles.suggestionText,
                        darkMode && styles.darkSuggestionText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Destination Location */}
          <View style={styles.locationContainer}>
            <View style={styles.markerIconContainer}>
              <View style={styles.destinationMarker}>
                <Ionicons name="navigate" size={20} color="#3F51B5" />
              </View>
            </View>

            <View
              style={[styles.inputWrapper, darkMode && styles.darkInputWrapper]}
            >
              <TextInput
                style={[styles.searchInput, darkMode && styles.darkSearchInput]}
                placeholder={t.toPlaceholder}
                value={toLocation}
                onChangeText={handleToSearch}
                placeholderTextColor={darkMode ? "#9E9E9E" : "#9E9E9E"}
              />
              {toLocation.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setToLocation("")}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={darkMode ? "#CCCCCC" : "#9E9E9E"}
                  />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={swapLocations}
              style={[styles.swapButton, darkMode && styles.darkSwapButton]}
            >
              <MaterialIcons name="swap-vert" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>

          {filteredToStages.length > 0 && (
            <View
              style={[
                styles.suggestionsContainer,
                darkMode && styles.darkSuggestionsContainer,
              ]}
            >
              <FlatList
                data={filteredToStages.slice(0, 4)}
                keyExtractor={(item) => `to-${item}`}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#007AFF"]}
                  />
                }
                contentContainerStyle={styles.scrollContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.suggestionItem,
                      darkMode && styles.darkSuggestionItem,
                    ]}
                    onPress={() => {
                      setToLocation(item);
                      setFilteredToStages([]);
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#007bff"
                    />
                    <Text
                      style={[
                        styles.suggestionText,
                        darkMode && styles.darkSuggestionText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Search Button */}
          <TouchableOpacity
            style={[styles.startButton, darkMode && styles.darkStartButton]}
            onPress={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.startText}>{t.search}</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {isLoading ? (
          <View
            style={[
              styles.loadingContainer,
              darkMode && styles.darkLoadingContainer,
            ]}
          >
            <ActivityIndicator
              size="large"
              color={darkMode ? "#4DA8FF" : "#007bff"}
            />
            <Text
              style={[styles.loadingText, darkMode && styles.darkLoadingText]}
            >
              {t.loading}
            </Text>
          </View>
        ) : searchPerformed ? (
          filteredBuses.length > 0 ? (
            <View
              style={[
                styles.resultsContainer,
                darkMode && styles.darkResultsContainer,
              ]}
            >
              <Text
                style={[
                  styles.resultsHeader,
                  darkMode && styles.darkResultsHeader,
                ]}
              >
                {t.resultsHeader(filteredBuses.length)}
              </Text>

              <FlatList
                data={filteredBuses.slice(0, visibleBuses)}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#007AFF"]}
                  />
                }
                renderItem={({ item, index }) => {
                  const departureTime = item.timings?.[fromLocation] || "N/A";
                  const arrivalTime = item.timings?.[toLocation] || "N/A";
                  const isFirstBus = index === 0;
                  const isToday = item.isToday;
                  const isNextBus = isFirstBus && isToday;
                  const isTomorrow = !isToday;
                  const minutesUntilDeparture = item.minutesUntilDeparture;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.busCard,
                        darkMode && styles.darkBusCard,
                        isFirstBus && styles.firstBusCard,
                      ]}
                      onPress={() => navigateToBusDetails(item)}
                    >
                      {isFirstBus && (
                        <View
                          style={[
                            styles.nextBadge,
                            isTomorrow && styles.tomorrowBadge,
                          ]}
                        >
                          <Text style={styles.nextBadgeText}>
                            {isTomorrow ? t.nextBusTomorrow : t.nextBus}
                          </Text>
                        </View>
                      )}

                      <View style={styles.busCardHeader}>
                        <View
                          style={[
                            styles.busNumberContainer,
                            darkMode && styles.darkBusNumberContainer,
                          ]}
                        >
                          <Text
                            style={[
                              styles.busNumber,
                              darkMode && styles.darkBusNumber,
                            ]}
                          >
                            {item.busRouteNo}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.busType,
                            darkMode && styles.darkBusType,
                          ]}
                        >
                          {item.busType || t.regular}
                        </Text>
                      </View>

                      <View style={styles.routeContainer}>
                        <View style={styles.routeInfo}>
                          <View style={styles.routePoint}>
                            <View style={styles.timeContainer}>
                              <View style={styles.timeBadgeContainer}>
                                <Text
                                  style={[
                                    styles.timeText,
                                    darkMode && styles.darkTimeText,
                                  ]}
                                >
                                  {departureTime}
                                </Text>
                                {isTomorrow ? (
                                  <Text
                                    style={[
                                      styles.tomorrowText,
                                      darkMode && styles.darkTomorrowText,
                                    ]}
                                  >
                                    ({t.tomorrow})
                                  </Text>
                                ) : (
                                  isNextBus &&
                                  minutesUntilDeparture !== null && (
                                    <Text
                                      style={[
                                        styles.departureSoonText,
                                        darkMode &&
                                          styles.darkDepartureSoonText,
                                      ]}
                                    >
                                      • {t.departsIn} {minutesUntilDeparture}{" "}
                                      {t.minutes}
                                    </Text>
                                  )
                                )}
                              </View>
                            </View>
                            <Text
                              style={[
                                styles.locationText,
                                darkMode && styles.darkLocationText,
                              ]}
                            >
                              {fromLocation}
                            </Text>
                          </View>

                          <View style={styles.routeLineContainer}>
                            <View
                              style={[
                                styles.routeLine,
                                darkMode && styles.darkRouteLine,
                              ]}
                            />
                          </View>

                          <View style={styles.routePoint}>
                            <View style={styles.timeContainer}>
                              <Text
                                style={[
                                  styles.timeText,
                                  darkMode && styles.darkTimeText,
                                ]}
                              >
                                {arrivalTime}
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.locationText,
                                darkMode && styles.darkLocationText,
                              ]}
                            >
                              {toLocation}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.viewDetailsButton,
                          darkMode && styles.darkViewDetailsButton,
                        ]}
                        onPress={() => navigateToBusDetails(item)}
                      >
                        <Text
                          style={[
                            styles.viewDetailsText,
                            darkMode && styles.darkViewDetailsText,
                          ]}
                        >
                          {t.viewDetails}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={darkMode ? "#4DA8FF" : "#007bff"}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                }}
                ListFooterComponent={
                  filteredBuses.length > visibleBuses && (
                    <TouchableOpacity
                      style={[
                        styles.loadMoreButton,
                        darkMode && styles.darkLoadMoreButton,
                      ]}
                      onPress={loadMoreBuses}
                    >
                      <Text
                        style={[
                          styles.loadMoreText,
                          darkMode && styles.darkLoadMoreText,
                        ]}
                      >
                        {t.loadMore} ({filteredBuses.length - visibleBuses}{" "}
                        more)
                      </Text>
                    </TouchableOpacity>
                  )
                }
              />
            </View>
          ) : (
            <View
              style={[
                styles.noResultsContainer,
                darkMode && styles.darkNoResultsContainer,
              ]}
            >
              <Ionicons
                name="bus-outline"
                size={60}
                color={darkMode ? "#666" : "#CCCCCC"}
              />
              <Text
                style={[
                  styles.noResultsText,
                  darkMode && styles.darkNoResultsText,
                ]}
              >
                {t.noBuses}
              </Text>
              <Text
                style={[
                  styles.tryAgainText,
                  darkMode && styles.darkTryAgainText,
                ]}
              >
                {t.tryAgain}
              </Text>
            </View>
          )
        ) : (
          <View
            style={[
              styles.initialStateContainer,
              darkMode && styles.darkInitialStateContainer,
            ]}
          >
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/009/589/758/large_2x/location-location-pin-location-icon-transparent-free-png.png",
              }}
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={[styles.infoText, darkMode && styles.darkInfoText]}>
              {t.initialInfo}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserFindBus;
