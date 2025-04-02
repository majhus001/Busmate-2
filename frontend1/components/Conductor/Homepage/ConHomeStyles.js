import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7", // Soft background for a modern look
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#007bff", // Deep blue for a professional touch
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  panelName: {
    fontSize: 18,
    color: "#d1d5db",
    marginTop: 5,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  condetails: {
    padding: 15,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
    color: "#1f2937",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  mapContainer: {
    flex: 1,
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default styles;