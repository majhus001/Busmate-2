import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007BFF",
  
  },

  keyboardContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    padding:25,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    overflow: "hidden",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
    letterSpacing: 1,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#f7f9fc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputErrorWrapper: {
    borderColor: "#ff4d4f",
    borderWidth: 1,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    height: 50,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    color: "#ff4d4f",
  },
  toggleButton: {
    padding: 12,
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
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
    position: "relative",
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: 14,
  },
  loginButton: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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
  signupButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  signupText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "600",
  },
});