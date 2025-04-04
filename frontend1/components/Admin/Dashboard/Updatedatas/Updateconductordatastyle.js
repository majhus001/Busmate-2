import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  Admincontainer: {
    flex: 1,
    backgroundColor: "#f5f9ff", // Light blue background
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004aad", // Dark blue header
    textAlign: "center",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366", // Deep blue labels
    marginBottom: 5,
  },
  inputField: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#007bff", // Blue border
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    borderRadius: 8,
    color: "#333",
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: "#007bff", // Primary blue button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red", // Red color for delete action
    paddingVertical: 12, // Adds vertical padding
    paddingHorizontal: 20, // Adds horizontal padding
    borderRadius: 8, // Rounded corners
    alignItems: "center", // Centers text inside the button
    marginTop: 10, // Adds space above the button
  },
  buttonText: {
    color: "white", // White text color
    fontSize: 16, // Medium font size
    fontWeight: "bold", // Bold text
  },
});

export default styles;