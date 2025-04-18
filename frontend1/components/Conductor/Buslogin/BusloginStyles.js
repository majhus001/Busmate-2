import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // White background
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },

  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007AFF",
    marginLeft: 15,
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 30,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  busIcon: {
    fontSize: 40,
    marginBottom: 10,
    color: "#007AFF",
  },

  infoContainer: {
    width: "100%",
    marginBottom: 25,
  },

  infoBox: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  infoIcon: {
    marginRight: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  infoTextContainer: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 2,
  },

  infoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderRadius: 20,
    width: "100%",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.1)",
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555555",
    marginBottom: 10,
  },

  inputContainer: {
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    color: "#333333",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },

  inputFocused: {
    borderColor: "#007AFF",
    backgroundColor: "#fff",
    shadowOpacity: 0.05,
  },

  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 0,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },

  buttonGradient: {
    borderRadius: 10,
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  buttonIcon: {
    marginRight: 8,
  },

  footer: {
    marginTop: 30,
    alignItems: "center",
  },

  footerText: {
    color: "#718096",
    fontSize: 14,
  },

  helpLink: {
    marginTop: 8,
    color: "#007AFF",
    fontWeight: "600",
  },
});
