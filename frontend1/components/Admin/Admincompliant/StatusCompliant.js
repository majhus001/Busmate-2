import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity 
} from "react-native";
import axios from "axios";
import styles from "../../Conductor/Complaintform/ViewComplaintFormStyles"; 
import { API_BASE_URL } from "../../../apiurl"; 

const StatusCompliant = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Conductor/complaints`);
      const unresolvedComplaints = response.data.filter(item => item.status === false);
      setComplaints(unresolvedComplaints); // Store unresolved complaints
    } catch (error) {
      Alert.alert("Error", "Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/api/Conductor/complaints/accept/${id}`);
      Alert.alert("Success", "Complaint accepted.");
      fetchComplaints(); // Refresh list
    } catch (error) {
      Alert.alert("Error", "Failed to accept complaint.");
    }
  };

  const handleDecline = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/Conductor/complaints/decline/${id}`);
      Alert.alert("Success", "Complaint declined and deleted.");
      fetchComplaints(); // Refresh list
    } catch (error) {
      Alert.alert("Error", "Failed to delete complaint.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.complaintCard}>
      <Text style={styles.issueType}>{item.issueType}</Text>
      <Text style={styles.complaintText}>{item.complaint}</Text>
      <Text style={styles.timeText}>Submitted: {new Date(item.complaintTime).toLocaleString()}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}

      {/* Accept & Decline Buttons */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.declineButton} onPress={() => handleDecline(item._id)}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item._id)}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>

        
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unresolved Complaints</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : complaints.length === 0 ? (
        <Text style={styles.noDataText}>No unresolved complaints.</Text>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default StatusCompliant;