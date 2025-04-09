// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import axios from "axios";
// import * as Speech from "expo-speech";
// import { Audio } from "expo-av";
// import * as SecureStore from "expo-secure-store";
// import { API_BASE2 } from "../../apiurl";
// import { debounce } from "lodash"; // Added for debouncing

// const BACKEND_URL = `${API_BASE2}`;

// export default function ChatBotScreen({ navigation }) { // Added navigation prop
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [hasMicPermission, setHasMicPermission] = useState(null);
//   const webviewRef = useRef(null);
//   const scrollViewRef = useRef(null);

//   useEffect(() => {
//     checkMicrophonePermission();
//   }, []);

//   const checkMicrophonePermission = async () => {
//     const { status } = await Audio.getPermissionsAsync();
//     console.log("Initial microphone permission status:", status);
//     if (status === "granted") {
//       setHasMicPermission(true);
//     } else {
//       const { status: newStatus } = await Audio.requestPermissionsAsync();
//       console.log("Requested microphone permission status:", newStatus);
//       if (newStatus === "granted") {
//         setHasMicPermission(true);
//       } else {
//         setHasMicPermission(false);
//         Alert.alert(
//           "Permission Denied",
//           "Microphone access is required for voice recognition. Please enable it in your device settings.",
//           [{ text: "OK" }]
//         );
//       }
//     }
//   };

//   const startListening = async () => {
//     if (isListening) return;

//     if (hasMicPermission === null) {
//       return;
//     }

//     if (!hasMicPermission) {
//       const { status } = await Audio.requestPermissionsAsync();
//       console.log("Re-requested microphone permission status:", status);
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission Denied",
//           "Microphone access is required for voice recognition. Please enable it in your device settings.",
//           [{ text: "OK" }]
//         );
//         return;
//       }
//       setHasMicPermission(true);
//     }

//     setIsListening(true);
//     webviewRef.current.injectJavaScript(`
//       try {
//         const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//         recognition.lang = 'en-IN';
//         recognition.interimResults = false;
//         recognition.maxAlternatives = 1;

//         recognition.onstart = () => {
//           console.log("Speech recognition started");
//         };
//         recognition.onresult = (event) => {
//           const transcript = event.results[0][0].transcript;
//           console.log("Transcript:", transcript);
//           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'speech', text: transcript }));
//         };
//         recognition.onerror = (event) => {
//           console.error("Speech error:", event.error);
//           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: event.error }));
//         };
//         recognition.onend = () => {
//           console.log("Speech recognition ended");
//           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'end' }));
//         };

//         recognition.start();
//       } catch (e) {
//         console.error("Speech init error:", e.message);
//         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: e.message }));
//       }
//     `);
//   };

//   const stopListening = () => {
//     setIsListening(false);
//     webviewRef.current.injectJavaScript(`
//       if (window.recognition) {
//         window.recognition.stop();
//       }
//     `);
//   };

//   const stopSpeaking = () => {
//     Speech.stop();
//     setIsSpeaking(false);
//   };

//   const handleWebViewMessage = (event) => {
//     const data = JSON.parse(event.nativeEvent.data);
//     console.log("WebView message:", data);
//     if (data.type === "speech") {
//       const transcribedText = data.text;
//       setInput(transcribedText);
//       sendMessage(transcribedText, true);
//       setIsListening(false);
//     } else if (data.type === "error") {
//       Alert.alert("Error", "Speech recognition failed: " + data.error);
//       setIsListening(false);
//     } else if (data.type === "end") {
//       setIsListening(false);
//     }
//   };

//   // Debounced sendMessage to prevent rapid requests
//   const sendMessage = debounce(async (text, fromVoice = false) => {
//     if (!text.trim()) return;
//     const userMessage = { sender: "user", text };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     try {
//       const userId = await SecureStore.getItemAsync("currentUserId");
//       const res = await axios.post(`${BACKEND_URL}/chat`, {
//         message: text,
//         speak: fromVoice,
//         userId,
//       });

//       let botText = res.data.response || "No response from AI";
//       botText = botText.replace(/[*#]/g, "");

//       const botMessage = { sender: "bot", text: botText };
//       setMessages((prev) => [...prev, botMessage]);

//       // Immediate navigation if triggerBooking is true
//       if (res.data.triggerBooking) {
//         navigation.navigate("nav"); // Replace "nav" with your target screen
//       } else if (fromVoice) {
//         setIsSpeaking(true);
//         Speech.speak(botText, {
//           onDone: () => setIsSpeaking(false),
//           onStopped: () => setIsSpeaking(false),
//           onError: () => setIsSpeaking(false),
//         });
//       }
//     } catch (err) {
//       console.error("Chat error:", err);
//       setMessages((prev) => [...prev, { sender: "bot", text: "Error talking to AI." }]);
//     }
//   }, 1000); // 1-second debounce

//   useEffect(() => {
//     scrollViewRef.current?.scrollToEnd({ animated: true });
//   }, [messages]);

