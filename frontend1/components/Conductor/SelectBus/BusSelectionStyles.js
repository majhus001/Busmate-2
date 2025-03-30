import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  picker: {
    marginTop: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
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
