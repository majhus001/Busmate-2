import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007BFF", // ✅ Blue background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // ✅ White text for contrast
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff", // ✅ White input box
  },
  roleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // ✅ White text
    marginVertical: 10,
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
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff", // ✅ White border for contrast
    marginRight: 8,
  },
  selected: {
    backgroundColor: "#fff", // ✅ White inner fill for selected radio
  },
  radioText: {
    fontSize: 16,
    color: "#fff", // ✅ White text
  },
  button: {
    width: "100%",
    backgroundColor: "#fff", // ✅ White button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#007BFF", // ✅ Blue text on button
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#fff", // ✅ White text
    marginTop: 10,
  },
});