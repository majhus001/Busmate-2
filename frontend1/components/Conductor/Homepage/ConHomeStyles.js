import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff", // Light blue background
    alignItems: "center",
    paddingTop: 40,
  },
  header: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  mapContainer: {
    flex: 1, 
    width: "100%",
    height: 400, // Adjust height as needed
    marginTop: 10,
  },
  
  panelName: {
    fontSize: 18,
    color: "#f8f9fa",
    marginTop: 3,
    fontStyle: "italic",
  },
  detailsContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    width: "85%",
    alignItems: "flex-start",
    marginTop: 50,
    shadowColor: "#007bff",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
    textAlign: "center",
    width: "100%",
  },
  detailText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginTop: 30,
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default styles;
