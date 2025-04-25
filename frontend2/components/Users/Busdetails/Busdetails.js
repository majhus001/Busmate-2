import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./BusdetailsStyles";
import { useLanguage } from "../../../LanguageContext";
import { API_BASE_URL } from "../../../apiurl";
import axios from "axios";

const translations = {
  English: {
    title: (busRouteNo) => `🚌 ${busRouteNo} Bus Details`,
    boardingPoint: "Boarding point:",
    boardingTime: "Boarding Time:",
    expectedTime: "Expected Time:",
    farePrice: "Fare Price:",
    arrivalPoint: "Arrival point:",
    arrivalTime: "Arrival Time:",
    totalSeats: "Total Seats:",
    bookedSeats: "Booked Seats:",
    availableSeats: "Available Seats:",
    standings: "Standings:",
    active: " Active",
    inactive: "🔴 Inactive",
    liveTrack: "Live Track Bus",
    payNow: "Pay Now",
    goBack: "Go Back",
    errorTitle: "Error",
    errorMessage: "Bus details not found.",
    inactiveMessage: "This bus is not active.",
    refreshing: "Refreshing data...",
    boardingInfo: "Boarding Information",
    arrivalInfo: "Arrival Information",
    seatInfo: "Seat Availability",
    noSeatsAvailable: "No seats available on this bus",
    alternativeBuses: "Alternative Buses",
    seatsAvailable: "seats available",
    viewBus: "View",
    departureTime: "Departure:",
    noAlternatives: "No alternative buses found",
  },
  Tamil: {
    title: (busRouteNo) => `🚌 ${busRouteNo} பேருந்து விவரங்கள்`,
    boardingPoint: "பயணத் தொடக்க புள்ளி:",
    boardingTime: "பயணத் தொடக்க நேரம்:",
    expectedTime: "எதிர்பார்க்கப்பட்ட நேரம்:",
    farePrice: "கட்டண விலை:",
    arrivalPoint: "வந்து சேரும் புள்ளி:",
    arrivalTime: "வந்து சேரும் நேரம்:",
    totalSeats: "மொத்த இருக்கைகள்:",
    bookedSeats: "முன்பதிவு செய்யப்பட்ட இருக்கைகள்:",
    availableSeats: "கிடைக்கும் இருக்கைகள்:",
    standings: "நிற்கும் இடங்கள்:",
    active: "🟢 செயலில்",
    inactive: "🔴 செயலற்றது",
    liveTrack: "பேருந்தை நேரடியாக கண்காணி",
    payNow: "💳 இப்போது செலுத்து",
    goBack: "பின்னால் செல்",
    errorTitle: "பிழை",
    errorMessage: "பேருந்து விவரங்கள் கிடைக்கவில்லை.",
    inactiveMessage: "இந்த பேருந்து செயலில் இல்லை.",
    refreshing: "தரவைப் புதுப்பிக்கிறது...",
    boardingInfo: "பயணத் தொடக்கம் தகவல்",
    arrivalInfo: "வந்து சேரும் தகவல்",
    seatInfo: "இருக்கை கிடைப்பு",
    noSeatsAvailable: "இந்த பேருந்தில் இருக்கைகள் இல்லை",
    alternativeBuses: "மாற்று பேருந்துகள்",
    seatsAvailable: "இருக்கைகள் உள்ளன",
    viewBus: "பார்க்க",
    departureTime: "புறப்படும் நேரம்:",
    noAlternatives: "மாற்று பேருந்துகள் இல்லை",
  },
  Hindi: {
    title: (busRouteNo) => `🚌 ${busRouteNo} बस विवरण`,
    boardingPoint: "बोर्डिंग पॉइंट:",
    boardingTime: "बोर्डिंग समय:",
    expectedTime: "अपेक्षित समय:",
    farePrice: "किराया मूल्य:",
    arrivalPoint: "आगमन पॉइंट:",
    arrivalTime: "आगमन समय:",
    totalSeats: "कुल सीटें:",
    bookedSeats: "बुक्ड सीटें:",
    availableSeats: "उपलब्ध सीटें:",
    standings: "खड़े होने की जगह:",
    active: "🟢 सक्रिय",
    inactive: "🔴 निष्क्रिय",
    liveTrack: "बस को लाइव ट्रैक करें",
    payNow: "💳 अभी भुगतान करें",
    goBack: "वापस जाएं",
    errorTitle: "त्रुटि",
    errorMessage: "बस विवरण नहीं मिला।",
    inactiveMessage: "यह बस सक्रिय नहीं है।",
    refreshing: "डेटा रिफ्रेश हो रहा है...",
    boardingInfo: "बोर्डिंग जानकारी",
    arrivalInfo: "आगमन जानकारी",
    seatInfo: "सीट उपलब्धता",
    noSeatsAvailable: "इस बस में कोई सीट उपलब्ध नहीं है",
    alternativeBuses: "वैकल्पिक बसें",
    seatsAvailable: "सीटें उपलब्ध हैं",
    viewBus: "देखें",
    departureTime: "प्रस्थान:",
    noAlternatives: "कोई वैकल्पिक बस नहीं मिली",
  },
};

