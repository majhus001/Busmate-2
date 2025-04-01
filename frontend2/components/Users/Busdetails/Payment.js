import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import * as SecureStore from "expo-secure-store";

const Payment = () => {
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [storedDistance, setStoredDistance] = useState(null);

  useEffect(() => {
    const fetchDistance = async () => {
      try {
        const distanceStr = await SecureStore.getItemAsync("storedDistance");
        console.log("📌 Debug: Raw distance from SecureStore =", distanceStr);
    
        if (!distanceStr) {
          console.warn("⚠️ No distance found in SecureStore.");
          setStoredDistance(null);
          return;
        }
    
        // Extract numeric part using regex
        const match = distanceStr.match(/([\d.]+)/);
        if (!match) {
          console.error("❌ Could not extract numeric value from:", distanceStr);
          setStoredDistance(null);
          return;
        }
    
        // const numericDistance = parseFloat(match[1]); // Extract the number
        const numericDistance = 0.86;
        if (isNaN(numericDistance)) {
          console.error("❌ Invalid distance value after parsing:", distanceStr);
          setStoredDistance(null);
        } else {
          console.log("✅ Parsed Distance =", numericDistance);
          setStoredDistance(numericDistance);
        }
      } catch (error) {
        console.error("❌ Error fetching distance:", error);
        setStoredDistance(null);
      }
    };
    

    fetchDistance();
  }, []);

  const handlePayment = async () => {
    console.log("📌 Debug: Stored Distance =", storedDistance);

    if (storedDistance === null || isNaN(storedDistance)) {
      Alert.alert("⚠️ Error", "Distance data is invalid.");
      return;
    }

    if (storedDistance > 1) {
      Alert.alert("⚠️ Payment Restricted", "You can only pay if you are within 1 km.");
      return;
    }

    try {
      const response = await fetch("http://192.168.232.182:3001/api/payment/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 10000 }), // ₹100 in paise
      });

      const data = await response.json();

      if (!data || !data.order || !data.order.id) {
        alert("Failed to create order");
        return;
      }

      const { id, amount, currency } = data.order;
      const url = `https://api.razorpay.com/v1/checkout/embedded?key_id=rzp_test_CMsB4Ic9wCgo4O&order_id=${id}&amount=${amount}&currency=${currency}&redirect=true`;

      console.log("🔗 Razorpay Payment URL:", url);
      setPaymentUrl(url);
      setShowWebView(true);
    } catch (err) {
      console.error("❌ Payment API Error:", err);
      alert("Error creating order");
    }
  };

  const handleWebViewNavigation = (event) => {
    const url = event.url;
    console.log("🔗 Navigated to:", url);

    if (url.includes("success")) {
      setShowWebView(false);
      Alert.alert("✅ Payment Successful!");
    } else if (url.includes("failure")) {
      setShowWebView(false);
      Alert.alert("❌ Payment Failed!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Distance: {storedDistance !== null ? `${storedDistance.toFixed(2)} km` : "Fetching..."}
      </Text>
      <Text style={styles.text}>Total Amount: ₹100</Text>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>

      <Modal visible={showWebView} transparent>
        <View style={styles.webViewContainer}>
          {paymentUrl ? (
            <WebView
              source={{ uri: paymentUrl }}
              onNavigationStateChange={handleWebViewNavigation}
              startInLoadingState
              renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
            />
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
  text: { fontSize: 20, marginBottom: 20 },
  button: { backgroundColor: "#3399cc", padding: 15, borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 18 },
  webViewContainer: { flex: 1, backgroundColor: "#fff", marginTop: 50 },
});

export default Payment;