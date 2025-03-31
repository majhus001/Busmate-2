import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EAF2F8",
    padding: 20,
  },

  // Header
  header: {
    backgroundColor: "#1E90FF",
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },

  // Info Section
  infoContainer: {
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Labels and Values
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E90FF",
    marginBottom: 12,
  },

  // Status Card
  statusCard: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  active: {
    backgroundColor: "#D1F2EB",
    borderColor: "#2ECC71",
    borderWidth: 2,
  },
  inactive: {
    backgroundColor: "#FADBD8",
    borderColor: "#E74C3C",
    borderWidth: 2,
  },
  statusText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },

  // Action Buttons
  trackButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  routeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop:10,
    marginBottom: 10,
  },
  
});

export default styles;
