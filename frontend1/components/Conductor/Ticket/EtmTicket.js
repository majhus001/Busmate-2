import React, { useState, useEffect, useRef, useCallback } from "react";
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
  ScrollView,
  SafeAreaView,
  RefreshControl,
  BackHandler,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import styles from "./EtmTicketStyles";
import { API_BASE_URL } from "../../../apiurl";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const EtmTicket = ({ route, navigation }) => {
  const {
    selectedFrom,
    selectedTo,
    selectedBusNo,
    busplateNo,
    selectedCity,
    selectedState,
    BusData,
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
  const [nextStop, setNextStop] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [seatLoading, setSeatLoading] = useState(true);
  const [seatError, setSeatError] = useState(null);
  const fadeAnim = new Animated.Value(1);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // New state variables for enhanced features
  const [currentTime, setCurrentTime] = useState(new Date());
  const [journeyTime, setJourneyTime] = useState(0); // in minutes
  const [showSummary, setShowSummary] = useState(false);
  const [quickTickets, setQuickTickets] = useState([]);
  const [selectedQuickTicket, setSelectedQuickTicket] = useState(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Animation refs
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const handleLocationSelect = async (item) => {
    setBoarding(item);
    setSelectedLocations((prev) => [...prev, item]);
    setShowLocationDropdown(false);

    // Find and set next stop
    const currentIndex = stages.indexOf(item);
    if (currentIndex !== -1 && currentIndex < stages.length - 1) {
      setNextStop(stages[currentIndex + 1]);
    } else {
      setNextStop(null);
    }

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
      if (!response.data.success) {
        setAvailableSeats(availableSeats);
      }

      console.log(
        "--------------av seats man",
        response.data.updatedAvailableSeats
      );

      const onlineresponse = await axios.put(
        `${API_BASE_URL}/api/payment/update/seats`,
        {
          selectedBusNo,
          dest,
          selectedCity,
          selectedState,
        }
      );
      console.log(
        "----------------av seats in omline ",
        onlineresponse.data.updatedAvailableSeats
      );
      console.log(
        "----------------av seats in before ",
        availableSeats
      );
      if (!onlineresponse.data.success && !response.data.success) {
        console.log("av seats ifnot", availableSeats )
        setAvailableSeats(availableSeats);
      }
      if (response.data.success) {
        console.log("av seats man res", availableSeats )
        
        setAvailableSeats(response.data.updatedAvailableSeats);
      }
      if (onlineresponse.data.success) {
        console.log("av seats online res", availableSeats )
        
        setAvailableSeats(onlineresponse.data.updatedAvailableSeats);
      }
    } catch {
    } finally {
      setSeatLoading(false);
    }
  };

  const resetDisabledLocations = () => {
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
      setSelectedLocations([]);
      setNextStop(null);
    });
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
  };

  // Animation functions
  const runAnimations = () => {
    // Reset animations
    fadeAnim1.setValue(0);
    fadeAnim2.setValue(0);
    slideAnim.setValue(50);

    // Run animations in sequence
    Animated.sequence([
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // Clock timer function
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const journeyTimer = setInterval(() => {
      setJourneyTime((prev) => prev + 1);
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(journeyTimer);
    };
  }, []);

  // Function to refresh all data
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchStages(),
        fetchPrice(),
        fetchTickets(),
        fetchSeatAvailability(),
      ]);
      console.log("✅ Data refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [busplateNo, selectedBusNo]);

  // Handle back button press - logout bus when going back
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Confirm Exit",
          "Are you sure you want to go back? The bus will be logged out.",
          [
            { text: "Cancel", style: "cancel", onPress: () => {} },
            {
              text: "Confirm",
              style: "destructive",
              onPress: async () => {
                try {
                  if (BusData && BusData._id) {
                    await axios.put(
                      `${API_BASE_URL}/api/Admin/buses/logout/${BusData._id}`
                    );
                  }
                  navigation.pop(2);
                } catch (error) {
                  console.error("❌ Error logging out bus:", error);
                }
              },
            },
          ],
          { cancelable: true }
        );
        return true; // Prevent default back button behavior
      };

      // Add back button handler
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Clean up when screen loses focus
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation, BusData, selectedBusNo])
  );

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

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
        // Run animations after data is loaded
        runAnimations();
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
      // Get conductor ID from BusData if available
      const conductorId = BusData?.conductorId || null;

      const response = await axios.post(
        `${API_BASE_URL}/api/Admin/buses/getprice`,
        {
          selectedBusNo,
          conductorId,
        }
      );

      if (response.data.success) {
        setBuspriceData(response.data.data);

        // Generate quick tickets based on popular routes if available
        if (
          response.data.popularRoutes &&
          response.data.popularRoutes.length > 0
        ) {
          console.log("✅ Using popular routes for quick tickets");
          const quickTicketsData = [];

          // Process popular routes
          for (const popularRoute of response.data.popularRoutes) {
            const route = popularRoute.route;
            const [from, to] = route.split("-").map((s) => s.trim());

            // Find the price for this route
            const price = response.data.data.prices[route] || "0";

            quickTicketsData.push({
              id: quickTicketsData.length + 1,
              from,
              to,
              price: parseFloat(price),
              route,
              frequency: popularRoute.count, // Add frequency information
              lastUsed: new Date(popularRoute.lastUsed), // Add last used date
            });
          }

          setQuickTickets(quickTicketsData);
        }
        // Fallback to default method if no popular routes
        else if (response.data.data.prices) {
          console.log("ℹ️ Using default routes for quick tickets");
          const quickTicketsData = [];
          Object.entries(response.data.data.prices)
            .slice(0, 4)
            .forEach(([route, price]) => {
              const [from, to] = route.split("-").map((s) => s.trim());
              quickTicketsData.push({
                id: quickTicketsData.length + 1,
                from,
                to,
                price: parseFloat(price),
                route,
              });
            });
          setQuickTickets(quickTicketsData);
        }
      } else {
        setBuspriceData({});
      }
    } catch (error) {
      console.error("Error fetching ticket price:", error);
      setBuspriceData({});
    }
  };

  const fetchTickets = async () => {
    try {
      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Fetch onboard tickets (from tickets collection)
      const onboardResponse = await axios.get(
        `${API_BASE_URL}/api/tickets/bus-tickets/${selectedBusNo}`,
        {
          params: {
            date: currentDate,
          },
        }
      );

      const onlineResponse = await axios.get(
        `${API_BASE_URL}/api/payment/bus-tickets/${selectedBusNo}`,
        {
          params: {
            date: currentDate,
          },
        }
      );

      // Store the fetched tickets in state
      const ticketsData = {
        onboardTickets: onboardResponse.data.tickets || [],
        onlineTickets: onlineResponse.data.tickets || [],
      };

      // Store the tickets data to pass to ViewTickets screen
      global.ticketsData = ticketsData;
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStages();
    fetchPrice();
    fetchTickets();
  }, [busplateNo, selectedBusNo]);

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
      setAvailableSeats(response.data.data);
      setSeatError(null);
    } catch (error) {
      setSeatError("Failed to load seat data");
      console.error("Seat availability error:", error);
    } finally {
      setSeatLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatAvailability();
  }, [busplateNo, selectedBusNo]);

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

  // Function to handle quick ticket selection
  const handleQuickTicketSelect = (ticket) => {
    setSelectedQuickTicket(ticket);
    setBoarding(ticket.from);
    setDestination(ticket.to);
    setTicketPrice(ticket.price);

    // Find and set current stop index
    const fromIndex = stages.indexOf(ticket.from);
    if (fromIndex !== -1) {
      setCurrentStopIndex(fromIndex);
    }

    // Find and set next stop
    if (fromIndex !== -1 && fromIndex < stages.length - 1) {
      setNextStop(stages[fromIndex + 1]);
    }
  };

  // Function to show ticket summary
  const showTicketSummaryModal = () => {
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

    // Show summary modal
    setShowSummary(true);
  };

  const handleSubmit = async () => {
    if (availableSeats <= 1) {
      axios.post(`${API_BASE_URL}/api/buzzer/trigger`, {
        selectedBusNo: selectedBusNo,
      });
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
      const amount = ticketPrice * ticketCount;
      const upiId = "thamilprakasam2005@okhdfcbank";

      // Create ticket data
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
        busId: BusData?._id,
      };

      global.pendingTicketData = ticketData;

      // Navigate to Upiqr with amount and upiId
      navigation.navigate("Upiqr", { upiId, amount });
      return;
    }

    // Create ticket data
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
      busId: BusData?._id,
    };

    try {
      // Start loading animation
      Animated.sequence([
        Animated.timing(fadeAnim1, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const response = await axios.post(
        `${API_BASE_URL}/api/tickets/add_ticket`,
        ticketData
      );

      if (response.data.success) {
        // Update available seats
        setAvailableSeats(availableSeats - ticketData.ticketCount);
        setTicketCount(1);
        setShowSummary(false);

        // Success animation
        Animated.sequence([
          Animated.timing(fadeAnim2, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim2, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Navigate to success screen
          navigation.navigate("ticsuccess", { method: paymentMethod });
        });
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            colors={["#3b82f6"]}
            tintColor={"#3b82f6"}
          />
        }
      >
        {/* Clock and Timer */}
        <View style={styles.clockContainer}>
          <View style={styles.clockItem}>
            <Text style={styles.clockLabel}>Current Time</Text>
            <Text style={styles.clockValue}>
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <View style={styles.clockItem}>
            <Text style={styles.clockLabel}>Journey Time</Text>
            <Text style={styles.clockValue}>
              {Math.floor(journeyTime / 60)}h {journeyTime % 60}m
            </Text>
          </View>
        </View>

        {/* BUS DETAILS */}
        <Animated.View
          style={[
            styles.cardheader,
            {
              opacity: fadeAnim1,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Route</Text>
              <Text style={styles.value}>{RouteName}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Bus No</Text>
              <Text style={styles.value}>{selectedBusNo}</Text>
            </View>
            <View style={styles.infoBox}>
              <TouchableOpacity
                style={styles.ticketsButton}
                onPress={() =>
                  navigation.navigate("ViewTickets", {
                    busRouteNo: selectedBusNo,
                    ticketsData: global.ticketsData,
                  })
                }
              >
                <MaterialIcons name="receipt" size={18} color="#fff" />
                <Text style={styles.ticketsButtonText}>Tickets</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.seatsContainer}>
            {seatLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="small"
                  color="#3b82f6"
                  style={styles.loadingIndicator}
                />
                <Text style={styles.loadingText}>Checking availability...</Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.seatsText,
                  { color: availableSeats <= 5 ? "#e53e3e" : "#2e8b57" },
                ]}
              >
                {availableSeats !== null
                  ? `${availableSeats} seats available`
                  : "Seat info not available"}
              </Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={styles.locationButtonsContainer}>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() => setShowLocationDropdown(true)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="location-pin" size={20} color="#dbeafe" />
                <Text style={styles.locationText}>Mark Location</Text>
              </TouchableOpacity>

              {nextStop && (
                <View style={styles.nextStopContainer}>
                  <Text style={styles.nextStopLabel}>Next Stop:</Text>
                  <View style={styles.nextStopValueContainer}>
                    <MaterialIcons
                      name="arrow-forward"
                      size={16}
                      color="#fff"
                    />
                    <Text style={styles.nextStopValue}>{nextStop}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Journey Progress */}
        {stages.length > 0 && boarding && (
          <Animated.View
            style={[
              styles.journeyProgressContainer,
              {
                opacity: fadeAnim2,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.journeyTitle}>Journey Progress</Text>

            <View style={styles.progressTrack}>
              {/* Progress fill based on current stop */}
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(currentStopIndex / (stages.length - 1)) * 100}%`,
                  },
                ]}
              />

              {/* Stop dots */}
              {stages.map((stage, index) => {
                const position = `${(index / (stages.length - 1)) * 100}%`;
                const isActive = boarding === stage;
                const isCompleted = stages.indexOf(boarding) > index;

                return (
                  <View key={index}>
                    <View
                      style={[
                        styles.stopDot,
                        isActive && styles.activeDot,
                        isCompleted && styles.completedDot,
                        { left: position },
                      ]}
                    />
                    {(index === 0 ||
                      index === stages.length - 1 ||
                      isActive ||
                      index % Math.ceil(stages.length / 5) === 0) && (
                      <Text
                        style={[
                          styles.stopLabel,
                          isActive && styles.activeLabel,
                          { left: position },
                        ]}
                        numberOfLines={1}
                      >
                        {stage}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Quick Tickets */}
        {quickTickets.length > 0 && (
          <Animated.View
            style={[
              styles.quickTicketContainer,
              {
                opacity: fadeAnim2,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.quickTicketTitle}>Quick Tickets</Text>
            <View style={styles.quickTicketsRow}>
              {quickTickets.map((ticket) => (
                <TouchableOpacity
                  key={ticket.id}
                  style={[
                    styles.quickTicketItem,
                    selectedQuickTicket?.id === ticket.id &&
                      styles.quickTicketItemActive,
                  ]}
                  onPress={() => handleQuickTicketSelect(ticket)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickTicketRoute}>
                    {ticket.from} → {ticket.to}
                  </Text>
                  <View style={styles.quickTicketDetails}>
                    <Text style={styles.quickTicketPrice}>
                      ₹{ticket.price.toFixed(2)}
                    </Text>
                    {ticket.frequency && (
                      <View style={styles.frequencyBadge}>
                        <Text style={styles.frequencyText}>
                          {ticket.frequency}x
                        </Text>
                      </View>
                    )}
                  </View>
                  {ticket.lastUsed && (
                    <Text style={styles.lastUsedText}>
                      {ticket.lastUsed.toLocaleDateString()}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        <Modal
          visible={showLocationDropdown}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Arrived Point</Text>
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
                        onPress={() =>
                          !isDisabled && handleLocationSelect(item)
                        }
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={showTicketSummaryModal}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Preview & Issue Ticket</Text>
          </TouchableOpacity>
        </View>

        {/* Ticket Summary Modal */}
        <Modal visible={showSummary} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <Animated.View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Ticket Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Route</Text>
                <Text style={styles.summaryValue}>{RouteName}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Boarding</Text>
                <Text style={styles.summaryValue}>{boarding}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Destination</Text>
                <Text style={styles.summaryValue}>{destination}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tickets</Text>
                <Text style={styles.summaryValue}>{ticketCount}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Price per ticket</Text>
                <Text style={styles.summaryValue}>
                  ₹{ticketPrice.toFixed(2)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Payment Method</Text>
                <Text style={styles.summaryValue}>{paymentMethod}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryTotal}>
                  ₹{(ticketPrice * ticketCount).toFixed(2)}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: "#e2e8f0", flex: 1, marginRight: 8 },
                  ]}
                  onPress={() => setShowSummary(false)}
                >
                  <Text style={[styles.buttonText, { color: "#4a5568" }]}>
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { flex: 1, marginLeft: 8 }]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Confirm & Issue</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EtmTicket;
