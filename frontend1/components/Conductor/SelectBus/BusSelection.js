import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  TextInput,
  Animated,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../../apiurl";
import styles, { pickerSelectStyles } from "./BusSelectionStyles";

const BusSelection = ({ navigation, route }) => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Basic selection state
  const [selectedState, setSelectedState] = useState(null);
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [fromLocations, setFromLocations] = useState([]);
  const [toLocations, setToLocations] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [busNumbers, setBusNumbers] = useState([]);
  const [selectedBusNo, setSelectedBusNo] = useState(null);
  const [busplateNo, setBusplateNo] = useState("");
  const [error, setError] = useState(null);

  // Enhanced features state
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSelections, setRecentSelections] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showMapPreview, setShowMapPreview] = useState(false);
  const [intermediateStages, setIntermediateStages] = useState([]);
  const [filteredBusData, setFilteredBusData] = useState([]);

  // Check for preselected bus from route params (from conductor home screen)
  useEffect(() => {
    if (route?.params?.preselectedBus) {
      const bus = route.params.preselectedBus;
      setSelectedState(bus.state);
      setSelectedCity(bus.city);
      setSelectedFrom(bus.fromStage);
      setSelectedTo(bus.toStage);
      setSelectedBusNo(bus.busRouteNo);
      setBusplateNo(bus.busNo);
    }
  }, [route?.params?.preselectedBus]);

  // Animation functions
  const fadeIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Load recent selections from storage
  const loadRecentSelections = async () => {
    try {
      const storedSelections = await SecureStore.getItemAsync('recentBusSelections');
      if (storedSelections) {
        setRecentSelections(JSON.parse(storedSelections));
      }
    } catch (error) {
      console.error('Error loading recent selections:', error);
    }
  };

  // Save current selection to recent selections
  const saveToRecentSelections = async () => {
    if (!selectedState || !selectedCity || !selectedFrom || !selectedTo || !selectedBusNo) return;

    try {
      const newSelection = {
        id: Date.now().toString(),
        state: selectedState,
        city: selectedCity,
        from: selectedFrom,
        to: selectedTo,
        busRouteNo: selectedBusNo,
        busNo: busplateNo,
        timestamp: new Date().toISOString(),
      };

      let updatedSelections = [newSelection];

      const storedSelections = await SecureStore.getItemAsync('recentBusSelections');
      if (storedSelections) {
        const parsedSelections = JSON.parse(storedSelections);
        // Add new selection and limit to 5 most recent
        updatedSelections = [newSelection, ...parsedSelections.filter(
          s => s.busRouteNo !== selectedBusNo
        )].slice(0, 5);
      }

      await SecureStore.setItemAsync('recentBusSelections', JSON.stringify(updatedSelections));
      setRecentSelections(updatedSelections);
    } catch (error) {
      console.error('Error saving recent selection:', error);
    }
  };

  // Use a recent selection
  const useRecentSelection = async (selection) => {
    try {
      setLoading(true);
      setError(null);

      // Clear search query
      setSearchQuery('');

      // Set state and fetch buses
      setSelectedState(selection.state);
      await fetchBusesByState(selection.state);

      // Set city and fetch stages
      setSelectedCity(selection.city);
      await fetchStagesByCity(selection.city);

      // Set from and to locations
      setSelectedFrom(selection.from);
      setSelectedTo(selection.to);

      // Fetch bus numbers for the route
      await fetchBusNumbers(selection.from, selection.to);

      // Set bus number and plate
      setSelectedBusNo(selection.busRouteNo);
      setBusplateNo(selection.busNo);

      // Show map preview
      setShowMapPreview(true);

      // Save this selection to recent selections
      await saveToRecentSelections();

      // Update the current step to show we've completed the selection
      setCurrentStep(5);
    } catch (error) {
      console.error('Error using recent selection:', error);
      setError('Failed to load the selected route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update current step based on selections
  useEffect(() => {
    if (selectedBusNo) setCurrentStep(5);
    else if (selectedTo) setCurrentStep(4);
    else if (selectedFrom) setCurrentStep(3);
    else if (selectedCity) setCurrentStep(2);
    else if (selectedState) setCurrentStep(1);
    else setCurrentStep(1);
  }, [selectedState, selectedCity, selectedFrom, selectedTo, selectedBusNo]);

  // Run animations when component mounts
  useEffect(() => {
    fadeIn();
    loadRecentSelections();
  }, []);

  // Reset all selections except state when state changes
  const resetSelections = (keepState = false) => {
    if (!keepState) setSelectedState(null);
    setSelectedCity(null);
    setFromLocations([]);
    setToLocations([]);
    setSelectedFrom(null);
    setSelectedTo(null);
    setBusNumbers([]);
    setBusplateNo("");
    setError(null);
    setCurrentStep(keepState ? 1 : 1);
  };

  const fetchAllBuses = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchAllBuses`
      );
      if (response.data && response.data.length > 0) {
        setFilteredBusData(response.data);
      }
    } catch (err) {
      console.error("Error fetching all buses:", err);
    }
  }, []);

  // Fetch states only once when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchStates = async () => {
        if (states.length === 0) {
          setLoading(true);
          try {
            const response = await axios.get(
              `${API_BASE_URL}/api/busroutes/getstates`
            );
            if (response.data && response.data.states) {
              setStates(response.data.states);
            } else {
              setError("No states available");
            }
          } catch (err) {
            setError("Failed to fetch states");
            console.error("Error fetching states:", err);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchStates();
      fetchAllBuses(); // Fetch all buses for search
      return () => resetSelections(true); // Cleanup on unmount
    }, [states.length, fetchAllBuses])
  );

  // Fetch buses by state
  const fetchBusesByState = useCallback(async (state) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchstate`,
        { params: { state } }
      );
      if (response.data && response.data.length > 0) {
        setBusData(response.data);
      } else {
        setError("No buses available for selected state");
        setBusData([]);
      }
    } catch (err) {
      setError("Failed to fetch buses");
      console.error("Error fetching buses:", err);
      setBusData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stages by city
  const fetchStagesByCity = useCallback(async (city) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchcities`,
        { params: { city } }
      );
      if (response.data) {
        setFromLocations(response.data.fromStages || []);
        setToLocations(response.data.toStages || []);
        if (!response.data.fromStages || !response.data.toStages) {
          setError("No stages available for selected city");
        }
      }
    } catch (err) {
      setError("Failed to fetch stages");
      console.error("Error fetching stages:", err);
      setFromLocations([]);
      setToLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch bus numbers
  const fetchBusNumbers = useCallback(async (from, to) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Admin/buses/fetchbusno`,
        { params: { from, to } }
      );
      if (response.data && response.data.busNumbers) {
        setBusNumbers(response.data.busNumbers);
        if (response.data.busNumbers.length === 0) {
          setError("No buses available for selected route");
        }
      } else {
        setBusNumbers([]);
        setError("No bus data available");
      }
    } catch (err) {
      setError("Failed to fetch bus numbers");
      console.error("Error fetching bus numbers:", err);
      setBusNumbers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search functionality
  useEffect(() => {
    // If search query is empty and a state is selected, show buses for that state
    if (searchQuery.trim() === '') {
      if (selectedState) {
        // If a state is selected, keep showing the buses for that state
        return;
      } else {
        // If no state is selected, show all buses
        fetchAllBuses();
      }
      return;
    }

    // When searching, use the complete bus data (not just the current state)
    const query = searchQuery.toLowerCase();

    // Fetch all buses again to ensure we have the latest data
    axios.get(`${API_BASE_URL}/api/Admin/buses/fetchAllBuses`)
      .then(response => {
        if (response.data && response.data.length > 0) {
          const allBuses = response.data;

          // Filter buses based on search query
          const filtered = allBuses.filter(bus =>
            (bus.busRouteNo?.toLowerCase() || '').includes(query) ||
            (bus.busNo?.toLowerCase() || '').includes(query) ||
            (bus.fromStage?.toLowerCase() || '').includes(query) ||
            (bus.toStage?.toLowerCase() || '').includes(query) ||
            (bus.city?.toLowerCase() || '').includes(query) ||
            (bus.state?.toLowerCase() || '').includes(query)
          );

          setFilteredBusData(filtered);

          // If we have search results, show them as suggestions
          if (filtered.length > 0) {
            // Clear any previous error messages
            setError(null);

            // Create a search results section
            const searchResultsSection = (
              <View style={styles.searchResultsContainer}>
                <Text style={styles.searchResultsTitle}>
                  <MaterialIcons name="search" size={20} color="#3182CE" style={{marginRight: 8}} />
                  Search Results
                </Text>
                {filtered.slice(0, 3).map((bus, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.searchResultItem}
                    onPress={() => useRecentSelection({
                      id: Date.now().toString(),
                      state: bus.state,
                      city: bus.city,
                      from: bus.fromStage,
                      to: bus.toStage,
                      busRouteNo: bus.busRouteNo,
                      busNo: bus.busNo,
                    })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.searchResultContent}>
                      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                        <MaterialIcons name="directions" size={16} color="#3182CE" style={{marginRight: 6}} />
                        <Text style={styles.searchResultRoute}>{bus.fromStage} → {bus.toStage}</Text>
                      </View>

                      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                        <MaterialIcons name="directions-bus" size={16} color="#4A5568" style={{marginRight: 6}} />
                        <Text style={styles.searchResultBus}>Bus: {bus.busRouteNo} ({bus.busNo})</Text>
                      </View>

                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialIcons name="location-city" size={16} color="#718096" style={{marginRight: 6}} />
                        <Text style={styles.searchResultLocation}>{bus.city}, {bus.state}</Text>
                      </View>
                    </View>

                    <View style={{backgroundColor: '#EBF8FF', padding: 8, borderRadius: 20}}>
                      <MaterialIcons name="arrow-forward" size={20} color="#3182CE" />
                    </View>
                  </TouchableOpacity>
                ))}
                {filtered.length > 3 && (
                  <Text style={styles.moreResultsText}>
                    <MaterialIcons name="info" size={14} color="#718096" style={{marginRight: 4}} />
                    {filtered.length - 3} more results found. Refine your search.
                  </Text>
                )}
              </View>
            );

            // Set the search results as the error content (we're repurposing the error container)
            setError(searchResultsSection);
          } else {
            setError(
              <View style={{alignItems: 'center', padding: 10}}>
                <MaterialIcons name="search-off" size={40} color="#A0AEC0" style={{marginBottom: 10}} />
                <Text style={{fontSize: 16, color: '#4A5568', textAlign: 'center'}}>
                  No buses found matching your search criteria.
                </Text>
                <Text style={{fontSize: 14, color: '#718096', textAlign: 'center', marginTop: 5}}>
                  Try different keywords or check your spelling.
                </Text>
              </View>
            );
          }
        }
      })
      .catch(err => {
        console.error("Error fetching buses for search:", err);
        setError(
          <View style={{alignItems: 'center', padding: 10}}>
            <MaterialIcons name="error-outline" size={40} color="#FC8181" style={{marginBottom: 10}} />
            <Text style={{fontSize: 16, color: '#E53E3E', textAlign: 'center'}}>
              Error searching for buses
            </Text>
            <Text style={{fontSize: 14, color: '#718096', textAlign: 'center', marginTop: 5}}>
              Please check your connection and try again.
            </Text>
          </View>
        );
      });
  }, [searchQuery, fetchAllBuses]);

  // Effect hooks for data fetching
  useEffect(() => {
    if (selectedState) {
      fetchBusesByState(selectedState);
    }
  }, [selectedState, fetchBusesByState]);

  useEffect(() => {
    if (selectedCity) {
      fetchStagesByCity(selectedCity);
    }
  }, [selectedCity, fetchStagesByCity]);

  // Function to fetch intermediate stages
  const fetchIntermediateStages = useCallback(async (city, from, to) => {
    if (!city || !from || !to) return;

    try {
      // First, get all stages for the city
      const response = await axios.post(
        `${API_BASE_URL}/api/busroutes/getstages`,
        { selectedCity: city, state: selectedState }
      );

      if (response.data.success && Array.isArray(response.data.stages)) {
        const allStages = response.data.stages;

        // Find the indices of the from and to stages
        const fromIndex = allStages.indexOf(from);
        const toIndex = allStages.indexOf(to);

        // If both stages are found and they're in the correct order
        if (fromIndex !== -1 && toIndex !== -1) {
          // If from comes before to, get all stages in between
          if (fromIndex < toIndex) {
            setIntermediateStages(allStages.slice(fromIndex + 1, toIndex));
          }
          // If to comes before from (reverse route), get all stages in between in reverse order
          else if (toIndex < fromIndex) {
            setIntermediateStages(allStages.slice(toIndex + 1, fromIndex).reverse());
          }
          // If they're the same, there are no intermediate stages
          else {
            setIntermediateStages([]);
          }
        } else {
          // If we can't find the stages in order, try to get stages from the bus data
          const busWithRoute = busData.find(bus =>
            bus.fromStage === from && bus.toStage === to && bus.city === city
          );

          if (busWithRoute && busWithRoute.timings) {
            // Get all stages from the timings map and filter out from and to
            const stagesFromTimings = Object.keys(busWithRoute.timings)
              .filter(stage => stage !== from && stage !== to);
            setIntermediateStages(stagesFromTimings);
          } else {
            setIntermediateStages([]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching intermediate stages:', error);
      setIntermediateStages([]);
    }
  }, [selectedState, busData]);

  useEffect(() => {
    if (selectedFrom && selectedTo) {
      fetchBusNumbers(selectedFrom, selectedTo);
      fetchIntermediateStages(selectedCity, selectedFrom, selectedTo);
      setShowMapPreview(true);
    } else {
      setShowMapPreview(false);
      setIntermediateStages([]);
    }
  }, [selectedFrom, selectedTo, selectedCity, fetchBusNumbers, fetchIntermediateStages]);

  // Update bus plate number
  useEffect(() => {
    if (selectedBusNo && busData.length > 0) {
      const foundBus = busData.find((bus) => bus.busRouteNo === selectedBusNo);
      setBusplateNo(foundBus ? foundBus.busNo : "");
    }
  }, [selectedBusNo, busData]);

  const handlebuslogin = async () => {
    if (!busplateNo) {
      Alert.alert("Error", "Please select a valid bus");
      return;
    }

    // Save to recent selections before navigating
    await saveToRecentSelections();

    navigation.navigate("buslogin", {
      busplateNo,
      selectedFrom,
      selectedTo,
      selectedBusNo,
      selectedCity,
      selectedState,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <View style={styles.container}>
        <View style={styles.headerBackground} />

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.fullscreenLoader}>
            <View style={styles.loadingAnimation}>
              <ActivityIndicator size="large" color="#3182CE" />
            </View>
            <Text style={styles.loadingText}>Loading options...</Text>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            style={[styles.header, {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }]}
          >
            <MaterialIcons
              name="directions-bus"
              size={40}
              color="#007AFF"
              style={styles.icon}
            />
            <Text style={styles.title}>Select Your Bus</Text>
            <Text style={styles.subtitle}>Choose your route and bus number</Text>
          </Animated.View>

          {/* Step Indicator */}
          <View style={styles.stepIndicatorContainer}>
            {[1, 2, 3, 4, 5].map((step) => (
              <View key={step} style={styles.stepItem}>
                <View style={[
                  styles.stepCircle,
                  currentStep === step && styles.stepCircleActive,
                  currentStep > step && styles.stepCircleCompleted
                ]}>
                  <Text style={[
                    styles.stepNumber,
                    (currentStep === step || currentStep > step) && styles.stepNumberActive
                  ]}>{step}</Text>
                </View>
                <Text style={[
                  styles.stepLabel,
                  currentStep === step && styles.stepLabelActive
                ]}>
                  {step === 1 ? 'State' :
                   step === 2 ? 'City' :
                   step === 3 ? 'From' :
                   step === 4 ? 'To' : 'Bus'}
                </Text>
              </View>
            ))}
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              {typeof error === 'string' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MaterialIcons name="error-outline" size={20} color="#E53E3E" />
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity
                    onPress={() => setError(null)}
                    style={{padding: 5}}
                  >
                    <MaterialIcons name="close" size={20} color="#A0AEC0" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.errorContent}>
                  {error}
                  <TouchableOpacity
                    onPress={() => setError(null)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      padding: 5,
                    }}
                  >
                    <MaterialIcons name="close" size={20} color="#A0AEC0" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Recent Selections */}
          {recentSelections.length > 0 && (
            <View style={styles.recentSelectionsContainer}>
              <Text style={styles.recentSelectionTitle}>Recent Selections</Text>
              <FlatList
                horizontal
                data={recentSelections}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentSelectionScroll}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.recentSelectionItem}
                    onPress={() => useRecentSelection(item)}
                  >
                    <View style={styles.recentSelectionHeader}>
                      <MaterialIcons name="history" size={18} color="#3182CE" />
                      <Text style={styles.recentSelectionRoute}>{item.from} → {item.to}</Text>
                    </View>
                    <Text style={styles.recentSelectionBusInfo}>Bus: {item.busRouteNo}</Text>
                    <Text style={styles.recentSelectionBusInfo}>City: {item.city}</Text>
                    <TouchableOpacity
                      style={styles.useThisButton}
                      onPress={() => useRecentSelection(item)}
                    >
                      <Text style={styles.useThisButtonText}>Use This Selection</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#718096" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for bus or route..."
              placeholderTextColor="#A0AEC0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <MaterialIcons name="close" size={18} color="#718096" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Main Form */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Route Selection</Text>

            {/* State Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <MaterialIcons
                  name="location-on"
                  size={16}
                  color="#007AFF"
                  style={styles.labelIcon}
                />
                State
              </Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    resetSelections();
                    setSelectedState(value);
                  }}
                  items={states.map((state) => ({
                    label: state,
                    value: state,
                    key: state,
                  }))}
                  style={pickerSelectStyles}
                  placeholder={{ label: "Select State...", value: null }}
                  Icon={() => (
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color="#A0AEC0"
                    />
                  )}
                  value={selectedState}
                />
              </View>
            </View>

            {/* City Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <MaterialIcons
                  name="location-city"
                  size={16}
                  color="#007AFF"
                  style={styles.labelIcon}
                />
                City
              </Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    setSelectedCity(value);
                    setSelectedFrom(null);
                    setSelectedTo(null);
                    setBusNumbers([]);
                    setBusplateNo("");
                  }}
                  items={[...new Set(busData.map((bus) => bus.city))]
                    .filter((city) => city)
                    .map((city) => ({
                      label: city,
                      value: city,
                      key: city,
                    }))}
                  style={pickerSelectStyles}
                  placeholder={{
                    label: selectedState
                      ? "Select City..."
                      : "Select state first",
                    value: null,
                  }}
                  disabled={!selectedState}
                  Icon={() => (
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color="#A0AEC0"
                    />
                  )}
                  value={selectedCity}
                />
              </View>
            </View>

            {/* From Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <MaterialIcons
                  name="trip-origin"
                  size={16}
                  color="#007AFF"
                  style={styles.labelIcon}
                />
                From
              </Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    setSelectedFrom(value);
                    setSelectedTo(null);
                    setBusNumbers([]);
                    setBusplateNo("");
                  }}
                  items={fromLocations.map((stage) => ({
                    label: stage,
                    value: stage,
                    key: stage,
                  }))}
                  style={pickerSelectStyles}
                  placeholder={{
                    label: selectedCity
                      ? "Select Departure..."
                      : "Select city first",
                    value: null,
                  }}
                  disabled={!selectedCity}
                  Icon={() => (
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color="#A0AEC0"
                    />
                  )}
                  value={selectedFrom}
                />
              </View>
            </View>

            {/* To Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <MaterialIcons
                  name="location-pin"
                  size={16}
                  color="#007AFF"
                  style={styles.labelIcon}
                />
                To
              </Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={setSelectedTo}
                  items={toLocations.map((stage) => ({
                    label: stage,
                    value: stage,
                    key: stage,
                  }))}
                  style={pickerSelectStyles}
                  placeholder={{
                    label: selectedFrom
                      ? "Select Destination..."
                      : "Select departure first",
                    value: null,
                  }}
                  disabled={!selectedFrom}
                  Icon={() => (
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color="#A0AEC0"
                    />
                  )}
                  value={selectedTo}
                />
              </View>
            </View>

            {/* Map Preview */}
            {showMapPreview && selectedFrom && selectedTo && (
              <View style={styles.mapPreviewContainer}>
                <View style={styles.mapPlaceholder}>
                  <MaterialIcons name="map" size={30} color="#007AFF" />
                  <Text style={styles.mapPlaceholderText}>Route Map</Text>
                </View>

                <View style={styles.routeContainer}>
                  {/* Starting Station */}
                  <View style={styles.routeStationContainer}>
                    <View style={[styles.routeStationDot, styles.routeStationDotStart]} />
                    <View style={styles.routeLine} />
                    <View style={styles.routeStationContent}>
                      <Text style={styles.routeStationName}>{selectedFrom}</Text>
                      <Text style={styles.routeStationInfo}>Starting Point</Text>
                    </View>
                  </View>

                  {/* Intermediate Stations */}
                  {intermediateStages.map((stage, index) => (
                    <View key={index} style={styles.routeStationContainer}>
                      <View style={styles.routeStationDotIntermediate} />
                      <View style={styles.routeLine} />
                      <View style={styles.routeStationContent}>
                        <Text style={styles.routeStationNameIntermediate}>{stage}</Text>
                      </View>
                    </View>
                  ))}

                  {/* Ending Station */}
                  <View style={styles.routeStationContainer}>
                    <View style={[styles.routeStationDot, styles.routeStationDotEnd]} />
                    <View style={styles.routeStationContent}>
                      <Text style={styles.routeStationName}>{selectedTo}</Text>
                      <Text style={styles.routeStationInfo}>Destination</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.mapActionButton}
                  onPress={() => setShowMapPreview(false)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="visibility-off" size={14} color="#007AFF" />
                  <Text style={styles.mapActionButtonText}>Hide Map</Text>
                </TouchableOpacity>
              </View>
            )}

            {!showMapPreview && selectedFrom && selectedTo && (
              <TouchableOpacity
                style={styles.showMapButton}
                onPress={() => setShowMapPreview(true)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="map" size={18} color="#3182CE" />
                <Text style={styles.showMapButtonText}>
                  Show Route Map {intermediateStages.length > 0 ? `(${intermediateStages.length} stops)` : ''}
                </Text>
              </TouchableOpacity>
            )}

            {/* Bus Number Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <MaterialIcons
                  name="confirmation-number"
                  size={16}
                  color="#007AFF"
                  style={styles.labelIcon}
                />
                Bus Number
              </Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={setSelectedBusNo}
                  items={busNumbers.map((bus) => ({
                    label: `Bus No: ${bus}`,
                    value: bus,
                    key: bus,
                  }))}
                  style={pickerSelectStyles}
                  placeholder={{
                    label: selectedTo
                      ? "Select Bus..."
                      : "Complete route selection first",
                    value: null,
                  }}
                  disabled={!selectedTo}
                  Icon={() => (
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color="#A0AEC0"
                    />
                  )}
                  value={selectedBusNo}
                />
              </View>
            </View>

            {/* Bus Plate Number Display */}
            {busplateNo && (
              <View style={styles.plateContainer}>
                <MaterialIcons
                  name="directions-bus"
                  size={24}
                  color="#007AFF"
                />
                <Text style={styles.plateLabel}>Bus Plate:</Text>
                <Text style={styles.plateNumber}>{busplateNo}</Text>
              </View>
            )}

            {/* Proceed Button */}
            {selectedBusNo && (
              <TouchableOpacity
                style={styles.button}
                onPress={handlebuslogin}
                activeOpacity={0.8}
              >
                <View style={styles.buttonInner}>
                  <MaterialIcons name="login" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Proceed to Bus Login</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BusSelection;
