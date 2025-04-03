import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, FlatList, ActivityIndicator, Alert 
} from "react-native";
import axios from "axios";
import styles from "./ViewComplaintFormStyles"; 
import { API_BASE_URL } from "../../../apiurl"; 

const ViewComplaintForm = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Conductor/complaints`); // Fetch all complaints
        const filteredComplaints = response.data.filter(item => item.status === true); // Filter unresolved complaints
        setComplaints(filteredComplaints); // Remove slice(0, 3) to show all complaints
      } catch (error) {
        Alert.alert("Error", "Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);  

  const renderItem = ({ item }) => (
    <View style={styles.complaintCard}>
      <Text style={styles.issueType}>{item.issueType}</Text>
      <Text style={styles.complaintText}>{item.complaint}</Text>
      <Text style={styles.timeText}>Submitted: {new Date(item.complaintTime).toLocaleString()}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaints</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : complaints.length === 0 ? (
        <Text style={styles.noDataText}>No unresolved complaints.</Text>
      ) : (
        <FlatList
          data={complaints} // Now displaying all complaints
          keyExtractor={(item) => item._id} 
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default ViewComplaintForm;