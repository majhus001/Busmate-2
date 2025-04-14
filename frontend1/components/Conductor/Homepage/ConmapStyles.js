// ConmapStyles.js
import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    padding: 20,
  },
  infoContainer: {
    backgroundColor: "#ffffffee",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginVertical: 2,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerPin: {
    width: 18,
    height: 18,
    backgroundColor: "#007AFF",
    borderRadius: 9,
    borderColor: "#fff",
    borderWidth: 2,
    zIndex: 2,
  },
  markerPulse: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#007AFF55",
    position: "absolute",
    zIndex: 1,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#333',
  },
  connected: {
    color: 'green',
    fontWeight: 'bold',
  },
  disconnected: {
    color: 'red',
    fontWeight: 'bold',
  }
});
