import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import axios from "axios";
import { WebView } from "react-native-webview";
import * as SecureStore from "expo-secure-store";
import { API_BASE2, API_BASE_URL } from "../../../../apiurl";
import debounce from "lodash.debounce";

const BACKEND_URL = API_BASE2;

const Footer = ({ navigation }) => {
  // State management
  const [activeTab, setActiveTab] = useState("home");
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(null);
  const [shouldContinueListening, setShouldContinueListening] = useState(false);
  const [Price, setPrices] = useState("");
  const [busno, setbusno] = useState("");
  const [fromstage2, setfromstage2] = useState("");
  const [tostage2, settostage2] = useState("");
  const [busno2, setbusno2] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs
  const webviewRef = useRef(null);
  const soundRef = useRef(null);
  const speechTimeoutRef = useRef(null);

  // Animations
  const [scaleAnims] = useState({
    home: new Animated.Value(1),
    ticket: new Animated.Value(1),
    ai: new Animated.Value(1),
    place: new Animated.Value(1),
    profile: new Animated.Value(1),
  });
  
  const [translateYAnims] = useState({
    home: new Animated.Value(0),
    ticket: new Animated.Value(0),
    ai: new Animated.Value(0),
    place: new Animated.Value(0),
    profile: new Animated.Value(0),
  });

  // Cleanup effects
  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      Speech.stop();
      clearTimeout(speechTimeoutRef.current);
    };
  }, []);

  // Microphone permission check
  const checkMicrophonePermission = async () => {
    try {
      const { status } = await Audio.getPermissionsAsync();
      console.log("Microphone permission status:", status);
      
      if (status === "granted") {
        setHasMicPermission(true);
      } else {
        const { status: newStatus } = await Audio.requestPermissionsAsync();
        setHasMicPermission(newStatus === "granted");
      }
    } catch (error) {
      console.error("Error checking microphone permission:", error);
      setHasMicPermission(false);
    }
  };

  // Speech recognition handlers
  const startListening = useCallback(async () => {
    if (isListening || isProcessing) return;
    
    if (isSpeaking) {
      stopSpeaking();
    }

    if (hasMicPermission === false) {
      Alert.alert(
        "Permission Required",
        "Microphone access is needed for voice commands. Please enable it in settings.",
        [{ text: "OK" }]
      );
      return;
    }

    console.log("Starting voice recognition...");
    setIsListening(true);
    setIsProcessing(true);
    setShouldContinueListening(true);
    
    try {
      webviewRef.current.injectJavaScript(`
        try {
          const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
          recognition.lang = 'en-IN';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;
          recognition.continuous = ${shouldContinueListening};

          recognition.onstart = () => {
            console.log("Speech recognition started");
          };
          
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Transcript:", transcript);
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
              type: 'speech', 
              text: transcript 
            }));
          };
          
          recognition.onerror = (event) => {
            console.error("Speech error:", event.error);
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
              type: 'error', 
              error: event.error 
            }));
          };
          
          recognition.onend = () => {
            console.log("Speech recognition ended");
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
              type: 'end' 
            }));
          };

          recognition.start();
        } catch (e) {
          console.error("Speech init error:", e);
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            type: 'error', 
            error: e.message 
          }));
        }
      `);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsListening(false);
      setIsProcessing(false);
    }
  }, [isListening, isSpeaking, hasMicPermission, shouldContinueListening, isProcessing]);

  const stopListening = useCallback(() => {
    console.log("Stopping voice recognition...");
    setIsListening(false);
    setIsProcessing(false);
    
    webviewRef.current.injectJavaScript(`
      if (window.recognition) {
        window.recognition.stop();
      }
    `);
  }, []);

  const stopSpeaking = useCallback(() => {
    console.log("Stopping speech synthesis...");
    Speech.stop();
    setIsSpeaking(false);
    
    if (soundRef.current) {
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, []);

  // WebView message handler
  const handleWebViewMessage = useCallback(async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("WebView message:", data);
      
      if (data.type === "speech") {
        setIsProcessing(true);
        await processVoiceCommand(data.text);
      } else if (data.type === "error") {
        console.error("Speech recognition error:", data.error);
        handleSpeechError(data.error);
      } else if (data.type === "end") {
        handleSpeechEnd();
      }
    } catch (error) {
      console.error("Error processing WebView message:", error);
    }
  }, [navigation, shouldContinueListening]);

  const processVoiceCommand = async (transcribedText) => {
    setIsListening(false);
    await sendMessage(transcribedText);
    setIsProcessing(false);
  };

  const handleSpeechError = (error) => {
    setIsListening(false);
    setIsProcessing(false);
    
    if (error !== "no-speech" && error !== "aborted") {
      Alert.alert("Voice Error", `Speech recognition failed: ${error}`);
    }
    
    if (shouldContinueListening && !isSpeaking) {
      speechTimeoutRef.current = setTimeout(() => startListening(), 1000);
    }
  };

  const handleSpeechEnd = () => {
    setIsListening(false);
    setIsProcessing(false);
    
    if (shouldContinueListening && !isSpeaking) {
      speechTimeoutRef.current = setTimeout(() => startListening(), 500);
    }
  };

  // Data fetching functions
  const fetchBusdetails = useCallback(async (busRouteNo) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Admin/buses/fetchAllBuses3`, {
        params: { busRouteNo },
      });

      const bus = response.data;
      console.log("Fetched bus details:", bus);

      if (bus) {
        setfromstage2(bus.fromStage);
        settostage2(bus.toStage);
        setbusno2(bus.busRouteNo);
        return {
          bus,
          fromLocation: bus.fromStage,
          toLocation: bus.toStage
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching bus details:", error);
      return null;
    }
  }, []);

  const fetchBusPrice = async (busRouteNo, from, to) => {
    console.log("Fetching bus price for:", busRouteNo, from, to);
    setbusno(busRouteNo);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Admin/buses/fetchAllBuses2`, {
        params: { busRouteNo, from, to },
      });
     
      const data = response.data || [];
      if (data.length > 0) {
        const bus = data[0];
        const prices = bus.prices || {};
        const isSimilar = (a, b) => {
          a = a.toLowerCase();
          b = b.toLowerCase();
          const minLength = Math.min(a.length, b.length);
          let matchCount = 0;
          for (let i = 0; i < minLength; i++) {
            if (a[i] === b[i]) matchCount++;
          }
          const similarity = matchCount / Math.max(a.length, b.length);
          return similarity >= 0.5;
        };

        let matchedPrice = null;
        for (const key in prices) {
          const [priceFrom, priceTo] = key.split("-");
          if (isSimilar(priceFrom, from) && isSimilar(priceTo, to)) {
            matchedPrice = prices[key];
            console.log(`✅ Match found: ${priceFrom}-${priceTo}`);
            break;
          }
        }
        
        if (matchedPrice) {
          setPrices(matchedPrice);
          console.log(`💰 Price from ${from} to ${to} is ₹${matchedPrice}`);
        } else {
          console.log(`❌ No matching price for ${from} to ${to}`);
        }
      } else {
        console.log("❌ No bus data received");
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  // Navigation handlers
  const handleBookingNavigation = useCallback((bookingData) => {
    console.log("Navigating to payment with:", bookingData);
    fetchBusPrice(bookingData.bus.replace("bus ", ""), bookingData.from, bookingData.to)
      .then(price => {
        navigation.navigate("payment", {
          busno: bookingData.bus.replace("bus ", ""),
          fareprice: Price,
          fromLocation: bookingData.from,
          toLocation: bookingData.to,
        });
      })
      .catch(error => {
        console.error("Booking navigation error:", error);
      });
  }, [fetchBusPrice, navigation]);

  const handleTabPress = useCallback((tabName) => {
    // Reset all animations
    Object.keys(scaleAnims).forEach((key) => {
      Animated.timing(scaleAnims[key], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(translateYAnims[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    // Animate the pressed tab
    Animated.sequence([
      Animated.timing(scaleAnims[tabName], {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[tabName], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(translateYAnims[tabName], {
      toValue: -5,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setActiveTab(tabName);
    setShowAIMenu(false);

    // Navigation mapping
    const navMap = {
      ticket: "TicketHistory",
      place: "FavouriteBuses",
      profile: "UserProfile",
      home: "UserHome"
    };
    
    if (navMap[tabName]) {
      navigation.navigate(navMap[tabName]);
    }
  }, [scaleAnims, translateYAnims, navigation]);

  // AI Chat functions
  const sendMessage = useCallback(debounce(async (text) => {
    if (!text.trim()) return;

    const lowerText = text.toLowerCase();
    console.log("Processing voice input:", lowerText);

    // First try to match navigation commands
    if (await handleNavigationCommands(lowerText)) {
      return;
    }

    // Fall back to AI chat
    try {
      const userId = await SecureStore.getItemAsync("currentUserId");
      const res = await axios.post(`${BACKEND_URL}/chat`, {
        message: text,
        speak: true,
        userId,
      });

      await handleAIResponse(res.data);
    } catch (err) {
      console.error("Chat error:", err);
      setIsSpeaking(false);
      if (shouldContinueListening) {
        speechTimeoutRef.current = setTimeout(() => startListening(), 1000);
      }
    }
  }, 300), [navigation, shouldContinueListening]);

  const handleNavigationCommands = async (lowerText) => {
    const commandPatterns = {
      ticketHistory: [
        /(go to|show|view|open) (my )?ticket history/,
        /ticket history/
      ],
      favouriteBuses: [
        /(go to|show|view|open) (my )?favourites? buses?/,
        /favourites? buses?/
      ],
      userProfile: [
        /(go to|show|view|open) (my )?profile/,
        /user profile/
      ],
      userHome: [
        /(go to|show|view|open) (user )?home/,
      ],
      busDetails: [
        /(show|find|tell me|what are|what's) (the )?bus details? (for|of)?\s*(\d+\s*[a-zA-Z]*)/,
        /bus details? (for|of)?\s*(\d+\s*[a-zA-Z]*)/,
        /(go to|show) bus details?/
      ],
      ai: [
        /(go to|show|open|view|chat with) ai/,
      ]
    };

    for (const [screen, patterns] of Object.entries(commandPatterns)) {
      for (const pattern of patterns) {
        const match = lowerText.match(pattern);
        if (match) {
          console.log(`Matched ${screen} with pattern:`, pattern);
          
          if (screen === "busDetails") {
            const busRouteNo = match[4] || match[2] || null;
            if (busRouteNo) {
              const cleanedBusNo = busRouteNo.replace(/\s+/g, "");
              const busDetails = await fetchBusdetails(cleanedBusNo);
              
              if (busDetails) {
                navigation.navigate("Busdetails", {
                  bus: busDetails.bus,
                  fromLocation: busDetails.fromLocation,
                  toLocation: busDetails.toLocation
                });
                return true;
              }
            }
          } else {
            const navMap = {
              ticketHistory: "TicketHistory",
              favouriteBuses: "FavouriteBuses",
              userProfile: "UserProfile",
              userHome: "UserHome",
              ai: "ai"
            };
            
            navigation.navigate(navMap[screen]);
            return true;
          }
        }
      }
    }
    return false;
  };

  const handleAIResponse = async (responseData) => {
    let botText = responseData.response?.replace(/[*#]/g, "") || "I didn't understand that.";
    console.log("AI response:", botText);

    setIsSpeaking(true);
    
    try {
      if (responseData.audioPath) {
        // Stop any existing audio
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }

        // Play new audio
        const { sound } = await Audio.Sound.createAsync(
          { uri: `${BACKEND_URL}${responseData.audioPath}` },
          { shouldPlay: true }
        );
        soundRef.current = sound;

        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish || status.error) {
            await handlePlaybackComplete(responseData);
          }
        });
      } else {
        // Fallback to TTS
        Speech.speak(botText, {
          language: 'en-IN',
          onDone: () => handlePlaybackComplete(responseData),
          onStopped: () => handlePlaybackComplete(responseData),
          onError: (error) => {
            console.error("TTS error:", error);
            handlePlaybackComplete(responseData);
          },
        });
      }
    } catch (error) {
      console.error("Error handling AI response:", error);
      handlePlaybackComplete(responseData);
    }
  };

  const handlePlaybackComplete = async (responseData) => {
    setIsSpeaking(false);
    
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    if (responseData.triggerBooking) {
      handleBookingNavigation(responseData.bookingData);
      setShouldContinueListening(false);
    } else if (shouldContinueListening) {
      speechTimeoutRef.current = setTimeout(() => startListening(), 800);
    }
  };

  // AI Menu functions
  const toggleAIMenu = useCallback(() => {
    setActiveTab("ai");
    setShowAIMenu(prev => !prev);
  }, []);

  const handleAIOptionPress = useCallback((option) => {
    setShowAIMenu(false);
    if (option === "chat") navigation.navigate("ai");
    if (option === "voice") startListening();
  }, [navigation, startListening]);

  const handleCloseAIMenu = useCallback(() => {
    console.log("Closing AI menu...");
    setShowAIMenu(false);
    setShouldContinueListening(false);
    stopSpeaking();
    stopListening();
  }, [stopListening, stopSpeaking]);

  // Render functions
  const renderTabItem = useCallback((tabName, iconName, activeIconName) => {
    const isActive = activeTab === tabName;
    const iconToUse = isActive ? activeIconName : iconName;
    const colorToUse = isActive ? "#00468b" : "#aaa";
    const textStyle = isActive ? styles.footerText : styles.footerTextInactive;

    return (
      <TouchableOpacity 
        onPress={() => handleTabPress(tabName)} 
        activeOpacity={0.7}
        accessibilityLabel={`${tabName} tab`}
      >
        <Animated.View
          style={[
            styles.footerItem,
            {
              transform: [
                { scale: scaleAnims[tabName] }, 
                { translateY: translateYAnims[tabName] }
              ],
            },
          ]}
        >
          <Ionicons 
            name={iconToUse} 
            size={22} 
            color={colorToUse} 
            accessibilityLabel={tabName}
          />
          <Text style={textStyle}>
            {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
          </Text>
          {isActive && <View style={styles.activeDot} />}
        </Animated.View>
      </TouchableOpacity>
    );
  }, [activeTab, scaleAnims, translateYAnims, handleTabPress]);

  const renderAIButton = useCallback(() => {
    const isActive = activeTab === "ai";
    const iconName = isActive ? "sparkles" : "sparkles-outline";
    const iconColor = isActive ? "#00468b" : "#aaa";
    const textStyle = isActive ? styles.footerText : styles.footerTextInactive;

    return (
      <View style={{ alignItems: "center" }}>
        {showAIMenu && (
          <View style={styles.popupMenu}>
            <TouchableOpacity 
              onPress={() => handleAIOptionPress("chat")} 
              style={styles.popupButton}
              accessibilityLabel="AI Chat"
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#00468b" />
              <Text style={styles.popupText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleAIOptionPress("voice")} 
              style={styles.popupButton}
              accessibilityLabel="Voice Assistant"
            >
              <Ionicons
                name={isListening ? "mic" : "mic-outline"}
                size={20}
                color="#00468b"
              />
              <Text style={styles.popupText}>Voice</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleCloseAIMenu} 
              style={styles.popupButton}
              accessibilityLabel="Close AI Menu"
            >
              <Ionicons name="close-outline" size={20} color="#00468b" />
              <Text style={styles.popupText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          onPress={toggleAIMenu} 
          activeOpacity={0.7}
          accessibilityLabel="AI Assistant"
        >
          <Animated.View
            style={[
              styles.aiButton,
              {
                transform: [
                  { scale: scaleAnims["ai"] }, 
                  { translateY: translateYAnims["ai"] }
                ],
              },
            ]}
          >
            <Ionicons 
              name={iconName} 
              size={28} 
              color={iconColor} 
              accessibilityLabel="AI"
            />
            <Text style={[textStyle, { fontSize: 9 }]}>AI</Text>
            {isActive && <View style={styles.activeDot} />}
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }, [
    activeTab, 
    showAIMenu, 
    isListening, 
    scaleAnims, 
    translateYAnims, 
    handleAIOptionPress, 
    handleCloseAIMenu, 
    toggleAIMenu
  ]);

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footer}>
        {renderTabItem("home", "home-outline", "home")}
        {renderTabItem("ticket", "ticket-outline", "ticket")}
        {renderAIButton()}
        {renderTabItem("place", "location-outline", "location")}
        {renderTabItem("profile", "person-outline", "person")}
      </View>

      <WebView
        ref={webviewRef}
        source={{ html: "<html><body></body></html>" }}
        style={{ height: 0, width: 0 }}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
        originWhitelist={["*"]}
        mixedContentMode="compatibility"
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    paddingHorizontal: 5,
  },
  footerItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    position: "relative",
    minWidth: 60,
  },
  footerText: {
    fontSize: 12,
    color: "#00468b",
    marginTop: 4,
    fontWeight: "500",
  },
  footerTextInactive: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
  activeDot: {
    width: 4,
    height: 4,
    backgroundColor: "#00468b",
    borderRadius: 2,
    position: "absolute",
    bottom: 0,
  },
  aiButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    marginTop: -10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    width: 60,
    height: 60,
  },
  popupMenu: {
    position: "absolute",
    bottom: 70,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 0,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 100,
  },
  popupButton: {
    alignItems: "center",
    marginHorizontal: 8,
    padding: 5,
  },
  popupText: {
    fontSize: 10,
    color: "#00468b",
    marginTop: 2,
    fontWeight: "500",
  },
});

export default React.memo(Footer);