import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#343a40",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#495057",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ced4da",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    
  },
  complaintContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  complaintText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#00c107",
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 5,
  },
});

