import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import axios from "axios";
import { WebView } from "react-native-webview";
import * as SecureStore from "expo-secure-store";
import { API_BASE2 } from "../../../apiurl";

const BACKEND_URL = `${API_BASE2}`;

const Footer = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(null);
  const webviewRef = useRef(null);

  // Animation states
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

  // Check/request microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
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
      }
    }
  };

  const startListening = async () => {
    if (isListening || isSpeaking) {
      stopListening();
      stopSpeaking();
      return;
    }

    if (hasMicPermission === null) return;

    if (!hasMicPermission) {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Microphone access is required for voice recognition. Please enable it in settings.",
          [{ text: "OK" }]
        );
        return;
      }
      setHasMicPermission(true);
    }

    setIsListening(true);
    webviewRef.current.injectJavaScript(`
      try {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          console.log("Speech recognition started");
        };
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log("Transcript:", transcript);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'speech', text: transcript }));
        };
        recognition.onerror = (event) => {
          console.error("Speech error:", event.error);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: event.error }));
        };
        recognition.onend = () => {
          console.log("Speech recognition ended");
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'end' }));
        };

        recognition.start();
      } catch (e) {
        console.error("Speech init error:", e.message);
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: e.message }));
      }
    `);
  };

  const stopListening = () => {
    setIsListening(false);
    webviewRef.current.injectJavaScript(`
      if (window.recognition) {
        window.recognition.stop();
      }
    `);
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
    startListening(); // Automatically listen again after stopping speech
  };

  const handleWebViewMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log("WebView message:", data);
    if (data.type === "speech") {
      const transcribedText = data.text;
      setIsListening(false);
      await sendMessage(transcribedText);
    } else if (data.type === "error") {
      Alert.alert("Error", "Speech recognition failed: " + data.error);
      setIsListening(false);
    } else if (data.type === "end") {
      setIsListening(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    try {
      const userId = await SecureStore.getItemAsync("currentUserId");
      const res = await axios.post(`${BACKEND_URL}/chat`, {
        message: text,
        speak: true,
        userId,
      });

      let botText = res.data.response || "No response from AI";
      botText = botText.replace(/[*#]/g, "");

      setIsSpeaking(true);
      Speech.speak(botText, {
        onDone: () => {
          setIsSpeaking(false);
          startListening(); // Automatically listen again after speaking
        },
        onStopped: () => {
          setIsSpeaking(false);
          startListening();
        },
        onError: () => {
          setIsSpeaking(false);
          startListening();
        },
      });
    } catch (err) {
      console.error("Chat error:", err);
      setIsSpeaking(false);
      startListening();
    }
  };

  const toggleAIMenu = () => {
    setActiveTab("ai");
    setShowAIMenu((prev) => !prev);
  };

  const handleAIOptionPress = (option) => {
    setShowAIMenu(false);
    if (option === "chat") navigation.navigate("ai");
    if (option === "voice") startListening();
  };

  const handleTabPress = (tabName) => {
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

    if (tabName === "ticket") navigation.navigate("TicketHistory");
    if (tabName === "place") navigation.navigate("FavouriteBuses");
    if (tabName === "profile") navigation.navigate("UserProfile");
    if (tabName === "home") navigation.navigate("Home");
  };

  const renderTabItem = (tabName, iconName, activeIconName) => {
    const isActive = activeTab === tabName;
    const iconToUse = isActive ? activeIconName : iconName;
    const colorToUse = isActive ? "#00468b" : "#aaa";
    const textStyle = isActive ? styles.footerText : styles.footerTextInactive;

    return (
      <TouchableOpacity onPress={() => handleTabPress(tabName)} activeOpacity={0.7}>
        <Animated.View
          style={[
            styles.footerItem,
            {
              transform: [{ scale: scaleAnims[tabName] }, { translateY: translateYAnims[tabName] }],
            },
          ]}
        >
          <Ionicons name={iconToUse} size={22} color={colorToUse} />
          <Text style={textStyle}>{tabName.charAt(0).toUpperCase() + tabName.slice(1)}</Text>
          {isActive && <View style={styles.activeDot} />}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderAIButton = () => {
    const isActive = activeTab === "ai";
    const iconName = isActive ? "sparkles" : "sparkles-outline";
    const iconColor = isActive ? "#00468b" : "#aaa";
    const textStyle = isActive ? styles.footerText : styles.footerTextInactive;

    return (
      <View style={{ alignItems: "center" }}>
        {showAIMenu && (
          <View style={styles.popupMenu}>
            <TouchableOpacity onPress={() => handleAIOptionPress("chat")} style={styles.popupButton}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#00468b" />
              <Text style={styles.popupText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAIOptionPress("voice")} style={styles.popupButton}>
              <Ionicons
                name={isSpeaking ? "volume-high-outline" : isListening ? "mic" : "mic-outline"}
                size={20}
                color="#00468b"
              />
              <Text style={styles.popupText}>Voice</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={toggleAIMenu} activeOpacity={0.7}>
          <Animated.View
            style={[
              styles.aiButton,
              {
                transform: [{ scale: scaleAnims["ai"] }, { translateY: translateYAnims["ai"] }],
              },
            ]}
          >
            <Ionicons name={iconName} size={28} color={iconColor} />
            <Text style={[textStyle, { fontSize: 9 }]}>AI</Text>
            {isActive && <View style={styles.activeDot} />}
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
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
  },
  popupText: {
    fontSize: 10,
    color: "#00468b",
    marginTop: 2,
  },
});

export default Footer;