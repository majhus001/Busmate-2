import React, { useState, useEffect } from "react";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../../apiurl";
import styles from "./PaymentStyles"; // Import your styles
import { useLanguage } from "../../../LanguageContext"; // Import the language context

// Define translations for all text in the component
const translations = {
  English: {
    distance: "Distance:",
    fetching: "Fetching...",
    totalAmount: "Total Amount:",
    payNow: "Pay Now",
    successTitle: "Success",
    successMessage: (paymentId) =>
      `Payment Successful! Payment ID: ${paymentId}`,
    okButton: "OK",
    cancelTitle: "Payment Cancelled",
    cancelMessage: "The payment was cancelled",
    errorTitle: "Error",
    errorMessage: "An error occurred during payment processing",
    distanceErrorTitle: "⚠️ Error",
    distanceErrorMessage: "Distance data is invalid.",
    distanceRestrictedTitle: "⚠️ Payment Restricted",
    distanceRestrictedMessage: "You can only pay if you are within 1 km.",
    userIdErrorTitle: "⚠️ Error",
    userIdErrorMessage: "User ID not found.",
    orderErrorMessage: "❌ Error creating order",
    // WebView translations
    webTitle: "Complete Your Payment",
    webSubtitle: "Secure payment gateway for your bus ticket",
    webSecure: "Secure Checkout",
    webSummary: "Booking Summary",
    webTicketType: "Ticket Type",
    webTicketValue: "Express Bus",
    webBusNumber: "Bus Number",
    webSeats: "Seats",
    webSeatCount: (count) => `${count} Seat(s)`,
    webDate: "Date",
    webFarePrice: "Fare Price",
    webTotalAmount: "Total Amount",
    webPayButton: (amount) => `Pay ₹${amount} Securely`,
    webFooter: "Your payment is protected with industry-standard encryption",
    webGoBack: "Go Back",
  },
  Tamil: {
    distance: "தூரம்:",
    fetching: "பெறப்படுகிறது...",
    totalAmount: "மொத்த தொகை:",
    payNow: "இப்போது செலுத்து",
    successTitle: "வெற்றி",
    successMessage: (paymentId) =>
      `பணம் செலுத்துதல் வெற்றிகரமாக முடிந்தது! பணம் செலுத்துதல் ஐடி: ${paymentId}`,
    okButton: "சரி",
    cancelTitle: "பணம் செலுத்துதல் ரத்து செய்யப்பட்டது",
    cancelMessage: "பணம் செலுத்துதல் ரத்து செய்யப்பட்டது",
    errorTitle: "பிழை",
    errorMessage: "பணம் செலுத்துதல் செயலாக்கத்தில் பிழை ஏற்பட்டது",
    distanceErrorTitle: "⚠️ பிழை",
    distanceErrorMessage: "தூர தரவு தவறானது.",
    distanceRestrictedTitle: "⚠️ பணம் செலுத்துதல் தடை",
    distanceRestrictedMessage:
      "நீங்கள் 1 கி.மீ.க்குள் இருக்கும்போது மட்டுமே பணம் செலுத்த முடியும்.",
    userIdErrorTitle: "⚠️ பிழை",
    userIdErrorMessage: "பயனர் ஐடி கிடைக்கவில்லை.",
    orderErrorMessage: "❌ ஆர்டர் உருவாக்குவதில் பிழை",
    // WebView translations
    webTitle: "உங்கள் பணம் செலுத்துதலை முடிக்கவும்",
    webSubtitle:
      "உங்கள் பேருந்து டிக்கெட்டிற்கான பாதுகாப்பான பணம் செலுத்துதல் நுழைவாயில்",
    webSecure: "பாதுகாப்பான செக்அவுட்",
    webSummary: "முன்பதிவு சுருக்கம்",
    webTicketType: "டிக்கெட் வகை",
    webTicketValue: "எக்ஸ்பிரஸ் பேருந்து",
    webBusNumber: "பேருந்து எண்",
    webSeats: "இருக்கைகள்",
    webSeatCount: (count) => `${count} இருக்கை(கள்)`,
    webDate: "தேதி",
    webFarePrice: "கட்டண விலை",
    webTotalAmount: "மொத்த தொகை",
    webPayButton: (amount) => `₹${amount} பாதுகாப்பாக செலுத்து`,
    webFooter:
      "உங்கள் பணம் செலுத்துதல் தொழில்துறை தரமான குறியாக்கத்தால் பாதுகாக்கப்பட்டுள்ளது",
    webGoBack: "பின்னால் செல்",
  },
  Hindi: {
    distance: "दूरी:",
    fetching: "प्राप्त हो रहा है...",
    totalAmount: "कुल राशि:",
    payNow: "अभी भुगतान करें",
    successTitle: "सफलता",
    successMessage: (paymentId) => `भुगतान सफल! भुगतान आईडी: ${paymentId}`,
    okButton: "ठीक है",
    cancelTitle: "भुगतान रद्द",
    cancelMessage: "भुगतान रद्द कर दिया गया",
    errorTitle: "त्रुटि",
    errorMessage: "भुगतान प्रसंस्करण के दौरान त्रुटि हुई",
    distanceErrorTitle: "⚠️ त्रुटि",
    distanceErrorMessage: "दूरी डेटा अमान्य है।",
    distanceRestrictedTitle: "⚠️ भुगतान प्रतिबंधित",
    distanceRestrictedMessage:
      "आप केवल 1 किमी के भीतर होने पर ही भुगतान कर सकते हैं।",
    userIdErrorTitle: "⚠️ त्रुटि",
    userIdErrorMessage: "उपयोगकर्ता आईडी नहीं मिली।",
    orderErrorMessage: "❌ ऑर्डर बनाने में त्रुटि",
    // WebView translations
    webTitle: "अपना भुगतान पूरा करें",
    webSubtitle: "आपके बस टिकट के लिए सुरक्षित भुगतान गेटवे",
    webSecure: "सुरक्षित चेकआउट",
    webSummary: "बुकिंग सारांश",
    webTicketType: "टिकट प्रकार",
    webTicketValue: "एक्सप्रेस बस",
    webBusNumber: "बस संख्या",
    webSeats: "सीटें",
    webSeatCount: (count) => `${count} सीट(ें)`,
    webDate: "तारीख",
    webFarePrice: "किराया मूल्य",
    webTotalAmount: "कुल राशि",
    webPayButton: (amount) => `₹${amount} सुरक्षित रूप से भुगतान करें`,
    webFooter: "आपका भुगतान उद्योग-मानक एन्क्रिप्शन के साथ संरक्षित है",
    webGoBack: "वापस जाएं",
  },
};

