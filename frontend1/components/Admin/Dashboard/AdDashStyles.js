import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
    textAlign: "center",
  },

  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  dashheader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width:"100%",
    height:150,
    marginVertical: 25,
    gap:10,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#0056b3",
    borderWidth: 2,
    marginRight: 12,
  },

  welcomeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#007bff",
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
    color: "#fff",
    marginBottom: 8,
    fontWeight: "bold",
    textAlign: "center",
  },

  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
