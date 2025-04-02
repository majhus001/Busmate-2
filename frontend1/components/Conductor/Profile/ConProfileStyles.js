import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65, // Circular image
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#4A90E2", // Attractive blue border
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50", // Dark modern text
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#34495e",
  },
  value: {
    fontSize: 17,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 30,
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
  },
  combtn:{
    display:"flex",
    flexDirection:"row",
    gap: 10,
  },
});

export default styles;
