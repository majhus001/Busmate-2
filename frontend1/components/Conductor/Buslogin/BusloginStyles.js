import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF4FF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2A4365",
    marginBottom: 30,
    textAlign: "center",
  },

  infoBox: {
    backgroundColor: "#2B6CB0",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },

  infoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F7FAFC",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#2B6CB0",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