// Animated Arrow Component
const AnimatedArrow = ({ onPress, darkMode, t, language }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create a loop animation for the arrow
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          // Move down
          Animated.timing(translateY, {
            toValue: 10,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          // Move up
          Animated.timing(translateY, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Pulse opacity
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, []);

  return (
    <TouchableOpacity style={styles.arrowContainer} onPress={onPress}>
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
        }}
      >
        <Ionicons name="chevron-down" size={24} color="black" />
      </Animated.View>
      <Text style={styles.arrowText}>
        {language === 'English' ? 'Suggestions' : language === 'Tamil' ? 'விருப்பங்கள்' : 'विकल्प'}
      </Text>
    </TouchableOpacity>
  );
};

const Busdetails = ({ route, navigation }) => {
  const { language, darkMode } = useLanguage();
  const t = translations[language] || translations.English;
  const scrollViewRef = useRef(null);

  const { bus: initialBus, fromLocation, toLocation, buses: initialBuses } = route.params || {};
  const [bus, setBus] = useState(initialBus || {});
  const [allBuses, setAllBuses] = useState(initialBuses || []);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [bookedSeats, setBookedSeats] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showArrow, setShowArrow] = useState(false);

  const totalSeats = bus?.totalSeats || 0;

  // Function to find alternative buses with available seats
  const findAlternativeBuses = () => {
    if (!allBuses || allBuses.length === 0 || !fromLocation || !toLocation) {
      return [];
    }

    return allBuses
      .filter(alternateBus => {
        // Skip the current bus
        if (alternateBus._id === bus._id) return false;

        // Check if the bus is active
        if (!alternateBus.LoggedIn) return false;

        // Check if the bus has the same route
        const stages = Object.keys(alternateBus.timings || {});
        const fromIndex = stages.indexOf(fromLocation);
        const toIndex = stages.indexOf(toLocation);

        // Check if this bus covers the required route
        const hasRoute = fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;

        // Check if the bus has available seats
        const hasSeats = alternateBus.availableSeats > 0;

        return hasRoute && hasSeats;
      })
      .sort((a, b) => {
        // Sort by departure time
        const aTime = a.timings?.[fromLocation] || '';
        const bTime = b.timings?.[fromLocation] || '';

        // Convert time strings to comparable values (assuming format like "10:30 AM")
        const getTimeValue = (timeStr) => {
          if (!timeStr) return 0;

          // Extract hours and minutes
          const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
          if (!timeParts) return 0;

          let hours = parseInt(timeParts[1], 10);
          const minutes = parseInt(timeParts[2], 10);
          const period = timeParts[3] ? timeParts[3].toUpperCase() : null;

          // Convert to 24-hour format if AM/PM is specified
          if (period === 'PM' && hours < 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;

          // Return time as minutes since midnight for easy comparison
          return hours * 60 + minutes;
        };

        const aTimeValue = getTimeValue(aTime);
        const bTimeValue = getTimeValue(bTime);

        // If time values are the same, fall back to string comparison
        if (aTimeValue === bTimeValue) {
          return aTime.localeCompare(bTime);
        }

        return aTimeValue - bTimeValue;
      })
      .slice(0, 3); // Limit to 3 alternatives
  };

  // Get alternative buses
  const alternativeBuses = findAlternativeBuses();

  useEffect(() => {
    if (!initialBus) {
      Alert.alert(t.errorTitle, t.errorMessage);
      navigation.goBack();
    }
  }, [initialBus]);

  const fetchBusDetails = async () => {
    try {
      setIsLoading(true);
      setRefreshing(true);

      let currentAvailableSeats = bus?.availableSeats || 0;

      // 1. Fetch updated bus status
      if (bus?._id) {
        console.log("Fetching buses on bus details");
        const busResponse = await axios.get(
          `${API_BASE_URL}/api/Admin/buses/fetchBusbyId/${bus._id}`
        );
        console.log("New available seats on busdetails:", busResponse.data.availableSeats);

        if (busResponse.data) {
          setBus(busResponse.data);
          currentAvailableSeats = busResponse.data.availableSeats || 0;
        }
      }

      // 2. Fetch seat availability
      if (bus?.busRouteNo && fromLocation) {
        const seatsResponse = await axios.post(
          `${API_BASE_URL}/api/tickets/getseats/available`,
          {
            boardingPoint: fromLocation,
            busRouteNo: bus.busRouteNo,
          }
        );

        if (seatsResponse.data) {
          const checkoutseats = seatsResponse.data.checkoutseats || 0;
          const currentTotalSeats = bus?.totalSeats || 0;
          const newavailableSeats = currentAvailableSeats + checkoutseats;
          const newBookedSeats = currentTotalSeats - newavailableSeats;
          console.log("New available seats updating:", newavailableSeats);
          if (newavailableSeats < 0) {
            setAvailableSeats(0);
          } else {
            setAvailableSeats(newavailableSeats);
          }
          setBookedSeats(newBookedSeats);
        }
      }
    } catch (error) {
      console.error("Error fetching bus details:", error);
      Alert.alert(t.errorTitle, t.errorMessage);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBusDetails();
    const intervalId = setInterval(fetchBusDetails, 15000);
    return () => clearInterval(intervalId);
  }, [fromLocation, totalSeats, bus?._id, availableSeats]);

  // Set showArrow when availableSeats changes
  useEffect(() => {
    // Show arrow if there are no available seats and there are alternative buses
    if (availableSeats === 0 && alternativeBuses.length > 0) {
      setShowArrow(true);
    } else {
      setShowArrow(false);
    }
  }, [availableSeats, alternativeBuses]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchBusDetails();
    });
    return unsubscribe;
  }, [navigation]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBusDetails();
  };

  const boardingTime = bus?.timings?.[fromLocation] || "N/A";
  const arrivalTime = bus?.timings?.[toLocation] || "N/A";
  const routeKey = `${fromLocation}-${toLocation}`;
  const fareprice = bus?.prices?.[routeKey] || "N/A";

  if (!initialBus) {
    return null;
  }

  // Function to scroll to the bottom of the ScrollView
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <ScrollView
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#007AFF"]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.busNumber, darkMode && styles.darkText]}>
            Bus Route No : {bus?.busRouteNo || "N/A"}
          </Text>
          <Text style={[styles.route, darkMode && styles.darkText]}>
            {bus?.fromStage || "N/A"} → {bus?.toStage || "N/A"}
          </Text>

          <View
            style={[
              styles.statusBadge,
              bus?.LoggedIn ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <Ionicons
              name={bus?.LoggedIn ? "checkmark-circle" : "close-circle"}
              size={16}
              color="#fff"
            />
            <Text style={styles.statusText}>
              {bus?.LoggedIn ? t.active : t.inactive}
            </Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={[styles.card, darkMode && styles.darkCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="bus" size={20} color="#007AFF" />
            <Text style={[styles.cardTitle, darkMode && styles.darkText]}>
              {t.boardingInfo}
            </Text>
          </View>

          <InfoRow
            icon="location"
            label={t.boardingPoint}
            value={fromLocation}
            darkMode={darkMode}
          />
          <InfoRow
            icon="time"
            label={t.boardingTime}
            value={boardingTime}
            darkMode={darkMode}
          />
          <InfoRow
            icon="cash"
            label={t.farePrice}
            value={fareprice}
            darkMode={darkMode}
          />
        </View>

        <View style={[styles.card, darkMode && styles.darkCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="flag" size={20} color="#34C759" />
            <Text style={[styles.cardTitle, darkMode && styles.darkText]}>
              {t.arrivalInfo}
            </Text>
          </View>

          <InfoRow
            icon="location"
            label={t.arrivalPoint}
            value={toLocation}
            darkMode={darkMode}
          />
          <InfoRow
            icon="time"
            label={t.arrivalTime}
            value={arrivalTime}
            darkMode={darkMode}
          />
        </View>

        {/* Seat Availability */}
        <View style={[styles.card, darkMode && styles.darkCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={20} color="#5856D6" />
            <Text style={[styles.cardTitle, darkMode && styles.darkText]}>
              {t.seatInfo}
            </Text>
          </View>

          <View style={styles.seatGrid}>
            <SeatPill
              label={t.totalSeats}
              value={totalSeats}
              darkMode={darkMode}
            />
            <SeatPill
              label={t.bookedSeats}
              value={bookedSeats}
              darkMode={darkMode}
            />
            <SeatPill
              label={t.availableSeats}
              value={availableSeats}
              darkMode={darkMode}
            />
            <SeatPill
              label={t.standings}
              value={Math.max(bookedSeats - totalSeats, 0)}
              darkMode={darkMode}
            />
          </View>
        </View>

        {/* Alternative Buses Suggestions */}
        {availableSeats === 0 && showSuggestions && (
          <BusSuggestions
            buses={alternativeBuses}
            fromLocation={fromLocation}
            toLocation={toLocation}
            darkMode={darkMode}
            t={t}
            language={language}
            onClose={() => setShowSuggestions(false)}
            navigation={navigation}
          />
        )}
      </ScrollView>

      {/* Fixed Footer Buttons */}
      <View style={styles.footer}>
        <ActionButton
          icon="navigate"
          label={t.liveTrack}
          color={bus?.LoggedIn ? "#007AFF" : "#A9A9A9"}
          onPress={
            bus?.LoggedIn && bus?.busRouteNo
              ? () => navigation.navigate("usmap", { busRouteNo: bus?.busRouteNo })
              : () => Alert.alert(t.errorTitle, bus?.LoggedIn ? "Invalid bus number." : t.inactiveMessage)
          }
          disabled={!bus?.LoggedIn || !bus?.busRouteNo}
        />
        <ActionButton
          icon="card"
          label={t.payNow}
          color="#34C759"
          onPress={() =>
            navigation.navigate("payment", {
              fareprice,
              busno: bus?.busRouteNo || "",
              fromLocation,
              toLocation,
            })
          }
        />
      </View>

      {/* Animated Arrow */}
      {showArrow && (
        <AnimatedArrow
          onPress={scrollToBottom}
          darkMode={darkMode}
          t={t}
          language={language}
        />
      )}
    </View>
  );
};

// Suggestion Component
const BusSuggestions = ({ buses, fromLocation, toLocation, darkMode, t, onClose, navigation, language }) => {
  if (!buses || buses.length === 0) {
    return null;
  }

  return (
    <View style={[styles.suggestionContainer, darkMode && styles.darkSuggestionContainer]}>
      <View style={styles.suggestionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="information-circle" size={20} color="#FF9500" />
          <Text style={[styles.suggestionTitle, darkMode && styles.darkText]}>
            {t.alternativeBuses}
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={20} color={darkMode ? "#8E8E93" : "#48484A"} />
        </TouchableOpacity>
      </View>

      {/* Subtitle indicating sorting by time */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Ionicons name="time-outline" size={16} color={darkMode ? "#8E8E93" : "#6B7280"} style={{ marginRight: 4 }} />
        <Text style={{
          fontSize: 12,
          color: darkMode ? "#8E8E93" : "#6B7280",
          fontStyle: 'italic'
        }}>
          {language === 'English'
            ? 'Sorted by departure time'
            : language === 'Tamil'
              ? 'புறப்படும் நேரத்தின்படி வரிசைப்படுத்தப்பட்டுள்ளது'
              : 'प्रस्थान समय के अनुसार क्रमबद्ध'}
        </Text>
      </View>

      <View style={styles.suggestionList}>
        {buses.length > 0 ? (
          buses.map((bus, index) => {
            const departureTime = bus.timings?.[fromLocation] || "N/A";
            const routeKey = `${fromLocation}-${toLocation}`;
            const fare = bus.prices?.[routeKey] || "N/A";

            return (
              <View
                key={bus._id || index}
                style={[
                  styles.suggestionItem,
                  darkMode && styles.darkSuggestionItem,
                  index === buses.length - 1 && { borderBottomWidth: 0 }
                ]}
              >
                <View style={styles.busInfo}>
                  <Text style={[styles.busRouteText, darkMode && styles.darkText]}>
                    {bus.busRouteNo}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="time-outline" size={14} color={darkMode ? "#8E8E93" : "#6B7280"} style={{ marginRight: 4 }} />
                    <Text style={[styles.busTimeText, darkMode && styles.darkText, { fontWeight: '600', color: '#007AFF' }]}>
                      {departureTime}
                    </Text>
                    <Text style={[styles.busTimeText, darkMode && styles.darkText]}>
                      {" • ₹"}{fare}
                    </Text>
                  </View>
                </View>
                <Text style={styles.seatsAvailable}>
                  {bus.availableSeats} {t.seatsAvailable}
                </Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => navigation.replace("Busdetails", {
                    bus,
                    fromLocation,
                    toLocation,
                    buses
                  })}
                >
                  <Text style={styles.viewButtonText}>{t.viewBus}</Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text style={[styles.busTimeText, darkMode && styles.darkText]}>
            {t.noAlternatives}
          </Text>
        )}
      </View>
    </View>
  );
};

// Reusable Components
const InfoRow = ({ icon, label, value, darkMode }) => (
  <View style={styles.infoRow}>
    <Ionicons
      name={icon}
      size={18}
      color={darkMode ? "#8E8E93" : "#48484A"}
      style={styles.rowIcon}
    />
    <Text style={[styles.rowLabel, darkMode && styles.darkText]}>{label}</Text>
    <Text style={[styles.rowValue, darkMode && styles.darkText]}>
      {value || "N/A"}
    </Text>
  </View>
);

const SeatPill = ({ label, value, darkMode }) => (
  <View style={[styles.seatPill, darkMode && styles.darkPill]}>
    <Text style={[styles.seatLabel, darkMode && styles.darkText]}>{label}</Text>
    <Text style={[styles.seatValue, darkMode && styles.darkText]}>{value}</Text>
  </View>
);

const ActionButton = ({ icon, label, color, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.actionButton, { backgroundColor: color }, disabled && styles.disabledButton]}
    onPress={onPress}
    disabled={disabled}
  >
    <Ionicons name={icon} size={20} color="#fff" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

export default Busdetails;