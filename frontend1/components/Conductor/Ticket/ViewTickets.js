import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../../../apiurl';

const ViewTickets = ({ route, navigation }) => {
  const { busRouteNo, ticketsData } = route.params || {};
  const [activeTab, setActiveTab] = useState('onboard');
  const [loading, setLoading] = useState(true);
  const [onboardTickets, setOnboardTickets] = useState([]);
  const [onlineTickets, setOnlineTickets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];

      // Fetch onboard tickets (from tickets collection)
      const onboardResponse = await axios.get(
        `${API_BASE_URL}/api/tickets/bus-tickets/${busRouteNo}`,
        {
          params: {
            date: currentDate
          }
        }
      );

      // Fetch online tickets (from onlinetickets collection)
      const onlineResponse = await axios.get(
        `${API_BASE_URL}/api/payment/bus-tickets/${busRouteNo}`,
        {
          params: {
            date: currentDate
          }
        }
      );

      setOnboardTickets(onboardResponse.data.tickets || []);

      // Get tickets and usernames from response
      const tickets = onlineResponse.data.tickets || [];
      const usernames = onlineResponse.data.usernames || [];

      // Associate usernames with tickets
      const ticketsWithUsernames = tickets.map((ticket, index) => ({
        ...ticket,
        username: usernames[index] || 'Unknown User'
      }));

      console.log('Tickets with usernames:', ticketsWithUsernames);
      setOnlineTickets(ticketsWithUsernames);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      Alert.alert('Error', 'Failed to fetch tickets. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const renderOnboardTicket = ({ item }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>Ticket #{item._id.substring(item._id.length - 6)}</Text>
        <Text style={[styles.paymentBadge,
          { backgroundColor: item.paymentMethod === 'Cash' ? '#10b981' : '#3b82f6' }]}>
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
            {new Date(item.issuedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
      </View>

      <View style={styles.ticketFooter}>
        <View style={[styles.statusBadge,
          { backgroundColor: item.checkout ? '#cbd5e1' : '#fbbf24' }]}>
          <Text style={styles.statusText}>
            {item.checkout ? 'Checked Out' : 'Active'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderOnlineTicket = ({ item }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>Order #{item.orderId.substring(0, 6)}</Text>
        <Text style={[styles.paymentBadge, { backgroundColor: '#3b82f6' }]}>
          Online
        </Text>
      </View>

      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Pasanger Name:</Text>
          <Text style={styles.detailValue}>{item.username}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>No of Tickets:</Text>
          <Text style={styles.detailValue}>{item.ticketcount}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bus No:</Text>
          <Text style={styles.detailValue}>{item.busno}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount:</Text>
          <Text style={styles.detailValue}>₹{(item.amount).toFixed(2)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={[styles.detailValue,
            { color: item.status === 'paid' ? '#10b981' :
                    item.status === 'failed' ? '#ef4444' : '#f59e0b' }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Issued:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
          style={[styles.tab, activeTab === 'onboard' && styles.activeTab]}
          onPress={() => setActiveTab('onboard')}
        >
          <Text style={[styles.tabText, activeTab === 'onboard' && styles.activeTabText]}>
            Onboard ({onboardTickets.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'online' && styles.activeTab]}
          onPress={() => setActiveTab('online')}
        >
          <Text style={[styles.tabText, activeTab === 'online' && styles.activeTabText]}>
            Online ({onlineTickets.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading tickets...</Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'onboard' ? onboardTickets : onlineTickets}
          renderItem={activeTab === 'onboard' ? renderOnboardTicket : renderOnlineTicket}
          keyExtractor={(item) => item._id || item.orderId}
          contentContainerStyle={styles.listContainer}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="receipt-long" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No {activeTab} tickets found</Text>
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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  paymentBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  ticketDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  },
});

export default ViewTickets;