//   return (
//     <View style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={80}
//       >
//         <ScrollView
//           ref={scrollViewRef}
//           style={styles.chatContainer}
//           contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
//           keyboardShouldPersistTaps="handled"
//         >
//           {messages.map((msg, idx) => (
//             <View
//               key={idx}
//               style={[
//                 styles.messageBubble,
//                 msg.sender === "user" ? styles.userBubble : styles.botBubble,
//               ]}
//             >
//               <Text style={styles.messageText}>{msg.text}</Text>
//             </View>
//           ))}
//         </ScrollView>

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             value={input}
//             onChangeText={setInput}
//             placeholder="Type a message..."
//             multiline
//           />
//           {isSpeaking ? (
//             <TouchableOpacity style={styles.stopButton} onPress={stopSpeaking}>
//               <Text style={styles.sendText}>Stop</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(input, false)}>
//               <Text style={styles.sendText}>Send</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity
//             style={styles.voiceButton}
//             onPress={isListening ? stopListening : startListening}
//           >
//             <Text style={styles.sendText}>{isListening ? "🎙..." : "🎤"}</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>

//       <WebView
//         ref={webviewRef}
//         source={{ html: "<html><body></body></html>" }}
//         style={{ height: 0, width: 0 }}
//         mediaPlaybackRequiresUserAction={false}
//         allowsInlineMediaPlayback={true}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         onMessage={handleWebViewMessage}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#e6ecf0",
//   },
//   chatContainer: {
//     flex: 1,
//     paddingHorizontal: 12,
//   },
//   messageBubble: {
//     marginVertical: 5,
//     padding: 12,
//     borderRadius: 18,
//     maxWidth: "80%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   userBubble: {
//     backgroundColor: "#007AFF",
//     alignSelf: "flex-end",
//   },
//   botBubble: {
//     backgroundColor: "#fff",
//     alignSelf: "flex-start",
//   },
//   messageText: {
//     color: "#000",
//     fontSize: 16,
//     lineHeight: 22,
//   },
//   inputContainer: {
//     position: "absolute",
//     bottom: 0,
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 8,
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderColor: "#ccc",
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginRight: 6,
//     maxHeight: 120,
//     minHeight: 40,
//     textAlignVertical: "top",
//   },
//   sendButton: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 25,
//   },
//   stopButton: {
//     backgroundColor: "#ff3b30",
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 25,
//   },
//   voiceButton: {
//     backgroundColor: "#34c759",
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 25,
//     marginLeft: 6,
//   },
//   sendText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });


import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import * as SecureStore from "expo-secure-store";
import { API_BASE2 } from "../../apiurl";
import { debounce } from "lodash"; // Added for debouncing

const BACKEND_URL = `${API_BASE2}`;

export default function ChatBotScreen({ navigation }) { // Added navigation prop
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(null);
  const webviewRef = useRef(null);
  const scrollViewRef = useRef(null);

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
        Alert.alert(
          "Permission Denied",
          "Microphone access is required for voice recognition. Please enable it in your device settings.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const startListening = async () => {
    if (isListening) return;

    if (hasMicPermission === null) {
      return;
    }

    if (!hasMicPermission) {
      const { status } = await Audio.requestPermissionsAsync();
      console.log("Re-requested microphone permission status:", status);
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Microphone access is required for voice recognition. Please enable it in your device settings.",
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
  };

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log("WebView message:", data);
    if (data.type === "speech") {
      const transcribedText = data.text;
      setInput(transcribedText);
      sendMessage(transcribedText, true);
      setIsListening(false);
    } else if (data.type === "error") {
      Alert.alert("Error", "Speech recognition failed: " + data.error);
      setIsListening(false);
    } else if (data.type === "end") {
      setIsListening(false);
    }
  };

  // Debounced sendMessage to prevent rapid requests
  const sendMessage = debounce(async (text, fromVoice = false) => {
    if (!text.trim()) return;
    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const userId = await SecureStore.getItemAsync("currentUserId");
      const res = await axios.post(`${BACKEND_URL}/chat`, {
        message: text,
        speak: fromVoice,
        userId,
      });

      let botText = res.data.response || "No response from AI";
      botText = botText.replace(/[*#]/g, "");

      const botMessage = { sender: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);

      // Immediate navigation if triggerBooking is true
      if (res.data.triggerBooking) {
        navigation.navigate("nav"); // Replace "nav" with your target screen
      } else if (fromVoice) {
        setIsSpeaking(true);
        Speech.speak(botText, {
          onDone: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error talking to AI." }]);
    }
  }, 1000); // 1-second debounce

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                msg.sender === "user" ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            multiline
          />
          {isSpeaking ? (
            <TouchableOpacity style={styles.stopButton} onPress={stopSpeaking}>
              <Text style={styles.sendText}>Stop</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(input, false)}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={isListening ? stopListening : startListening}
          >
            <Text style={styles.sendText}>{isListening ? "🎙..." : "🎤"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6ecf0",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  messageBubble: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 18,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#000",
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 6,
    maxHeight: 120,
    minHeight: 40,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
  },
  voiceButton: {
    backgroundColor: "#34c759",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    marginLeft: 6,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});