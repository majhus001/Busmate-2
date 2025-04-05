import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import styles from "./BusdetailsStyles"; // Ensure this path is correct
import { useLanguage } from "../../../LanguageContext"; // Ensure this path is correct

// Define translations for all text in the component
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
  const { language, darkMode } = useLanguage(); // Use the language context with darkMode
  const t = translations[language] || translations.English; // Fallback to English

  const { bus, fromLocation, toLocation } = route.params;

  if (!bus) {
    Alert.alert(t.errorTitle, t.errorMessage);
    navigation.goBack();
    return null;
  }

  const totalseats = bus.totalSeats || 0;
  const availableSeats = bus.availableSeats;
  const bookedSeats = totalseats - availableSeats;

  const BoardformattedTime = bus.timings?.[fromLocation] || "N/A";
  const ArrformattedTime = bus.timings?.[toLocation] || "N/A";

  // Correct fare price calculation
  const routeKey = `${fromLocation}-${toLocation}`;
  console.log(routeKey);
  const fareprice = bus.prices?.[routeKey] || "N/A";
  console.log(fareprice);

  return (
    <ScrollView contentContainerStyle={[styles.container, darkMode && styles.darkContainer]}>
      {/* Header Section */}
      <View style={[styles.header, darkMode && styles.darkHeader]}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>
          {t.title(bus.busRouteNo)}
        </Text>
        <Text style={[styles.routeText, darkMode && styles.darkRouteText]}>
          {bus.fromStage} → {bus.toStage}
        </Text>
      </View>

      {/* Info Cards Section */}
      <View style={styles.infoContainer}>
        {/* Route Info */}
        <View style={[styles.card, darkMode && styles.darkCard]}>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.boardingPoint} <Text style={[styles.value, darkMode && styles.darkValue]}>{fromLocation}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.boardingTime} <Text style={[styles.value, darkMode && styles.darkValue]}>{BoardformattedTime}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.expectedTime} <Text style={[styles.value, darkMode && styles.darkValue]}>{BoardformattedTime}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.farePrice} <Text style={[styles.value, darkMode && styles.darkValue]}>{fareprice}</Text>
          </Text>
        </View>

        <View style={[styles.card, darkMode && styles.darkCard]}>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.arrivalPoint} <Text style={[styles.value, darkMode && styles.darkValue]}>{toLocation}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.arrivalTime} <Text style={[styles.value, darkMode && styles.darkValue]}>{ArrformattedTime}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.expectedTime} <Text style={[styles.value, darkMode && styles.darkValue]}>{ArrformattedTime}</Text>
          </Text>
        </View>

        {/* Seat Details */}
        <View style={[styles.card, darkMode && styles.darkCard]}>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.totalSeats} <Text style={[styles.value, darkMode && styles.darkValue]}>{totalseats}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.bookedSeats} <Text style={[styles.value, darkMode && styles.darkValue]}>{bookedSeats}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.availableSeats} <Text style={[styles.value, darkMode && styles.darkValue]}>{availableSeats}</Text>
          </Text>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>
            {t.standings} <Text style={[styles.value, darkMode && styles.darkValue]}>{Math.max(bookedSeats - totalseats, 0)}</Text>
          </Text>
        </View>

        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            bus.LoggedIn ? styles.active : styles.inactive,
            darkMode && (bus.LoggedIn ? styles.darkActive : styles.darkInactive),
          ]}
        >
          <Text style={[styles.statusText, darkMode && styles.darkStatusText]}>
            {bus.LoggedIn ? t.active : t.inactive}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={[styles.trackButton, darkMode && styles.darkTrackButton]}
        onPress={() => navigation.navigate("usmap")}
      >
        <Text style={styles.trackButtonText}>{t.liveTrack}</Text>
      </TouchableOpacity>

      {/* Pay Now Button */}
      <TouchableOpacity
        style={[styles.payButton, darkMode && styles.darkPayButton]}
        onPress={() =>
          navigation.navigate("payment", {
            fareprice, // Ticket price
            busno: bus.busRouteNo, // Bus number
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