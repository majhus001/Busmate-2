import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { API_BASE_URL } from "../../../apiurl";

const EtmTicket = ({ route, navigation }) => {
  const params = route?.params || {};
  const {
    selectedFrom = "",
    selectedTo = "",
    selectedBusNo = "",
    selectedCity = "",
    selectedState = "",
  } = params;

  if (!selectedFrom || !selectedTo || !selectedBusNo) {
    Alert.alert("Error", "Missing route details. Please select again.", [
      {
        text: "OK",
        onPress: () =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("HomeScreen"),
      },
    ]);
    return null;
  }

  // Corrected template literal usage
  const RouteName = `${selectedFrom} - ${selectedTo}`;  // Template literal fix
  const [boarding, setBoarding] = useState("");
  const [destination, setDestination] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [Buspricedata, setBuspriceData] = useState({});
  const [ticketPrice, setTicketPrice] = useState(0);
  const [stages, setStages] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/busroutes/get_stages`,  // Corrected API URL usage
          { selectedCity, selectedState }
        );
        setStages(response.data.success ? response.data.stages : []);
      } catch (error) {
        setStages([]);
      }
    };

    fetchStages();
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/Admin/buses/getprice`,  // Corrected API URL usage
          { selectedBusNo }
        );
        setBuspriceData(response.data.success ? response.data.data : {});
      } catch (error) {
        setBuspriceData({});
      }
    };

    fetchPrice();
  }, []);

  useEffect(() => {
    if (boarding && destination && Buspricedata?.prices) {
      const routeKey = `${boarding}-${destination}`;  // Template literal fix
      if (Buspricedata.prices[routeKey]) {
        setTicketPrice(parseFloat(Buspricedata.prices[routeKey]));
      } else {
        Alert.alert("Price Error", "Price not available for selected route.");
      }
    }
  }, [boarding, destination, Buspricedata]);

  const handleIncrement = () => setTicketCount((prev) => prev + 1);
  const handleDecrement = () => setTicketCount((prev) => (prev > 1 ? prev - 1 : prev));

  const handleSubmit = async () => {
    if (!boarding || !destination || ticketPrice <= 0 || !paymentMethod) {
      Alert.alert("Missing Fields", "Please complete all selections.");
      return;
    }

    const totalAmount = (ticketPrice * ticketCount).toFixed(2);

    if (paymentMethod === "Online") {
      // Redirect to QR payment component
      navigation.navigate("Upiqr", {
        upiId: "iamrahul.r.2005@oksbi", // Replace with actual UPI ID
        amount: totalAmount,
      });
      return;
    }

    // Cash Payment → Issue Ticket Normally
    try {
      const response = await axios.post(`${API_BASE_URL}/api/tickets/add_ticket`, {  // Corrected API URL usage
        routeName: RouteName,
        BusNo: selectedBusNo,
        boarding,
        destination,
        ticketCount,
        ticketPrice: totalAmount,
        paymentMethod,
      });

      if (response.data.success) {
        navigation.navigate("ticsuccess");
      } else {
        Alert.alert("Failed", "Could not issue ticket. Try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Network issue. Try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Route Name: {RouteName}</Text>
        <Text style={styles.label}>Bus No: {selectedBusNo}</Text>
      </View>

      <Text style={styles.label}>Boarding</Text>
      <Picker selectedValue={boarding} onValueChange={setBoarding} style={styles.picker}>
        <Picker.Item label="Select Boarding" value="" />
        {stages.map((stage, index) => (
          <Picker.Item key={index} label={stage} value={stage} />
        ))}
      </Picker>

      <Text style={styles.label}>Destination</Text>
      <Picker selectedValue={destination} onValueChange={setDestination} style={styles.picker}>
        <Picker.Item label="Select Destination" value="" />
        {stages.filter((stage) => stage !== boarding).map((stage, index) => (
          <Picker.Item key={index} label={stage} value={stage} />
        ))}
      </Picker>

      <Text style={styles.label}>Ticket Count</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity onPress={handleDecrement} style={styles.counterButton}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text>{ticketCount}</Text>
        <TouchableOpacity onPress={handleIncrement} style={styles.counterButton}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Total Price: ₹{(ticketPrice * ticketCount).toFixed(2)}</Text>

      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.paymentContainer}>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === "Cash" && styles.selectedPayment]}
          onPress={() => setPaymentMethod("Cash")}
        >
          <Text>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === "Online" && styles.selectedPayment]}
          onPress={() => setPaymentMethod("Online")}
        >
          <Text>Online</Text>
        </TouchableOpacity>
      </View>

      <Button title="Issue Ticket" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  picker: { height: 50, width: "100%" },
  counterContainer: { flexDirection: "row", alignItems: "center" },
  counterButton: { padding: 10, backgroundColor: "#ddd", marginHorizontal: 10 },
  paymentContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  paymentOption: { padding: 10, backgroundColor: "#ddd" },
  selectedPayment: { backgroundColor: "#00f" },
});

export default EtmTicket;
