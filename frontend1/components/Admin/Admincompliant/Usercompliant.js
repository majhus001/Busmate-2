import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from "../../../apiurl";
const AdminUserComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [usernames, setUsernames] = useState({});

  // Fetch admin ID from SecureStore
  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const storedAdminId = await SecureStore.getItemAsync('userId');
        setAdminId(storedAdminId);
      } catch (error) {
        setErrorMsg('Failed to fetch admin ID');
      }
    };

    fetchAdminId();
  }, []);

  // Fetch complaints and corresponding usernames
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/Usercomplaints/complaints/admin/${adminId}`
      );
      const fetchedComplaints = response.data.complaints;

      const usernamesMap = {};
      for (const complaint of fetchedComplaints) {
        const username = await fetchUsername(complaint.userId);
        usernamesMap[complaint.userId] = username;
      }

      setComplaints(fetchedComplaints);
      setUsernames(usernamesMap);
      setErrorMsg('');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchData();
    }
  }, [adminId]);

  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/userdata/username/${userId}`
      );
      return response.data.username;
    } catch (error) {
      console.error('Failed to fetch username', error);
      return 'Unknown User';
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6c5ce7" />
        <Text style={styles.loaderText}>Loading complaints...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={50} color="#ff7675" />
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Complaints</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      {complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-outline" size={60} color="#a5b1c2" />
          <Text style={styles.emptyText}>No complaints found</Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.username}>
                  {usernames[item.userId] || 'Loading...'}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status || 'Pending'}</Text>
                </View>
              </View>
              
              <View style={styles.cardBody}>
                <View style={styles.field}>
                  <Ionicons name="alert-circle-outline" size={16} color="#6c5ce7" />
                  <Text style={styles.fieldText}>{item.issueType}</Text>
                </View>
                
                <View style={styles.field}>
                  <Ionicons name="time-outline" size={16} color="#6c5ce7" />
                  <Text style={styles.fieldText}>
                    {new Date(item.complaintTime).toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.complaintField}>
                  <Ionicons name="document-text-outline" size={16} color="#6c5ce7" />
                  <Text style={styles.complaintText}>{item.complaint}</Text>
                </View>
                
                {item.image && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#6c5ce7']}
              tintColor="#6c5ce7"
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const getStatusColor = (status) => {
    const lowerStatus = typeof status === 'string' ? status.toLowerCase() : '';
    switch (lowerStatus) {
      case 'resolved':
        return '#00b894';
      case 'in progress':
        return '#0984e3';
      case 'rejected':
        return '#d63031';
      default:
        return '#fdcb6e'; // Pending or unknown
    }
  };
  

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loaderText: {
    marginTop: 10,
    color: '#6c5ce7',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6c5ce7',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  refreshButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#636e72',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f6fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  cardBody: {
    padding: 16,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#636e72',
  },
  complaintField: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  complaintText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#2d3436',
    lineHeight: 20,
  },
  imageContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
});

export default AdminUserComplaint;