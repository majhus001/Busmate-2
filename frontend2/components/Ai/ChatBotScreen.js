import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";
import { API_BASE2, API_BASE_URL } from "../../apiurl";
import { debounce } from "lodash";
import styles from "./Chatbotstyles";

const BACKEND_URL = API_BASE2;

export default function ChatBotScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [Price, setPrices] = useState("");
  const [busno, setbusno] = useState("");
  const [fromstage2, setfromstage2] = useState("");
  const [tostage2, settostage2] = useState("");
  const [busno2, setbusno2] = useState("");
  const webviewRef = useRef(null);
  const scrollViewRef = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      Speech.stop();
    };
  }, []);

  const checkMicrophonePermission = async () => {
    const { status } = await Audio.getPermissionsAsync();
    console.log("Initial microphone permission status:", status);
    if (status === "granted") {
      setHasMicPermission(true);
    } else {
      const { status: newStatus } = await Audio.requestPermissionsAsync();
      console.log("Requested microphone permission status:", newStatus);
      if (newStatus === "granted") {
        setHasMicPermission(true);
      } else {
        setHasMicPermission(false);
        Alert.alert(
          "Permission Denied",
          "Microphone access is required for voice recognition. Please enable it in your device settings.",
          [{ text: "OK" }],
        );
      }
    }
  };

  const startListening = async () => {
    if (isListening || !hasMicPermission || isRequestPending) {
      if (isRequestPending) {
        Alert.alert("Please Wait", "Processing your previous request. Try again in a moment.");
      }
      return;
    }

    if (hasMicPermission === null) {
      await checkMicrophonePermission();
      if (!hasMicPermission) return;
    }

    setIsListening(true);
    webviewRef.current.injectJavaScript(`
      if (window.speechManager && window.speechManager.isActive) {
        // Do nothing if already active
      } else {
        window.speechManager = {
          isActive: false,
          recognition: null,
          init() {
            if (!this.recognition) {
              try {
                this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                this.recognition.lang = 'en-IN';
                this.recognition.interimResults = false;
                this.recognition.maxAlternatives = 1;
                this.isActive = false;

                this.recognition.onstart = () => {
                  console.log("Speech recognition started");
                  this.isActive = true;
                };
                this.recognition.onresult = (event) => {
                  const transcript = event.results[0][0].transcript;
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'speech', text: transcript }));
                };
                this.recognition.onerror = (event) => {
                  console.error("Speech error:", event.error);
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: event.error }));
                  this.stop();
                };
                this.recognition.onend = () => {
                  console.log("Speech recognition ended");
                  this.isActive = false;
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'end' }));
                };
              } catch (e) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: e.message }));
                this.stop();
              }
            }
          },
          start() {
            this.init();
            if (!this.isActive && this.recognition) {
              this.recognition.start();
            } else {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: 'Recognition already active or not supported' }));
            }
          },
          stop() {
            if (this.isActive && this.recognition) {
              this.recognition.stop();
              this.isActive = false;
            }
          }
        };
        window.speechManager.init();
        window.speechManager.start();
      }
    `);
  };

  const stopListening = () => {
    if (!isListening) return;

    setIsListening(false);
    webviewRef.current.injectJavaScript(`
      if (window.speechManager) {
        window.speechManager.stop();
        window.speechManager = null;
      }
    `);
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
    if (soundRef.current) {
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log("WebView message:", data);
    if (data.type === "speech") {
      const transcribedText = data.text;
      setInput(transcribedText);
      sendMessage(transcribedText, true);
    } else if (data.type === "error") {
      Alert.alert("Error", "Speech recognition failed: " + data.error);
      setIsListening(false);
    } else if (data.type === "end") {
      setIsListening(false);
    }
  };

  const fetchBusdetails = async (busRouteNo) => {
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
          toLocation: bus.toStage,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching bus details:", error);
      return null;
    }
  };

  const fetchBusPrice = async (busRouteNo, from, to) => {
    console.log("Fetching price for:", busRouteNo, from, to);
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
          return matchedPrice;
        } else {
          console.log(`❌ No matching price for ${from} to ${to}`);
          return "Unknown";
        }
      } else {
        console.log("❌ No bus data received");
        return "Unknown";
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      return "Unknown";
    }
  };

  const handleBookingNavigation = useCallback(
    async (bookingData) => {
      console.log("Navigating to payment with:", bookingData);

      if (
        !bookingData ||
        !bookingData.from ||
        !bookingData.to ||
        !bookingData.bus ||
        ["book", "confirm", "proceed"].includes(bookingData.to.toLowerCase())
      ) {
        console.error("Invalid booking data:", bookingData);
        Alert.alert("Error", "Invalid booking details. Please provide valid locations.");
        return;
      }

      const busRouteNo = bookingData.bus.replace(/^bus\s+/i, "");
      try {
        const price = await fetchBusPrice(busRouteNo, bookingData.from, bookingData.to);
        setPrices(price);

        const distance = bookingData.distance || "10";
        await SecureStore.setItemAsync("bookingDistance", distance);

        navigation.navigate("payment", {
          busno: busRouteNo,
          fareprice: price,
          fromLocation: bookingData.from,
          toLocation: bookingData.to,
          seats: bookingData.seats || "1",
          distance,
        });
        console.log("Price fetched:", price, "Distance:", distance);
      } catch (error) {
        console.error("Booking navigation error:", error);
        Alert.alert("Error", "Failed to fetch price. Proceeding with unknown price.");

        const distance = bookingData.distance || "10";
        await SecureStore.setItemAsync("bookingDistance", distance);

        navigation.navigate("payment", {
          busno: busRouteNo,
          fareprice: "Unknown",
          fromLocation: bookingData.from,
          toLocation: bookingData.to,
          seats: bookingData.seats || "1",
          distance,
        });
      }
    },
    [navigation, setPrices],
  );

  const handleNavigationCommands = async (lowerText) => {
    const commandPatterns = {
      ticketHistory: [/(go to|show|view|open) (my )?ticket history/, /ticket history/],
      favouriteBuses: [/(go to|show|view|open) (my )?favourites? buses?/, /favourites? buses?/],
      userProfile: [/(go to|show|view|open) (my )?profile/, /user profile/],
      userHome: [/(go to|show|view|open) (user )?home/],
      busDetails: [
        /(show|find|tell me|what are|what's) (the )?bus details? (for|of)?\s*(\d+\s*[a-zA-Z]*)/,
        /bus details? (for|of)?\s*(\d+\s*[a-zA-Z]*)/,
        /(go to|show) bus details?/,
      ],
      ai: [/(go to|show|open|view|chat with) ai/],
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
                  toLocation: busDetails.toLocation,
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
              ai: "ai",
            };

            navigation.navigate(navMap[screen]);
            return true;
          }
        }
      }
    }
    return false;
  };

  const sendMessage = debounce(async (text, fromVoice = false) => {
    if (!text.trim() || isRequestPending) {
      if (isRequestPending) {
        Alert.alert("Please Wait", "Processing your previous request. Try again in a moment.");
      }
      return;
    }

    setIsRequestPending(true);
    const userMessage = { sender: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const lowerText = text.toLowerCase();
      if (await handleNavigationCommands(lowerText)) {
        setIsRequestPending(false);
        return;
      }

      const userId = await SecureStore.getItemAsync("currentUserId");
      const res = await axios.post(`${BACKEND_URL}/chat`, {
        message: text,
        speak: fromVoice,
        userId,
      });

      const botText = res.data.response?.replace(/[*#]/g, "") || "No response from AI";
      const botMessage = { sender: "bot", text: botText, timestamp: new Date() };
      setMessages((prev) => [...prev, botMessage]);

      if (res.data.triggerBooking) {
        await handleBookingNavigation(res.data.bookingData);
      } else if (fromVoice) {
        setIsSpeaking(true);
        if (res.data.audioPath) {
          if (soundRef.current) {
            await soundRef.current.unloadAsync();
          }
          const { sound } = await Audio.Sound.createAsync(
            { uri: `${BACKEND_URL}${res.data.audioPath}` },
            { shouldPlay: true },
          );
          soundRef.current = sound;
          sound.setOnPlaybackStatusUpdate(async (status) => {
            if (status.didJustFinish || status.error) {
              setIsSpeaking(false);
              if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
              }
            }
          });
        } else {
          Speech.speak(botText, {
            language: "en-IN",
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
          });
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      let errorText = "Error talking to AI.";
      if (err.response?.status === 429) {
        errorText = "Please wait a moment before sending another message.";
      }
      setMessages((prev) => [...prev, { sender: "bot", text: errorText, timestamp: new Date() }]);
    } finally {
      setIsRequestPending(false);
    }
  }, 1000);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ImageBackground
        source={{ uri: "https://via.placeholder.com/375x812/FFFFFF" }}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.mainContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContentContainer}
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 ? (
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>What can I help with?</Text>
              </View>
            ) : (
              messages.map((msg, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.messageContainer,
                    msg.sender === "user" ? styles.userMessageContainer : styles.botMessageContainer,
                  ]}
                >
                  <View style={[styles.messageBubble, msg.sender === "user" ? styles.userBubble : styles.botBubble]}>
                    <Text style={styles.messageText}>{msg.text}</Text>
                    <Text style={styles.timestamp}>{formatTimestamp(msg.timestamp)}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type your message..."
                placeholderTextColor="#6B7280"
                multiline
                maxHeight={100}
                editable={!isRequestPending}
              />
              <View style={styles.buttonContainer}>
                {isSpeaking ? (
                  <TouchableOpacity style={styles.actionButton} onPress={stopSpeaking}>
                    <Icon name="stop" size={24} color="#1E3A8A" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionButton, (!input.trim() || isRequestPending) && styles.disabledButton]}
                    onPress={() => sendMessage(input, false)}
                    disabled={!input.trim() || isRequestPending}
                  >
                    <Icon name="send" size={24} color="#1E3A8A" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, isRequestPending && styles.disabledButton]}
                  onPress={isListening ? stopListening : startListening}
                  disabled={isRequestPending}
                >
                  <Icon name={isListening ? "microphone-off" : "microphone"} size={24} color="#1E3A8A" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <WebView
          ref={webviewRef}
          source={{ html: "<html><body></body></html>" }}
          style={styles.webView}
          injectedJavaScript={`
            (function() {
              if (!window.speechManager) {
                window.speechManager = {
                  isActive: false,
                  recognition: null,
                  init() {
                    if (!this.recognition) {
                      try {
                        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                        this.recognition.lang = 'en-IN';
                        this.recognition.interimResults = false;
                        this.recognition.maxAlternatives = 1;
                        this.isActive = false;

                        this.recognition.onstart = () => {
                          console.log("Speech recognition started");
                          this.isActive = true;
                        };
                        this.recognition.onresult = (event) => {
                          const transcript = event.results[0][0].transcript;
                          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'speech', text: transcript }));
                        };
                        this.recognition.onerror = (event) => {
                          console.error("Speech error:", event.error);
                          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: event.error }));
                          this.stop();
                        };
                        this.recognition.onend = () => {
                          console.log("Speech recognition ended");
                          this.isActive = false;
                          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'end' }));
                        };
                      } catch (e) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: e.message }));
                      }
                    }
                  },
                  start() {
                    this.init();
                    if (!this.isActive && this.recognition) {
                      this.recognition.start();
                    } else if (!this.recognition) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: 'Speech recognition not supported' }));
                    }
                  },
                  stop() {
                    if (this.isActive && this.recognition) {
                      this.recognition.stop();
                      this.isActive = false;
                    }
                  }
                };
                window.speechManager.init();
              }
            })();
          `}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={handleWebViewMessage}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}