import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../../../apiurl";

const NotificationAlert = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [conductorId, setConductorId] = useState(null);

  useEffect(() => {
    const fetchStoredUserData = async () => {
      try {
        const storedUserData = await SecureStore.getItemAsync("currentUserData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          const conductorId = userData._id;
          if (conductorId) {
            setConductorId(conductorId);
          } else {
            setErrorMsg("Conductor ID not found in user data.");
            setLoading(false);
          }
        } else {
          setErrorMsg("User data not found. Please log in again.");
          setLoading(false);
        }
      } catch (error) {
        setErrorMsg("Failed to fetch user data. Please try again.");
        setLoading(false);
      }
    };

    fetchStoredUserData();
  }, []);

  useEffect(() => {
    if (conductorId) {
      const fetchComplaints = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/Usercomplaints/complaints/conductor/${conductorId}`
          );

          if (response.data && response.data.complaints) {
            const sortedComplaints = response.data.complaints.sort(
              (a, b) => new Date(b.complaintTime) - new Date(a.complaintTime)
            );
            setComplaints(sortedComplaints);
          } else {
            setErrorMsg("No complaints found for this conductor.");
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
  }, [conductorId]);

  useEffect(() => {
    const uniqueUserIds = [
      ...new Set(
        complaints.map((item) =>
          typeof item.userId === "string" ? item.userId : item.userId?._id
        )
      ),
    ];

    uniqueUserIds.forEach((userId) => {
      if (userId && !usernames[userId]) {
        fetchUsername(userId);
      }
    });
  }, [complaints]);

  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/userdata/username/${userId}`);
      const fetchedUsername = response.data?.username || "Unknown";
      setUsernames((prev) => ({ ...prev, [userId]: fetchedUsername }));
    } catch (error) {
      console.log("Error fetching username:", error.message);
      setUsernames((prev) => ({ ...prev, [userId]: "Unknown" }));
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
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
      <Text style={styles.title}>Notification</Text>
      {complaints.length === 0 ? (
        <Text style={styles.noComplaints}>No complaints found.</Text>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const userId =
              typeof item.userId === "string"
                ? item.userId
                : item.userId?._id || "";

            return (
              <View style={styles.card}>
                <Text style={styles.field}>
                  Complaint from <Text style={styles.username}>{usernames[userId] || "Loading..."}</Text>
                </Text>
                <Text style={styles.complaintText}>{item.complaint}</Text>
                <Text style={styles.timeText}>
                  {new Date(item.complaintTime).toLocaleString()}
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
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
    backgroundColor: "#007BFF",
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
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  noComplaints: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },
  field: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
  },
  username: {
    color: "#007BFF",
  },
  complaintText: {
    fontSize: 14,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: "gray",
    textAlign: "right",
  },
});

export default NotificationAlert;
