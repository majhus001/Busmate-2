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
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import axios from "axios";
import { API_BASE_URL } from "../../../apiurl";
import styles from "./Tickethistorystyles.js";
import { Feather } from "@expo/vector-icons"; // Download icon

const TicketHistory = () => {
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
      const response = await axios.get(`${API_BASE_URL}/api/payment/transactions/${id}`);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("❌ Error fetching transactions:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Send Notification
  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✅ Ticket Downloaded",
        body: "Your ticket has been saved successfully!",
      },
      trigger: null,
    });
  };
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
        // 📂 Request Storage Access Framework (SAF) permissions
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          Alert.alert("Permission Denied", "Please allow storage access.");
          return;
        }
  
        // 📝 Create file in Downloads folder
        const externalUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri, 
          fileName, 
          "application/pdf"
        );
  
        // 📄 Write the file content
        const fileContent = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        await FileSystem.writeAsStringAsync(externalUri, fileContent, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        console.log("✅ Ticket saved in Downloads folder:", externalUri);
        Alert.alert("Success", "Ticket saved in your Downloads folder.");
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }
      }
  
      // 🔔 Send notification
      await Notifications.scheduleNotificationAsync({
        content: { title: "✅ Ticket Downloaded", body: "Your ticket is saved successfully!" },
        trigger: null,
      });
  
    } catch (error) {
      console.error("❌ Error downloading ticket:", error.message);
      Alert.alert("Error", error.message || "Failed to save the ticket.");
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
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ticket History</Text>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.orderId}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.busInfoContainer}>
                <Text style={styles.busNumberText}>Bus No: {item.busno}</Text>
                <Text style={styles.amountText}>₹{item.amount / 100}</Text>
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
                  ]}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>

              <View style={styles.downloadContainer}>
                <Text style={styles.orderIdText}>Order ID: {item.orderId}</Text>
                <TouchableOpacity onPress={() => downloadTicket(item)}>
                  <Feather name="download" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No ticket history found</Text>
        </View>
      )}
    </View>
  );
};

export default TicketHistory;
