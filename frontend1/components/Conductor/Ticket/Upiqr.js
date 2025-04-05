import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const Upiqr = ({ route, navigation }) => {
  const { upiId = "567", amount = "560" } = route.params || {};
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [qrValue, setQrValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Upiqr screen loaded");

    if (!upiId || !amount) {
      Alert.alert("Error", "Missing UPI ID or amount. Please check again.");
      return;
    }

    const upiLink = `upi://pay?pa=${upiId}&pn=Rahul&am=${amount}&cu=INR`;
    setQrValue(upiLink);
    setLoading(false);
  }, [upiId, amount]);

  // const handleSuccess = () => {
  //   console.log("Payment success clicked");
  //   navigation.navigate("ticsuccess");
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UPI Payment</Text>
      <Text style={styles.amount}>Amount: ₹{displayAmount}</Text>

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

      <TouchableOpacity style={styles.successButton} >
        <Text style={styles.buttonText}>Payment Success</Text>
      </TouchableOpacity>
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
  successButton: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Upiqr;
