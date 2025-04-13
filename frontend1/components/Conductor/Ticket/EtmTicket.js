import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
  ActivityIndicator,
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
    BusData
  } = route.params;

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const RouteName = `${selectedFrom} - ${selectedTo}`;
  const [boarding, setBoarding] = useState("");
  const [destination, setDestination] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [Buspricedata, setBuspriceData] = useState({});
  const [ticketPrice, setTicketPrice] = useState(0);
  const [stages, setStages] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [availableSeats, setAvailableSeats] = useState(0);
  const [seatLoading, setSeatLoading] = useState(true);
  const [seatError, setSeatError] = useState(null);
  const fadeAnim = new Animated.Value(1);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const handleLocationSelect = async (item) => {
    setBoarding(item);
    setSelectedLocations((prev) => [...prev, item]); // Add to selected locations
    setShowLocationDropdown(false);
    try {
      setSeatLoading(true);
      const dest = item;
      const response = await axios.put(
        `${API_BASE_URL}/api/tickets/update/seats`,
        {
          selectedBusNo,
          busplateNo,
          RouteName,
          dest,
          selectedCity,
          selectedState,
        }
      );
      if (response.data) {
        setAvailableSeats(response.data.updatedAvailableSeats);
      }
    } catch {
    } finally {
      setSeatLoading(false);
    }
  };

  const resetDisabledLocations = () => {
    // Start the animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedLocations([]); // Clear after animation starts
    });
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/Admin/buses/getstages`,
          {
            busplateNo,
            selectedBusNo,
          }
        );

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
        const response = await axios.post(
          `${API_BASE_URL}/api/Admin/buses/getprice`,
          {
            selectedBusNo,
          }
        );

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
    const fetchSeatAvailability = async () => {
      try {
        setSeatLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/Admin/buses/seat-availability`,
          {
            params: {
              busplateNo,
              selectedBusNo,
              date: new Date().toISOString().split("T")[0],
            },
          }
        );
        console.log(response.data.data);
        setAvailableSeats(response.data.data); // Changed from response.data.availableSeats to response.data.data
        setSeatError(null);
      } catch (error) {
        setSeatError("Failed to load seat data");
        console.error("Seat availability error:", error);
      } finally {
        setSeatLoading(false);
      }
    };

    fetchSeatAvailability();
  }, [availableSeats]);

  useEffect(() => {
    if (boarding && destination && Buspricedata?.prices) {
      const normalizeRoute = (route) =>
        route
          .toLowerCase()
          .trim()
          .replace(/\s*-\s*/g, "-");

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
        Alert.alert(
          "Price Not Found",
          "No price available for the selected route."
        );
      }
    }
  }, [boarding, destination, Buspricedata]);

  const availableDestinations = boarding
    ? stages.filter((stage) => stage !== boarding)
    : stages;

  const handleIncrement = () => setTicketCount((prev) => prev + 1);
  const handleDecrement = () =>
    setTicketCount((prev) => (prev > 1 ? prev - 1 : prev));

  const handleSubmit = async () => {
    if (availableSeats <= 1){
     axios.post(`${API_BASE_URL}/api/buzzer/trigger`, { selectedBusNo: selectedBusNo });
      
    } 
    
    if (!boarding || !destination) {
      Alert.alert(
        "Selection Required",
        "Please select boarding and destination."
      );
      return;
    }
    
    if (ticketPrice === 0) {
      Alert.alert(
        "Price Not Available",
        "Cannot issue ticket without a valid price."
      );
      return;
    }
    
    if (!paymentMethod) {
      Alert.alert("Payment Method Required", "Please select a payment method.");
      return;
    }
    
    if (paymentMethod === "Online" && ticketCount >= 1) {
      const amount =  ticketPrice * ticketCount;
      const upiId = "thamilprakasam2005@okhdfcbank";
      navigation.navigate("Upiqr",{upiId, amount});
    }
    
    const ticketData = {
      routeName: RouteName,
      busRouteNo: selectedBusNo,
      busplateNo,
      boarding,
      destination,
      ticketCount,
      ticketPrice: ticketPrice * ticketCount,
      paymentMethod,
      selectedCity,
      selectedState,
      busId: BusData._id,
    };
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/tickets/add_ticket`,
        ticketData
      );
      console.log(response.data.message)
      if (response.data.success) {
        setAvailableSeats(availableSeats - ticketData.ticketCount);
        setTicketCount(1)
        navigation.navigate("ticsuccess", {method: "Cash"});

      } else {
        Alert.alert("Failed", "Could not issue ticket. Try again.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to issue ticket. Check your network connection."
      );
    }
  };

  return (
    <View style={styles.container}>
      
      {/* BUS DETAILS */}
      <View style={styles.cardheader}>
        <View style={styles.row}>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Route</Text>
            <Text style={styles.value}>{RouteName}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Bus No</Text>
            <Text style={styles.value}>{selectedBusNo}</Text>
          </View>
        </View>

        <View style={styles.seatsContainer}>
          {seatLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="small"
                color="#0000ff"
                style={styles.loadingIndicator}
              />
              <Text style={styles.loadingText}>Checking availability...</Text>
            </View>
          ) : (
            <Text style={styles.seatsText}>
              {availableSeats !== null
                ? `${availableSeats} seats available`
                : "Seat info not available"}
            </Text>
          )}
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setShowLocationDropdown(true)}
          >
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Mark the location</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showLocationDropdown}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { opacity: fadeAnim }, // Apply animation to entire modal
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Boarding Point</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowLocationDropdown(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetDisabledLocations}
            >
              <Animated.Text
                style={[
                  styles.resetButtonText,
                  {
                    transform: [
                      {
                        scale: fadeAnim.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [0.9, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                Reset Disabled Locations
              </Animated.Text>
            </TouchableOpacity>
            <FlatList
              data={stages}
              renderItem={({ item }) => {
                const isDisabled = selectedLocations.includes(item);
                return (
                  <Animated.View
                    style={{
                      opacity: isDisabled
                        ? fadeAnim.interpolate({
                            inputRange: [0.3, 1],
                            outputRange: [0.5, 1],
                          })
                        : 1,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.locationItem,
                        isDisabled && styles.disabledLocationItem,
                        boarding === item && styles.selectedLocationItem,
                      ]}
                      onPress={() => !isDisabled && handleLocationSelect(item)}
                      disabled={isDisabled}
                    >
                      <Text
                        style={[
                          styles.locationItemText,
                          isDisabled && styles.disabledText,
                        ]}
                      >
                        {item}
                      </Text>
                      {boarding === item && (
                        <Text style={styles.selectedIcon}>✓</Text>
                      )}
                      {isDisabled && boarding !== item && (
                        <Animated.Text
                          style={[
                            styles.disabledIcon,
                            {
                              transform: [
                                {
                                  rotate: fadeAnim.interpolate({
                                    inputRange: [0.3, 1],
                                    outputRange: ["-10deg", "0deg"],
                                  }),
                                },
                              ],
                            },
                          ]}
                        >
                          ✕
                        </Animated.Text>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
            />
            {/* ... close button */}
          </Animated.View>
        </View>
      </Modal>

      {/* BOARDING & DESTINATION */}
      <View style={styles.card}>
        <Text style={styles.label}>Boarding Point</Text>
        <Picker
          selectedValue={boarding}
          onValueChange={setBoarding}
          style={styles.picker}
        >
          <Picker.Item label="Select Boarding" value="" />
          {stages.map((stage, index) => (
            <Picker.Item key={index} label={stage} value={stage} />
          ))}
        </Picker>

        <Text style={styles.label}>Destination</Text>
        <Picker
          selectedValue={destination}
          onValueChange={setDestination}
          style={styles.picker}
        >
          <Picker.Item label="Select Destination" value="" />
          {availableDestinations.map((stage, index) => (
            <Picker.Item key={index} label={stage} value={stage} />
          ))}
        </Picker>
      </View>

      {/* TICKET COUNTER */}
      <View style={styles.card}>
        <Text style={styles.label}>Ticket Count</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            onPress={handleDecrement}
            style={styles.counterButton}
          >
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{ticketCount}</Text>
          <TouchableOpacity
            onPress={handleIncrement}
            style={styles.counterButton}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PRICE */}
      <View style={styles.card}>
        <Text style={styles.label}>Total Price</Text>
        <TextInput
          style={styles.input}
          value={(ticketPrice * ticketCount).toFixed(2).toString()}
          editable={false}
        />
      </View>

      {/* PAYMENT METHOD */}
      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.paymentContainer}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "Cash" && styles.selectedPayment,
          ]}
          onPress={() => handlePaymentSelection("Cash")}
        >
          <Text style={styles.paymentText}>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "Online" && styles.selectedPayment,
          ]}
          onPress={() => handlePaymentSelection("Online")}
        >
          <Text style={styles.paymentText}>Online</Text>
        </TouchableOpacity>
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Issue Ticket</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EtmTicket;