const Payment = ({ route, navigation }) => {
  const { language, darkMode } = useLanguage(); // Use the language context with darkMode
  const t = translations[language] || translations.English; // Fallback to English

  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [storedDistance, setStoredDistance] = useState(null);
  const [seatCount, setSeatCount] = useState(1);
  const [userId, setUserId] = useState(null);
  const fareprice = route.params?.fareprice
    ? parseFloat(route.params.fareprice)
    : 0;
  const busno = route.params?.busno || "Unknown Bus";
  const { fromLocation, toLocation } = route.params;

  useEffect(() => {
    const fetchDistance = async () => {
      try {
        const distanceStr = await SecureStore.getItemAsync("storedDistance");
        console.log("📌 Debug: Raw distance from SecureStore =", distanceStr);

        const match = distanceStr?.match(/([\d.]+)/);
        const numericDistance = match ? parseFloat(match[1]) : null;

        if (numericDistance !== null && !isNaN(numericDistance)) {
          console.log("✅ Parsed Distance =", numericDistance);
          setStoredDistance(numericDistance);
        } else {
          console.error("❌ Invalid distance value");
          setStoredDistance(null);
        }
      } catch (error) {
        console.error("❌ Error fetching distance:", error);
      }
    };

    fetchDistance();

    const backAction = () => {
      if (showWebView) {
        setShowWebView(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [showWebView]);

  useEffect(() => {
    const fetchId = async () => {
      try {
        const id = await SecureStore.getItemAsync("currentUserId");
        if (id) {
          console.log("✅ Retrieved ID:", id);
          setUserId(id);
        }
      } catch (error) {
        console.error("❌ Error fetching ID:", error);
      }
    };
    fetchId();
  }, []);

  const injectedJavaScript = `
    true; // note: this is required, or you'll sometimes get silent failures
  `;

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "paymentSuccess") {
        setShowWebView(false);
        Alert.alert(t.successTitle, t.successMessage(data.paymentId), [
          { text: t.okButton, onPress: () => navigation.navigate("Home") },
        ]);
      } else if (data.type === "paymentCancelled") {
        setShowWebView(false);
        Alert.alert(t.cancelTitle, t.cancelMessage);
      } else if (data.type === "goBack") {
        setShowWebView(false);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      setShowWebView(false);
      Alert.alert(t.errorTitle, t.errorMessage);
    }
  };

  const handlePayment = async () => {
    if (storedDistance === null || isNaN(storedDistance)) {
      Alert.alert(t.distanceErrorTitle, t.distanceErrorMessage);
      return;
    }

    if (storedDistance > 1) {
      Alert.alert(t.distanceRestrictedTitle, t.distanceRestrictedMessage);
      return;
    }

    if (!userId) {
      Alert.alert(t.userIdErrorTitle, t.userIdErrorMessage);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: fareprice * seatCount,
          currency: "INR",
          notes: { description: "Bus Ticketing Payment" },
          busno: busno,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Raw response:", responseText);
        throw new Error("Invalid JSON response from server");
      }

      if (!data?.order?.id) {
        throw new Error("Invalid order data received");
      }

      const { id, amount, currency } = data.order;
      const now = new Date();
      const formattedDate = now.toLocaleDateString(
        language === "English"
          ? "en-IN"
          : language === "Tamil"
          ? "ta-IN"
          : "hi-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
      const formattedTime = now.toLocaleTimeString(
        language === "English"
          ? "en-IN"
          : language === "Tamil"
          ? "ta-IN"
          : "hi-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );

      const htmlContent = `
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.webTitle}</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <style>
          :root {
            --primary: ${darkMode ? "#4DA8FF" : "#3a86ff"};
            --primary-dark: ${darkMode ? "#2B6BE0" : "#2b6be0"};
            --text-dark: ${darkMode ? "#FFFFFF" : "#2d3748"};
            --text-light: ${darkMode ? "#AAAAAA" : "#4a5568"};
            --text-muted: ${darkMode ? "#666" : "#718096"};
            --gray-light: ${darkMode ? "#333" : "#f7fafc"};
            --gray-lighter: ${darkMode ? "#222" : "#edf2f7"};
            --white: ${darkMode ? "#111" : "#ffffff"};
            --success: #10b981;
            --shadow: 0 4px 6px ${
              darkMode ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.07)"
            };
            --radius: 8px;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: ${
              darkMode
                ? "linear-gradient(135deg, #111, #222)"
                : "linear-gradient(135deg, #f6f9fc, #edf2f7)"
            };
            color: var(--text-dark);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .payment-card {
            background: var(--white);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            width: 100%;
            height: 100%;
            max-width: 450px;
            overflow: hidden;
          }

          .payment-header {
            background: var(--primary);
            color: var(--white);
            padding: 22px 30px;
            position: relative;
          }

          .payment-header h1 {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 5px;
          }

          .payment-header p {
            font-size: 14px;
            opacity: 0.9;
          }

          .secure-badge {
            display: flex;
            align-items: center;
            font-size: 12px;
            margin-top: 8px;
          }

          .secure-badge svg {
            margin-right: 5px;
          }

          .payment-body {
            padding: 30px;
          }

          .payment-info {
            margin-bottom: 25px;
          }

          .payment-info h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: var(--text-dark);
            font-weight: 600;
          }

          .ticket-details {
            background: var(--gray-lighter);
            border-radius: var(--radius);
            padding: 20px;
            position: relative;
            overflow: hidden;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            padding: 10px 0;
            border-bottom: 1px solid rgba(${
              darkMode ? "255,255,255" : "0,0,0"
            },0.05);
          }

          .detail-row:last-child {
            border-bottom: none;
            padding-top: 15px;
            margin-top: 5px;
            border-top: 1px dashed rgba(${
              darkMode ? "255,255,255" : "0,0,0"
            },0.1);
          }

          .detail-row:last-child span {
            font-weight: 600;
            font-size: 16px;
          }

          .ticket-punch {
            position: absolute;
            width: 20px;
            height: 20px;
            background: var(--gray-light);
            border-radius: 50%;
            left: -10px;
            top: 50%;
          }

          .ticket-punch-right {
            position: absolute;
            width: 20px;
            height: 20px;
            background: var(--gray-light);
            border-radius: 50%;
            right: -10px;
            top: 50%;
          }

          .payment-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 16px;
            font-size: 16px;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .payment-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(58, 134, 255, 0.3);
          }

          .payment-btn svg {
            margin-right: 8px;
          }

          .payment-footer {
            text-align: center;
            padding: 15px 30px;
            border-top: 1px solid rgba(${
              darkMode ? "255,255,255" : "0,0,0"
            },0.05);
            font-size: 12px;
            color: var(--text-light);
            background: var(--gray-lighter);
          }

          .payment-methods {
            display: flex;
            justify-content: center;
            margin-top: 10px;
          }

          .payment-methods img {
            height: 20px;
            margin: 0 5px;
          }

          .go-back-btn {
            margin-top: 25px;
            color: var(--primary);
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            text-decoration: underline;
          }

          .go-back-btn:hover {
            color: var(--primary-dark);
          }
        </style>
      </head>
      <body>
        <div class="payment-card">
          <div class="payment-header">
            <h1>${t.webTitle}</h1>
            <p>${t.webSubtitle}</p>
            <div class="secure-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              ${t.webSecure}
            </div>
          </div>

          <div class="payment-body">
            <div class="payment-info">
              <h2>${t.webSummary}</h2>
              <div class="ticket-details">
                <div class="ticket-punch"></div>
                <div class="ticket-punch-right"></div>

                <div class="detail-row">
                  <span>${t.webTicketType}</span>
                  <span>${t.webTicketValue}</span>
                </div>
                <div class="detail-row">
                  <span>${t.webBusNumber}</span>
                  <span>${busno}</span>
                </div>
                <div class="detail-row">
                  <span>${t.webSeats}</span>
                  <span>${t.webSeatCount(seatCount)}</span>
                </div>
                <div class="detail-row">
                  <span>${t.webDate}</span>
                  <span>${formattedDate}, ${formattedTime}</span>
                </div>
                <div class="detail-row">
                  <span>${t.webFarePrice}</span>
                  <span>₹${fareprice.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                  <span>${t.webTotalAmount}</span>
                  <span>₹${(fareprice * seatCount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button id="payBtn" class="payment-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              ${t.webPayButton((fareprice * seatCount).toFixed(2))}
            </button>
          </div>

          <div class="payment-footer">
            <p>${t.webFooter}</p>
            <div class="payment-methods">
              <img src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Symbol.png" alt="Visa">
              <img src="https://logolook.net/wp-content/uploads/2021/07/Mastercard-Logo.png" alt="Mastercard">
              <img src="https://i.pinimg.com/originals/0d/a5/56/0da556be226d5dc221d98b57efd9c1f6.png" alt="RuPay">
              <img src="https://arpitatulsyan.com/wp-content/uploads/2020/03/upi-logo-png-4-600x180.png" alt="UPI">
            </div>
            <div id="goBackBtn" class="go-back-btn">${t.webGoBack}</div>
          </div>
        </div>

        <script>
          document.getElementById("payBtn").addEventListener("click", function () {
            var options = {
              "key": "rzp_test_CMsB4Ic9wCgo4O",
              "amount": "${(fareprice * seatCount).toFixed(2) * 100}",
              "currency": "${currency}",
              "order_id": "${id}",
              "notes": { "description": "Bus Ticket Payment" },
              "handler": function (response) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'paymentSuccess',
                  paymentId: response.razorpay_payment_id
                }));
              },
              "modal": {
                "ondismiss": function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'paymentCancelled'
                  }));
                }
              },
              "prefill": {
                "name": "Customer Name",
                "email": "customer@example.com",
                "contact": "9999999999"
              },
              "theme": { "color": "${darkMode ? "#4DA8FF" : "#3a86ff"}" }
            };
            var rzp1 = new Razorpay(options);
            rzp1.open();
          });

          document.getElementById("goBackBtn").addEventListener("click", function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'goBack'
            }));
          });
        </script>
      </body>
      </html>
      `;

      setPaymentUrl(
        `data:text/html,${encodeURIComponent(htmlContent)}`
      );
      setShowWebView(true);
    } catch (err) {
      console.error("❌ Payment API Error:", err);
      Alert.alert(t.errorTitle, t.orderErrorMessage);
    }
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>
          {t.webTitle}
        </Text>
        <Text style={[styles.subtitle, darkMode && styles.darkSubtitle]}>
          {t.webSubtitle}
        </Text>
      </View>

      {/* Route Display with Icons */}
      <View style={styles.routeContainer}>
        <MaterialIcons
          name="location-on"
          size={24}
          color={darkMode ? "#3B82F6" : "#2563EB"}
        />
        <Text
          style={[styles.locationText, darkMode && styles.darkLocationText]}
        >
          {fromLocation}
        </Text>
        <MaterialIcons
          name="arrow-forward"
          size={20}
          color={darkMode ? "#94A3B8" : "#64748B"}
          style={styles.arrowIcon}
        />
        <MaterialIcons
          name="location-pin"
          size={24}
          color={darkMode ? "#EF4444" : "#DC2626"}
        />
        <Text
          style={[styles.locationText, darkMode && styles.darkLocationText]}
        >
          {toLocation}
        </Text>
      </View>

      <View style={[styles.card, darkMode && styles.darkCard]}>
        <View style={styles.infoRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="bus"
              size={20}
              color={darkMode ? "#3B82F6" : "#2563EB"}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.infoLabel, darkMode && styles.darkInfoLabel]}>
              {t.webBusNumber}
            </Text>
          </View>
          <Text style={[styles.infoValue, darkMode && styles.darkInfoValue]}>
            {busno}
          </Text>
        </View>

        <View style={[styles.divider, darkMode && styles.darkDivider]} />

        <View style={styles.infoRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="speedometer"
              size={20}
              color={darkMode ? "#3B82F6" : "#2563EB"}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.infoLabel, darkMode && styles.darkInfoLabel]}>
              {t.distance}
            </Text>
          </View>
          <Text style={[styles.infoValue, darkMode && styles.darkInfoValue]}>
            {storedDistance ? `${storedDistance.toFixed(2)} km` : t.fetching}
          </Text>
        </View>
      </View>

      <View
        style={[styles.highlightCard, darkMode && styles.darkHighlightCard]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="wallet"
            size={24}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.amountText, darkMode && styles.darkAmountText]}>
            {t.totalAmount} ₹{(fareprice * seatCount).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={[styles.card, darkMode && styles.darkCard]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Ionicons
            name="people"
            size={20}
            color={darkMode ? "#3B82F6" : "#2563EB"}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.infoLabel, darkMode && styles.darkInfoLabel]}>
            {t.webSeats}
          </Text>
        </View>

        <View style={styles.seatContainer}>
          <TouchableOpacity
            onPress={() => setSeatCount(Math.max(1, seatCount - 1))}
            style={[styles.seatButton, darkMode && styles.darkSeatButton]}
          >
            <Ionicons
              name="remove"
              size={20}
              color={darkMode ? "#F8FAFC" : "#1E293B"}
            />
          </TouchableOpacity>
          <Text style={[styles.seatCount, darkMode && styles.darkSeatCount]}>
            {seatCount}
          </Text>
          <TouchableOpacity
            onPress={() => setSeatCount(seatCount + 1)}
            style={[styles.seatButton, darkMode && styles.darkSeatButton]}
          >
            <Ionicons
              name="add"
              size={20}
              color={darkMode ? "#F8FAFC" : "#1E293B"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, darkMode && styles.darkButton]}
        onPress={handlePayment}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="card"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>
            {t.webPayButton((fareprice * seatCount).toFixed(2))}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal visible={showWebView} transparent animationType="slide">
        <View
          style={[
            styles.webViewContainer,
            darkMode && styles.darkWebViewContainer,
          ]}
        >
          {paymentUrl ? (
            <WebView
              source={{ uri: paymentUrl }}
              startInLoadingState
              injectedJavaScript={injectedJavaScript}
              onMessage={onMessage}
            />
          ) : (
            <ActivityIndicator
              size="large"
              color={darkMode ? "#3B82F6" : "#2563EB"}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default Payment;