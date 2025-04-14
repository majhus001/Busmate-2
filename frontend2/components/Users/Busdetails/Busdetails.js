import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
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
    payNow: "💳 Pay Now",
    goBack: "Go Back",
    errorTitle: "Error",
    errorMessage: "Bus details not found.",
    refreshing: "Refreshing data...",
    boardingInfo: "Boarding Information", // English
    arrivalInfo: "Arrival Information",
    seatInfo: "Seat Availability",
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
    refreshing: "தரவைப் புதுப்பிக்கிறது...",
    boardingInfo: "பயணத் தொடக்கம் தகவல்",
    arrivalInfo: "வந்து சேரும் தகவல்",
    seatInfo: "இருக்கை கிடைப்பு",
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
    refreshing: "डेटा रिफ्रेश हो रहा है...",
    boardingInfo: "बोर्डिंग जानकारी",
    arrivalInfo: "आगमन जानकारी",
    seatInfo: "सीट उपलब्धता",
  },
};

const Busdetails = ({ route, navigation }) => {
  const { language, darkMode } = useLanguage();
  const t = translations[language] || translations.English;

  const { bus: initialBus, fromLocation, toLocation } = route.params || {};
  const [bus, setBus] = useState(initialBus || {});
  const [availableSeats, setAvailableSeats] = useState(0);
  const [bookedSeats, setBookedSeats] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const totalSeats = bus?.totalSeats || 0;

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
        console.log("fetching buses on bus details");
        const busResponse = await axios.get(
          `${API_BASE_URL}/api/Admin/buses/fetchBusbyId/${bus._id}`
        );
        console.log(
          "newavseats on busdetails",
          busResponse.data.availableSeats
        );

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
          console.log("newav fetching updating", newavailableSeats);
          if (newavailableSeats < 0) {
            setAvailableSeats(0);
          }else{
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
      setRefreshing(false); // Fixed typo here (was setRefreshing)
    }
  };

  useEffect(() => {
    fetchBusDetails();
    const intervalId = setInterval(fetchBusDetails, 15000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fromLocation, totalSeats, bus?._id, availableSeats]);

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
    return null; // Already handled in useEffect
  }

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <ScrollView
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
      </ScrollView>

      {/* Fixed Footer Buttons */}
      <View style={styles.footer}>
        <ActionButton
          icon="navigate"
          label={t.liveTrack}
          color="#007AFF"
          onPress={() => navigation.navigate("usmap",{busId: bus._id})}
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

const ActionButton = ({ icon, label, color, onPress }) => (
  <TouchableOpacity
    style={[styles.actionButton, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Ionicons name={icon} size={20} color="#fff" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

export default Busdetails;

