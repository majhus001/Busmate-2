import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";

const Upiqr = ({ route, successCallback }) => {
  const { upiId = "", amount = "" } = route.params || {};
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [qrValue, setQrValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!upiId || !amount) {
      Alert.alert("Error", "Missing UPI ID or amount. Please check again.");
      return;
    }

    if (amount) {
      setDisplayAmount(amount);
      const upiLink = `upi://pay?pa=${upiId}&pn=Rahul&am=${amount}&cu=INR`;
      setQrValue(upiLink);
      setLoading(false);
    }
  }, [upiId, amount]);

  // Function to handle successful payment
  const handleSuccess = () => {
    if (successCallback) {
      successCallback("Payment Successful");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UPI Payment</Text>
      <Text style={styles.amount}>Amount: ₹{displayAmount}</Text>

      {/* Show loading indicator while generating QR */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Scan to Pay ₹{displayAmount}</Text>
          {qrValue ? (
            <QRCode value={qrValue} size={200} />
          ) : (
            <Text>Generating QR...</Text>
          )}
        </View>
      )}

      {/* Success button */}
      <View style={styles.buttonContainer}>
        <Button title="Payment Success" onPress={handleSuccess} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  amount: {
    fontSize: 18,
    marginVertical: 10,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 30,
  },
});

export default Upiqr;
