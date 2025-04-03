import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F7FF", // Light Blue Theme
    padding: 15,
    marginVertical:10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007BFF", // Primary Blue
    textAlign: "center",
    marginBottom: 15,
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1E9FF",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F8FAFF",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  picker: {
    height: 50,
    color: "#007BFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0056B3",
    marginTop: 15,
    marginBottom: 8,
  },
  timePickerButton: {
    backgroundColor: "#D1E9FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  timePickerText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonPrimaryText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  buttonDelete: {
    backgroundColor: "#FF4D4D",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDeleteText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
