import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import styles from "./EtmTicketStyles";
import { API_BASE_URL } from "../../../apiurl";

const EtmTicket = ({ route, navigation }) => {
  const {
    selectedFrom,
    selectedTo,
    selectedBusNo,
    busplateNo,
    selectedCity,
    selectedState,
  } = route.params;

  const RouteName = `${selectedFrom} - ${selectedTo}`;
  const [boarding, setBoarding] = useState("");
  const [destination, setDestination] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [Buspricedata, setBuspriceData] = useState({});
  const [ticketPrice, setTicketPrice] = useState(0);
  const [stages, setStages] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    const fetchStages = async () => {
      if (!busplateNo || !selectedBusNo) return;

      try {
        const response = await axios.post(`${API_BASE_URL}/api/Admin/buses/getstages`, {
          busplateNo,
          selectedBusNo,
        });

        if (response.data.success && Array.isArray(response.data.stages)) {
          setStages(response.data.stages);
        } else {
          setStages([]);
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
        setStages([]);
      }
    };

    const fetchPrice = async () => {
      if (!selectedBusNo) return;

      try {
        const response = await axios.post(`${API_BASE_URL}/api/Admin/buses/getprice`, {
          selectedBusNo,
        });

        if (response.data.success) {
          setBuspriceData(response.data.data);
        } else {
          setBuspriceData({});
        }
      } catch (error) {
        console.error("Error fetching ticket price:", error);
        setBuspriceData({});
      }
    };

    fetchStages();
    fetchPrice();
  }, [busplateNo, selectedBusNo]);

  useEffect(() => {
    if (boarding && destination && Buspricedata?.prices) {
      const normalizeRoute = (route) =>
        route.toLowerCase().trim().replace(/\s*-\s*/g, "-");

      const RouteName1 = normalizeRoute(`${boarding}-${destination}`);
      const RouteName2 = normalizeRoute(`${destination}-${boarding}`);

      let foundPrice = 0;

      Object.keys(Buspricedata.prices).forEach((route) => {
        const normalizedRoute = normalizeRoute(route);

        if (normalizedRoute === RouteName1 || normalizedRoute === RouteName2) {
          foundPrice = parseFloat(Buspricedata.prices[route]);
        }
      });

      if (foundPrice) {
        setTicketPrice(foundPrice);
      } else {
        setTicketPrice(0);
        Alert.alert("Price Not Found", "No price available for the selected route.");
      }
    }
  }, [boarding, destination, Buspricedata]);

  const availableDestinations = boarding
    ? stages.filter((stage) => stage !== boarding)
    : stages;

  const handleIncrement = () => setTicketCount((prev) => prev + 1);
  const handleDecrement = () => setTicketCount((prev) => (prev > 1 ? prev - 1 : prev));

  const handleSubmit = async () => {
    if (!boarding || !destination) {
      Alert.alert("Selection Required", "Please select boarding and destination.");
      return;
    }

    if (ticketPrice === 0) {
      Alert.alert("Price Not Available", "Cannot issue ticket without a valid price.");
      return;
    }

    if (!paymentMethod) {
      Alert.alert("Payment Method Required", "Please select a payment method.");
      return;
    }

    const ticketData = {
      routeName: RouteName,
      BusNo: selectedBusNo,
      busplateNo,
      boarding,
      destination,
      ticketCount,
      ticketPrice: ticketPrice * ticketCount,
      paymentMethod,
      selectedCity,
      selectedState,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/tickets/add_ticket`, ticketData);

      if (response.data.success) {
        navigation.navigate("ticsuccess");
      } else {
        Alert.alert("Failed", "Could not issue ticket. Try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to issue ticket. Check your network connection.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <Text style={styles.label}>Route Name</Text>
          <Text style={styles.value}>{RouteName}</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.label}>Bus No</Text>
          <Text style={styles.value}>{selectedBusNo}</Text>
        </View>
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
        {availableDestinations.map((stage, index) => (
          <Picker.Item key={index} label={stage} value={stage} />
        ))}
      </Picker>

      <Text style={styles.label}>Ticket Count</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity onPress={handleDecrement} style={styles.counterButton}>
          <Text style={styles.counterText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{ticketCount}</Text>
        <TouchableOpacity onPress={handleIncrement} style={styles.counterButton}>
          <Text style={styles.counterText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Total Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Price per Ticket"
        keyboardType="numeric"
        value={(ticketPrice * ticketCount).toFixed(2).toString()}
        editable={false}
      />

      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.paymentContainer}>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === "Cash" && styles.selectedPayment]}
          onPress={() => handlePaymentSelection("Cash")}
        >
          <Text style={styles.paymentText}>Cash</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === "Online" && styles.selectedPayment]}
          onPress={() => handlePaymentSelection("Online")}
        >
          <Text style={styles.paymentText}>Online</Text>
        </TouchableOpacity>
      </View>

      <Button title="Issue Ticket" onPress={handleSubmit} />
    </View>
  );
};

export default EtmTicket;
