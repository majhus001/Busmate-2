import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
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
    active: "🟢 Active",
    inactive: "🔴 Inactive",
    liveTrack: "Live Track Bus",
    payNow: "💳 Pay Now",
    goBack: "Go Back",
    errorTitle: "Error",
    errorMessage: "Bus details not found.",
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
  },
};

const Busdetails = ({ route, navigation }) => {
  const { language, darkMode } = useLanguage();
  const t = translations[language] || translations.English;

  const { bus, fromLocation, toLocation } = route.params;

  const [availableSeats, setAvailableSeats] = useState(0);
  const [bookedSeats, setBookedSeats] = useState(0);

  const totalSeats = bus?.totalSeats || 0;

  if (!bus) {
    Alert.alert(t.errorTitle, t.errorMessage);
    navigation.goBack();
    return null;
  }

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/tickets/getseats/available`,
          {
            boardingPoint: fromLocation,
            busRouteNo: bus.busRouteNo,
          }
        );

        if (response.data) {
          const checkoutseats = response.data.checkoutseats || 0;
          const newavailableSeats = bus.availableSeats + checkoutseats;
          const bookedSeats = bus.totalSeats - newavailableSeats;
          setAvailableSeats(newavailableSeats);
          setBookedSeats(bookedSeats);
        }
      } catch (error) {
        console.error("Error fetching available seats:", error);
      }
    };

    fetchAvailableSeats();
  }, [fromLocation, totalSeats]);

  const boardingTime = bus.timings?.[fromLocation] || "N/A";
  const arrivalTime = bus.timings?.[toLocation] || "N/A";
  const routeKey = `${fromLocation}-${toLocation}`;
  const fareprice = bus.prices?.[routeKey] || "N/A";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        darkMode && styles.darkContainer,
      ]}
    >
      <View style={[styles.header, darkMode && styles.darkHeader]}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>
          {t.title(bus.busRouteNo)}
        </Text>
        <Text style={[styles.routeText, darkMode && styles.darkRouteText]}>
          {bus.fromStage} → {bus.toStage}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.card, darkMode && styles.darkCard]}>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.boardingPoint} <Text style={styles.value}>{fromLocation}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.boardingTime} <Text style={styles.value}>{boardingTime}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.expectedTime} <Text style={styles.value}>{boardingTime}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.farePrice} <Text style={styles.value}>{fareprice}</Text>
          </Text>
        </View>

        <View style={[styles.card, darkMode && styles.darkCard]}>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.arrivalPoint} <Text style={styles.value}>{toLocation}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.arrivalTime} <Text style={styles.value}>{arrivalTime}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.expectedTime} <Text style={styles.value}>{arrivalTime}</Text>
          </Text>
        </View>

        <View style={[styles.card, darkMode && styles.darkCard]}>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.totalSeats} <Text style={styles.value}>{totalSeats}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.bookedSeats} <Text style={styles.value}>{bookedSeats}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.availableSeats}{" "}
            <Text style={styles.value}>{availableSeats}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.standings}{" "}
            <Text style={styles.value}>
              {Math.max(bookedSeats - totalSeats, 0)}
            </Text>
          </Text>
        </View>

        <View
          style={[
            styles.statusCard,
            bus.LoggedIn ? styles.active : styles.inactive,
            darkMode &&
              (bus.LoggedIn ? styles.darkActive : styles.darkInactive),
          ]}
        >
          <Text style={[styles.statusText, darkMode && styles.darkStatusText]}>
            {bus.LoggedIn ? t.active : t.inactive}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.trackButton, darkMode && styles.darkTrackButton]}
        onPress={() => navigation.navigate("usmap")}
      >
        <Text style={styles.trackButtonText}>{t.liveTrack}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.payButton, darkMode && styles.darkPayButton]}
        onPress={() =>
          navigation.navigate("payment", {
            fareprice,
            busno: bus.busRouteNo,
          })
        }
      >
        <Text style={styles.payButtonText}>{t.payNow}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.backButton, darkMode && styles.darkBackButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{t.goBack}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Busdetails;
