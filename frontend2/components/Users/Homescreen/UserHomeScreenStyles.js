import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F6FC",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2C3E50",
  },
  pickerContainer: {
    flex: 0.4, // Reduced space for pickers
  },
  picker: {
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 2,
  },
  searchButton: {
    backgroundColor: "#2980B9",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  busListContainer: {
    flex: 0.6, // Increased space for bus listing
  },
  busCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  busName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495E",
  },
  busDetails: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  column: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  trackButton: {
    backgroundColor: "#1ABC9C",
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  trackButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default styles;
