import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0056b3",
    marginBottom: 20,
    textAlign: "center",
  },

  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderColor: "#007bff",
    borderWidth: 3,
  },

  welcomeText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    fontWeight: "bold",
  },

  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
