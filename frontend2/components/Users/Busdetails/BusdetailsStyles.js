import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EAF2F8",
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#111",
  },
  // Header
  header: {
    backgroundColor: "#1E90FF",
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  darkHeader: {
    backgroundColor: "#4DA8FF",
  },
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
  darkTitle: {
    color: "#FFFFFF",
  },
  routeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    marginBottom: 10,
  },
  darkRouteText: {
    color: "#FFFFFF",
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
  darkCard: {
    backgroundColor: "#222",
    shadowColor: "#000",
  },
  // Labels and Values
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  darkLabel: {
    color: "#AAAAAA",
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E90FF",
    marginBottom: 12,
  },
  darkValue: {
    color: "#4DA8FF",
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
  darkActive: {
    backgroundColor: "#1A3C34",
    borderColor: "#2ECC71",
  },
  inactive: {
    backgroundColor: "#FADBD8",
    borderColor: "#E74C3C",
    borderWidth: 2,
  },
  darkInactive: {
    backgroundColor: "#3C1A1A",
    borderColor: "#E74C3C",
  },
  statusText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  darkStatusText: {
    color: "#FFFFFF",
  },
  // Action Buttons
  trackButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  darkTrackButton: {
    backgroundColor: "#4DA8FF",
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  payButton: {
    backgroundColor: "green", // Vibrant green for payment
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  darkPayButton: {
    backgroundColor: "#2ECC71", // Slightly lighter green for dark mode
    shadowColor: "#000",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  darkBackButton: {
    backgroundColor: "#495057",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});