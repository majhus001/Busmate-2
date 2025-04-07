import { StyleSheet, Platform } from "react-native";

export const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    color: "#2D3748",
  },
  inputAndroid: {
    fontSize: 16,
    color: "#2B6CB0",
  },
  placeholder: {
    color: "#A0AEC0",
  },
};

const styles = StyleSheet.create({
  fullscreenLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  container: {
    marginTop:40,
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3748",
  },
  subtitle: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },
  loaderContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#4A5568",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FED7D7",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    marginLeft: 8,
    color: "#C53030",
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: "#408EC6",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 6,
  },
  pickerContainer: {
    backgroundColor: "#EDF2F7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  plateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  plateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2B6CB0",
    marginLeft: 6,
  },
  plateNumber: {
    fontSize: 14,
    color: "#2B6CB0",
    marginLeft: 6,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#3182CE",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default styles;
