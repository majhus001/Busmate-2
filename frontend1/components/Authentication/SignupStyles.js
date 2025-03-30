import { StyleSheet } from "react-native";

const Signupstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  roleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 8,
  },
  selected: {
    backgroundColor: "#fff",
  },
  radioText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: "#007bff",
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 15,
    fontSize: 16,
    color: "#fff",
    textDecorationLine: "underline",
  },
});

export default Signupstyles;