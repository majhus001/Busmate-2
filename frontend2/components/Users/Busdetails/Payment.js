import React, { useState, useEffect } from "react";
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
const Payment = ({ route, navigation }) => {
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [storedDistance, setStoredDistance] = useState(null);
  const [seatCount, setSeatCount] = useState(1); // Default 1 seat
  const [userId, setUserId] = useState(null);
  const fareprice = route.params?.fareprice ? parseFloat(route.params.fareprice) : 0;
  const busno = route.params?.busno || "Unknown Bus"; // Default to "Unknown Bus" if not provided
console.log(busno);
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

    // Handling back press
    const backAction = () => {
      if (showWebView) {
        setShowWebView(false); // Dismiss the modal
        return true; // Prevent default back action
      }
      return false; // Allow default back behavior if WebView is not shown
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    // Cleanup the event listener
    return () => {
      backHandler.remove();
    };
  }, [showWebView]);

  const fetchId = async () => {
    try {
      const id = await SecureStore.getItemAsync("currentUserId"); // ✅ Corrected key
      if (id) {
        console.log("✅ Retrieved ID:", id);
        setUserId(id);
        return id;
      } else {
        console.warn("⚠️ No ID found in SecureStore");
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching ID:", error);
      return null;
    }
  };
  useEffect(() => {
    fetchId();
  }, []);
    
  
  const handlePayment = async () => {
    if (storedDistance === null || isNaN(storedDistance)) {
      Alert.alert("⚠️ Error", "Distance data is invalid.");
      return;
    }

    if (storedDistance > 1) {
      Alert.alert("⚠️ Payment Restricted", "You can only pay if you are within 1 km.");
      return;
    }

    if (!userId) {
      Alert.alert("⚠️ Error", "User ID not found.");
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
          userId: userId
        }),
      });

      // Check if response is ok before parsing
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the response text first
      const responseText = await response.text();
      
      // Try to parse as JSON
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

      // Get the current date and time
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const formattedTime = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // Dynamic HTML for WebView
      const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bus Ticket Payment</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    :root {
      --primary: #3a86ff;
      --primary-dark: #2b6be0;
      --text-dark: #2d3748;
      --text-light: #4a5568;
      --text-muted: #718096;
      --gray-light: #f7fafc;
      --gray-lighter: #edf2f7;
      --white: #ffffff;
      --success: #10b981;
      --shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      --radius: 8px;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f6f9fc, #edf2f7);
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
      height:100%;
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
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    
    .detail-row:last-child {
      border-bottom: none;
      padding-top: 15px;
      margin-top: 5px;
      border-top: 1px dashed rgba(0,0,0,0.1);
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
      border-top: 1px solid rgba(0,0,0,0.05);
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
  </style>
</head>
<body>
  <div class="payment-card">
    <div class="payment-header">
      <h1>Complete Your Payment</h1>
      <p>Secure payment gateway for your bus ticket</p>
      <div class="secure-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        Secure Checkout
      </div>
    </div>
    
    <div class="payment-body">
      <div class="payment-info">
        <h2>Booking Summary</h2>
        <div class="ticket-details">
          <div class="ticket-punch"></div>
          <div class="ticket-punch-right"></div>
          
          <div class="detail-row">
            <span>Ticket Type</span>
            <span>Express Bus</span>
          </div>
          <div class="detail-row">
            <span>Seats</span>
            <span>${seatCount} Seat(s)</span>
          </div>
          <div class="detail-row">
            <span>Date</span>
            <span>${formattedDate}, ${formattedTime}</span>
          </div>
          <div class="detail-row">
            <span>Fare Price</span>
            <span>₹${fareprice.toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span>Total Amount</span>
            <span>₹${(fareprice * seatCount).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <button id="payBtn" class="payment-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
        Pay ₹${(fareprice * seatCount).toFixed(2)} Securely
      </button>
    </div>
    
    <div class="payment-footer">
      <p>Your payment is protected with industry-standard encryption</p>
      <div class="payment-methods">
        <img src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Symbol.png" alt="Visa">
        <img src="https://logolook.net/wp-content/uploads/2021/07/Mastercard-Logo.png" alt="Mastercard">
        <img src="https://i.pinimg.com/originals/0d/a5/56/0da556be226d5dc221d98b57efd9c1f6.png" alt="RuPay">
        <img src="https://arpitatulsyan.com/wp-content/uploads/2020/03/upi-logo-png-4-600x180.png" alt="UPI">
      </div>
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
          alert("✅ Payment Successful: " + response.razorpay_payment_id);
        },
        "prefill": {
          "name": "Customer Name",
          "email": "customer@example.com",
          "contact": "9999999999"
        },
        "theme": { "color": "#3a86ff" }
      };
      var rzp1 = new Razorpay(options);
      rzp1.open();
    });
  </script>
</body>
</html>
      `;

      setPaymentUrl(`data:text/html,${encodeURIComponent(htmlContent)}`);
      setShowWebView(true);
    } catch (err) {
      console.error("❌ Payment API Error:", err);
      alert("❌ Error creating order");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Distance: {storedDistance ? `${storedDistance.toFixed(2)} km` : "Fetching..."}
      </Text>
      <Text style={styles.text}>Total Amount: ₹{(fareprice * seatCount).toFixed(2)}</Text>

      {/* Seat Count Controls */}
      <View style={styles.seatContainer}>
        <TouchableOpacity onPress={() => setSeatCount(Math.max(1, seatCount - 1))} style={styles.seatButton}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.text}>{seatCount}</Text>
        <TouchableOpacity onPress={() => setSeatCount(seatCount + 1)} style={styles.seatButton}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>

      <Modal visible={showWebView} transparent animationType="slide">
        <View style={styles.webViewContainer}>
          {paymentUrl ? (
            <WebView source={{ uri: paymentUrl }} startInLoadingState />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, marginBottom: 10 },
  button: { backgroundColor: "#3399cc", padding: 15, borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 18 },
  seatContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  seatButton: { backgroundColor: "#3399cc", padding: 10, borderRadius: 5, marginHorizontal: 10 },
  webViewContainer: { flex: 1, backgroundColor: "#fff", marginTop: 50 },
});

export default Payment;
