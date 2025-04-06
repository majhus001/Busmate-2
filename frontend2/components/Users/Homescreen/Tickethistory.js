import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import axios from "axios";
import { API_BASE_URL } from "../../../apiurl";
import styles from "./Tickethistorystyles.js"; // Ensure this path is correct
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "../../../LanguageContext"; // Ensure this path is correct
import Footer from "./Footer.js";

// Define translations for all text in the component
const translations = {
  English: {
    title: "Ticket History",
    busNo: "Bus No:",
    orderId: "Order ID:",
    noHistory: "No ticket history found",
    success: "Success",
    pending: "Pending",
    failed: "Failed",
    downloadSuccessTitle: "✅ Ticket Downloaded",
    downloadSuccessBody: "Your ticket is saved successfully!",
    downloadSuccessAlert: "Ticket saved in your Downloads folder.",
    permissionDenied: "Permission Denied",
    permissionDeniedMessage: "Please allow storage access.",
    error: "Error",
    errorMessage: "Failed to save the ticket.",
  },
  Tamil: {
    title: "டிக்கெட் வரலாறு",
    busNo: "பேருந்து எண்:",
    orderId: "ஆர்டர் ஐடி:",
    noHistory: "டிக்கெட் வரலாறு எதுவும் இல்லை",
    success: "வெற்றி",
    pending: "நிலுவையில்",
    failed: "தோல்வி",
    downloadSuccessTitle: "✅ டிக்கெட் பதிவிறக்கம்",
    downloadSuccessBody: "உங்கள் டிக்கெட் வெற்றிகரமாக சேமிக்கப்பட்டது!",
    downloadSuccessAlert:
      "உங்கள் பதிவிறக்கங்கள் கோப்புறையில் டிக்கெட் சேமிக்கப்பட்டது.",
    permissionDenied: "அனுமதி மறுக்கப்பட்டது",
    permissionDeniedMessage: "சேமிப்பக அணுகலை அனுமதிக்கவும்.",
    error: "பிழை",
    errorMessage: "டிக்கெட்டை சேமிக்க முடியவில்லை.",
  },
  Hindi: {
    title: "टिकट इतिहास",
    busNo: "बस नंबर:",
    orderId: "ऑर्डर आईडी:",
    noHistory: "कोई टिकट इतिहास नहीं मिला",
    success: "सफल",
    pending: "लंबित",
    failed: "असफल",
    downloadSuccessTitle: "✅ टिकट डाउनलोड हुआ",
    downloadSuccessBody: "आपका टिकट सफलतापूर्वक सहेजा गया है!",
    downloadSuccessAlert: "आपके डाउनलोड फ़ोल्डर में टिकट सहेजा गया है।",
    permissionDenied: "अनुमति अस्वीकृत",
    permissionDeniedMessage: "कृपया स्टोरेज एक्सेस की अनुमति दें।",
    error: "त्रुटि",
    errorMessage: "टिकट सहेजने में विफल।",
  },
};

const TicketHistory = ({ navigation }) => {
  const { language, darkMode } = useLanguage(); // Use the language context with darkMode
  const t = translations[language] || translations.English; // Fallback to English

  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch User ID from SecureStore
  const fetchId = async () => {
    try {
      const id = await SecureStore.getItemAsync("currentUserId");
      if (id) {
        console.log("✅ Retrieved ID:", id);
        setUserId(id);
        return id;
      } else {
        console.warn("⚠️ No ID found in SecureStore");
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching ID:", error);
      return null;
    }
  };

  // Fetch Transactions
  const fetchTransactions = async (id) => {
    if (!id) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/payment/transactions/${id}`
      );
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error(
        "❌ Error fetching transactions:",
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Download Ticket
  const downloadTicket = async (item) => {
    try {
      const ticketUrl = `${API_BASE_URL}/api/payment/ticket/${item.orderId}`;
      const fileName = `Ticket_${item.orderId}.pdf`;
      const internalUri = `${FileSystem.documentDirectory}${fileName}`;

      console.log("📥 Downloading ticket:", ticketUrl);
      const { uri } = await FileSystem.downloadAsync(ticketUrl, internalUri);
      if (!uri) throw new Error("Download failed. File URI is empty.");

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error("Downloaded file does not exist.");

      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          Alert.alert(t.permissionDenied, t.permissionDeniedMessage);
          return;
        }

        const externalUri =
          await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            "application/pdf"
          );

        const fileContent = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.writeAsStringAsync(externalUri, fileContent, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log("✅ Ticket saved in Downloads folder:", externalUri);
        Alert.alert(t.success, t.downloadSuccessAlert);
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }
      }

      await Notifications.scheduleNotificationAsync({
        content: { title: t.downloadSuccessTitle, body: t.downloadSuccessBody },
        trigger: null,
      });
    } catch (error) {
      console.error("❌ Error downloading ticket:", error.message);
      Alert.alert(t.error, error.message || t.errorMessage);
    }
  };

  // Initial Setup
  useEffect(() => {
    const init = async () => {
      const id = await fetchId();
      if (id) fetchTransactions(id);
    };
    init();
    Notifications.requestPermissionsAsync();
  }, []);

  if (loading) {
    return (
      <View
        style={[styles.loaderContainer, darkMode && styles.darkLoaderContainer]}
      >
        <ActivityIndicator
          size="large"
          color={darkMode ? "#4DA8FF" : "#0000ff"}
        />
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, darkMode && styles.darkContainer]}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>
          {t.title}
        </Text>
        {transactions.length > 0 ? (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.orderId}
            renderItem={({ item }) => (
              <View style={[styles.card, darkMode && styles.darkCard]}>
                <View
                  style={[
                    styles.busInfoContainer,
                    darkMode && styles.darkBusInfoContainer,
                  ]}
                >
                  <Text
                    style={[
                      styles.busNumberText,
                      darkMode && styles.darkBusNumberText,
                    ]}
                  >
                    {t.busNo} {item.busno}
                  </Text>
                  <Text
                    style={[
                      styles.amountText,
                      darkMode && styles.darkAmountText,
                    ]}
                  >
                    ₹{item.amount / 100}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusIndicator,
                      item.status === "success"
                        ? styles.statusSuccess
                        : item.status === "pending"
                        ? styles.statusPending
                        : styles.statusFailed,
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      item.status === "success"
                        ? styles.statusTextSuccess
                        : item.status === "pending"
                        ? styles.statusTextPending
                        : styles.statusTextFailed,
                      darkMode && styles.darkStatusText,
                    ]}
                  >
                    {t[item.status] ||
                      item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                  </Text>
                </View>

                <View style={styles.downloadContainer}>
                  <Text
                    style={[
                      styles.orderIdText,
                      darkMode && styles.darkOrderIdText,
                    ]}
                  >
                    {t.orderId} {item.orderId}
                  </Text>
                  <TouchableOpacity onPress={() => downloadTicket(item)}>
                    <Feather
                      name="download"
                      size={24}
                      color={darkMode ? "#FFFFFF" : "#000000"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <View
            style={[
              styles.emptyContainer,
              darkMode && styles.darkEmptyContainer,
            ]}
          >
            <Text style={[styles.emptyText, darkMode && styles.darkEmptyText]}>
              {t.noHistory}
            </Text>
          </View>
        )}
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

export default TicketHistory;
