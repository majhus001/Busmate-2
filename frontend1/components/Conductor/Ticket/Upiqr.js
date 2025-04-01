import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const Upiqr = ({ route }) => {
  const { upiId = "thamilprakasam2005@okhdfcbank", amount = "100" } = route.params || {};
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [qrValue, setQrValue] = useState("");
  
  useEffect(() => {
    if (amount) {
      setDisplayAmount(amount);
      // Correcting the UPI link format
      const upiLink = `upi://pay?pa=${upiId}&pn=Rahul&am=${amount}&cu=INR`;
      setQrValue(upiLink);
    }
  }, [amount, upiId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UPI Payment</Text>
      <Text style={styles.amount}>Amount: ₹{displayAmount}</Text>

      {/* Display QR Code for payment */}
      {qrValue ? (
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Scan to Pay ₹{displayAmount}</Text>
          <QRCode value={qrValue} size={200} />
        </View>
      ) : (
        <Text>Generating QR...</Text>
      )}
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
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
});

export default Upiqr;
