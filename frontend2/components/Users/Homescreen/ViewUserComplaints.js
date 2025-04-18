import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/Ionicons";
import { API_BASE_URL } from "../../../apiurl"; 
const ViewUserComplaints = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [userId, setUserId] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await SecureStore.getItemAsync("currentUserId");
        if (id) {
          setUserId(id.trim());
        } else {
          setErrorMsg("User ID not found. Please log in again.");
          setLoading(false);
        }
      } catch (error) {
        setErrorMsg("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchComplaints = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/Usercomplaints/complaints/user/${userId}`
          );
          if (response.data?.complaints) {
            setComplaints(response.data.complaints);
          } else {
            setErrorMsg("No complaints found.");
          }
        } catch (error) {
          setErrorMsg(
            error.response?.data?.message || "Failed to fetch complaints"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchComplaints();
    }
  }, [userId]);

  const showComplaint = (item) => {
    setSelectedComplaint(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedComplaint(null);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading complaints...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.error}>{errorMsg}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.retryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Complaints</Text>
      {complaints.length === 0 ? (
        <Text style={styles.noComplaints}>No complaints found.</Text>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.busRouteNo}>
                    Bus Route: {item.busRouteNo || "Unknown"}
                  </Text>
                  <Text style={styles.issueType}>
                    Issue Type:{" "}
                    {item.issueType === "Other"
                      ? item.customIssueType || "Other"
                      : item.issueType}
                  </Text>
                  <Text numberOfLines={2} style={styles.complaintPreview}>
                    {item.complaint}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => showComplaint(item)}>
                  <Icon name="eye-outline" size={26} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Bus Route: {selectedComplaint?.busRouteNo || "Unknown"}
            </Text>
            <Text style={styles.modalSubTitle}>
              Issue:{" "}
              {selectedComplaint?.issueType === "Other"
                ? selectedComplaint?.customIssueType || "Other"
                : selectedComplaint?.issueType}
            </Text>
            <Text style={styles.modalText}>
              {selectedComplaint?.complaint}
            </Text>
            {selectedComplaint?.image && (
              <Image
                source={{ uri: selectedComplaint.image }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  error: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  noComplaints: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    minHeight: 140,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  busRouteNo: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  issueType: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#555",
  },
  complaintPreview: {
    fontSize: 14,
    color: "#777",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 12,
  },
  modalImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
  },
});

export default ViewUserComplaints;
