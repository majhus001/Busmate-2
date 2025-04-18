import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007BFF",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: height * 0.08, // 8% from top of screen
    paddingBottom: 15,
  },
  welcome: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 1,
    marginTop: 10,
  },
  icon: {
    marginBottom: 5,
  },
  keyboardContainer: {
    flex: 1,
    width: "100%",
  },
  card: {
    flex: 1,
    marginTop:100,
    marginHorizontal: 20,
    paddingTop: 30,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: height * 0.9, // Limit card height to 75% of screen
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 30,
  },
  formScrollView: {
    flex: 1,
  },
  formContentContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#f7f9fc",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputWrapperActive: {
    borderColor: "#007BFF",
    shadowColor: "#007BFF",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapperError: {
    borderColor: "#ff4d4f",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 5,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  toggleButton: {
    padding: 8,
  },
  roleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginVertical: 15,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f7f9fc",
  },
  radioButtonSelected: {
    backgroundColor: "#e6f2ff",
    borderColor: "#007BFF",
  },
  radioIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007BFF",
    marginRight: 8,
  },
  radioText: {
    fontSize: 16,
    color: "#555",
  },
  radioTextSelected: {
    color: "#007BFF",
    fontWeight: "600",
  },
  signupButton: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    paddingHorizontal: 15,
    color: "#777",
    fontSize: 14,
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  loginText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "600",
  },
});