import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { API_BASE_URL } from "../../../apiurl";
import styles from "./Tickethistorystyles.js";

const TicketHistory = () => {
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const init = async () => {
      const id = await fetchId();
      if (id) fetchTransactions(id);
    };
    init();
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
                  <View style={[
                    styles.statusIndicator,
                    item.status === 'success' ? styles.statusSuccess :
                    item.status === 'pending' ? styles.statusPending : styles.statusFailed
                  ]} />
                  <Text style={[
                    styles.statusText,
                    item.status === 'success' ? styles.statusTextSuccess :
                    item.status === 'pending' ? styles.statusTextPending : styles.statusTextFailed
                  ]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
                <Text style={styles.orderIdText}>Order ID: {item.orderId}</Text>
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
