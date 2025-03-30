import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9FAFB",
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
