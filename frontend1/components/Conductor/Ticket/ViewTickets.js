import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "../../../apiurl";

const ViewTickets = ({ route, navigation }) => {
  const { busRouteNo, ticketsData } = route.params || {};
  const [activeTab, setActiveTab] = useState("onboard");
  const [loading, setLoading] = useState(true);
  const [onboardTickets, setOnboardTickets] = useState([]);
  const [onlineTickets, setOnlineTickets] = useState([]);
  const [expandedTickets, setExpandedTickets] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [checkInFilter, setCheckInFilter] = useState('all'); // 'all', 'checked-in', 'not-checked-in'
  const [seatUpdateModalVisible, setSeatUpdateModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newSeatCount, setNewSeatCount] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Fetch onboard tickets (from tickets collection)
      const onboardResponse = await axios.get(
        `${API_BASE_URL}/api/tickets/bus-tickets/${busRouteNo}`,
        {
          params: {
            date: currentDate,
          },
        }
      );

      // Fetch online tickets (from onlinetickets collection)
      const onlineResponse = await axios.get(
        `${API_BASE_URL}/api/payment/bus-tickets/${busRouteNo}`,
        {
          params: {
            date: currentDate,
          },
        }
      );

      setOnboardTickets(onboardResponse.data.tickets || []);

      // Get tickets and usernames from response
      const tickets = onlineResponse.data.tickets || [];
      const usernames = onlineResponse.data.usernames || [];

      // Associate usernames with tickets
      const ticketsWithUsernames = tickets.map((ticket, index) => ({
        ...ticket,
        username: usernames[index] || "Unknown User",
      }));

      console.log("Tickets with usernames:", ticketsWithUsernames);
      setOnlineTickets(ticketsWithUsernames);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      Alert.alert("Error", "Failed to fetch tickets. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const toggleExpandTicket = (ticketId) => {
    setExpandedTickets((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  const handleCheckIn = async (ticketId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/payment/check-in/${ticketId}`
      );

      if (response.data.success) {
        Alert.alert("Success", "Passenger checked in successfully");
        // Refresh tickets to show updated status
        fetchTickets();
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to check in passenger"
        );
      }
    } catch (error) {
      console.error("Error checking in passenger:", error);
      Alert.alert("Error", "Failed to check in passenger. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeats = (ticket) => {
    setSelectedTicket(ticket);
    setNewSeatCount(ticket.ticketcount || '1');
    setSeatUpdateModalVisible(true);
  };

  const submitSeatUpdate = async () => {
    if (!selectedTicket || !newSeatCount) {
      Alert.alert("Error", "Please enter a valid number of seats");
      return;
    }

    const seatCount = parseInt(newSeatCount, 10);
    if (isNaN(seatCount) || seatCount < 1) {
      Alert.alert("Error", "Please enter a valid number of seats");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await axios.put(
        `${API_BASE_URL}/api/payment/update-seats/${selectedTicket._id}`,
        { ticketcount: seatCount }
      );

      if (response.data.success) {
        // Update the ticket in the state
        setOnlineTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === selectedTicket._id
              ? { ...ticket, ticketcount: seatCount.toString() }
              : ticket
          )
        );
        Alert.alert("Success", "Ticket seats updated successfully");
        setSeatUpdateModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating ticket seats:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update ticket seats"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter online tickets based on check-in status
  const getFilteredOnlineTickets = () => {
    if (checkInFilter === 'all') {
      return onlineTickets;
    } else if (checkInFilter === 'checked-in') {
      return onlineTickets.filter(ticket => ticket.checkIn === true);
    } else { // not-checked-in
      return onlineTickets.filter(ticket => ticket.checkIn !== true);
    }
  };

  const renderOnboardTicket = ({ item }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>
          Ticket #{item._id.substring(item._id.length - 6)}
        </Text>
        <Text
          style={[
            styles.paymentBadge,
            {
              backgroundColor:
                item.paymentMethod === "Cash" ? "#10b981" : "#3b82f6",
            },
          ]}
        >
          {item.paymentMethod}
        </Text>
      </View>

      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>From:</Text>
          <Text style={styles.detailValue}>{item.boarding}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>To:</Text>
          <Text style={styles.detailValue}>{item.destination}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tickets:</Text>
          <Text style={styles.detailValue}>{item.ticketCount}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount:</Text>
          <Text style={styles.detailValue}>₹{item.ticketPrice.toFixed(2)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Issued:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.issuedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>

      <View style={styles.ticketFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.checkout ? "#cbd5e1" : "#fbbf24" },
          ]}
        >
          <Text style={styles.statusText}>
            {item.checkout ? "Checked Out" : "Active"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderOnlineTicket = ({ item }) => {
    const isExpanded = expandedTickets[item._id];
    const isCheckedIn = item.checkIn;

    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() => toggleExpandTicket(item._id)}
        activeOpacity={0.7}
      >
        <View style={styles.ticketHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.ticketId}>
              Order #{item.orderId.substring(0, 6)}
            </Text>
            <MaterialIcons
              name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={20}
              color="#64748b"
              style={{ marginLeft: 8 }}
            />
          </View>

          <Text
            style={[
              styles.detailValue,
              { color: isCheckedIn ? "#10b981" : "#f59e0b" },
            ]}
          >
            {isCheckedIn ? "Checked In" : "Not Checked In"}
          </Text>
        </View>

        {/* Always visible basic info */}
        <View style={styles.basicInfo}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Passenger:</Text>
            <Text style={styles.detailValue}>{item.username}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailValue}>
              {item.fromLocation}
              {"  "}
              <Ionicons
                name="arrow-forward"
                size={18}
                color="green"
                style={{ top: 50 }}
              />
              {"  "}
              {item.toLocation}
            </Text>
          </View>
        </View>

        {/* Expandable detailed info */}
        {isExpanded && (
          <View style={styles.expandedDetails}>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>No of Tickets:</Text>
              <Text style={styles.detailValue}>{item.ticketcount || 1}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bus No:</Text>
              <Text style={styles.detailValue}>{item.busno}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>₹{item.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      item.status === "created"
                        ? "#10b981"
                        : item.status === "failed"
                        ? "#ef4444"
                        : "#f59e0b",
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="green"
                  style={{ top: 5 }}
                />
                {item.status === "created" ? "Paid" : item.status}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Issued:</Text>
              <Text style={styles.detailValue}>
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-in Status:</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: isCheckedIn ? "#10b981" : "#f59e0b" },
                ]}
              >
                {isCheckedIn ? "Checked In" : "Not Checked In"}
              </Text>
            </View>

            {/* Check-in button */}
            {!isCheckedIn && item.status === "created" && (
              <TouchableOpacity
                style={styles.checkInButton}
                onPress={() => handleCheckIn(item._id)}
              >
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color="#ffffff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.checkInButtonText}>Check In Passenger</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Seat Update Modal */}
      <Modal
        visible={seatUpdateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSeatUpdateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Ticket Seats</Text>
              <TouchableOpacity
                onPress={() => setSeatUpdateModalVisible(false)}
                style={styles.closeButton}
              >
                <AntDesign name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>
              Current Seats: {selectedTicket?.ticketcount || '1'}
            </Text>

            <Text style={styles.modalLabel}>New Seat Count:</Text>
            <TextInput
              style={styles.seatInput}
              value={newSeatCount}
              onChangeText={setNewSeatCount}
              keyboardType="number-pad"
              placeholder="Enter number of seats"
            />

            <TouchableOpacity
              style={[styles.updateButton, isUpdating && styles.disabledButton]}
              onPress={submitSeatUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <MaterialIcons name="edit" size={16} color="#ffffff" style={{marginRight: 8}} />
                  <Text style={styles.updateButtonText}>Update Seats</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tickets - Bus {busRouteNo}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "onboard" && styles.activeTab]}
          onPress={() => setActiveTab("onboard")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "onboard" && styles.activeTabText,
            ]}
          >
            Onboard ({onboardTickets.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "online" && styles.activeTab]}
          onPress={() => setActiveTab("online")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "online" && styles.activeTabText,
            ]}
          >
            Online ({onlineTickets.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Check-in filter buttons - only show for online tickets */}
      {activeTab === 'online' && (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, checkInFilter === 'all' && styles.activeFilterButton]}
            onPress={() => setCheckInFilter('all')}
          >
            <Text style={[styles.filterText, checkInFilter === 'all' && styles.activeFilterText]}>
              All ({onlineTickets.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, checkInFilter === 'checked-in' && styles.activeFilterButton]}
            onPress={() => setCheckInFilter('checked-in')}
          >
            <Ionicons
              name="checkmark-circle"
              size={14}
              color={checkInFilter === 'checked-in' ? '#3b82f6' : '#64748b'}
              style={{marginRight: 4}}
            />
            <Text style={[styles.filterText, checkInFilter === 'checked-in' && styles.activeFilterText]}>
              Checked In ({onlineTickets.filter(t => t.checkIn === true).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, checkInFilter === 'not-checked-in' && styles.activeFilterButton]}
            onPress={() => setCheckInFilter('not-checked-in')}
          >
            <Ionicons
              name="time-outline"
              size={14}
              color={checkInFilter === 'not-checked-in' ? '#3b82f6' : '#64748b'}
              style={{marginRight: 4}}
            />
            <Text style={[styles.filterText, checkInFilter === 'not-checked-in' && styles.activeFilterText]}>
              Not Checked In ({onlineTickets.filter(t => t.checkIn !== true).length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading tickets...</Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === "onboard" ? onboardTickets : getFilteredOnlineTickets()}
          renderItem={
            activeTab === "onboard" ? renderOnboardTicket : renderOnlineTicket
          }
          keyExtractor={(item) => item._id || item.orderId}
          contentContainerStyle={styles.listContainer}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="receipt-long" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>
                {activeTab === 'online' && checkInFilter !== 'all'
                  ? `No ${checkInFilter === 'checked-in' ? 'checked-in' : 'pending check-in'} tickets found`
                  : `No ${activeTab} tickets found`}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  activeTabText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  ticketCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  ticketId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  paymentBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  ticketDetails: {
    marginBottom: 12,
  },
  basicInfo: {
    marginBottom: 8,
  },
  expandedDetails: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  checkInButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  checkInButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748b",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  activeFilterButton: {
    backgroundColor: '#e0f2fe',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  activeFilterText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

export default ViewTickets;
