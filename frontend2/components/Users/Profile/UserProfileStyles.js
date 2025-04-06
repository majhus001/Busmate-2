import { StyleSheet, Platform, StatusBar } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#007AFF", // Primary blue color
  },
  darkSafeArea: {
    backgroundColor: "#222", // Darker shade for dark mode
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fe",
  },
  darkLoaderContainer: {
    backgroundColor: "#111",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#5e72e4",
    fontWeight: "500",
  },
  darkLoaderText: {
    color: "#4DA8FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#007AFF",
  },
  darkHeader: {
    backgroundColor: "#007AFF",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  darkHeaderTitle: {
    color: "#FFFFFF",
  },
  editIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fe",
  },
  darkScrollView: {
    backgroundColor: "#111",
  },
  profileImageSection: {
    backgroundColor: "#007AFF",
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  darkProfileImageSection: {
    backgroundColor: "#007AFF",
    shadowColor: "#000",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
  },
  changePhotoButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#5e72e4",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  darkChangePhotoButton: {
    backgroundColor: "#4DA8FF",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  darkUserName: {
    color: "#FFFFFF",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginLeft: 4,
  },
  darkLocationText: {
    color: "#AAAAAA",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  darkFormContainer: {
    backgroundColor: "#111",
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8898aa",
    marginLeft: 8,
  },
  darkLabel: {
    color: "#AAAAAA",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#2d3748",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  darkInput: {
    backgroundColor: "#222",
    color: "#FFFFFF",
    borderColor: "#444",
    shadowColor: "#000",
  },
  disabledInput: {
    backgroundColor: "#f7fafc",
    color: "#4a5568",
  },
  darkDisabledInput: {
    backgroundColor: "#333",
    color: "#AAAAAA",
  },
  emailDisabled: {
    backgroundColor: "#f7fafc",
    color: "#a0aec0",
  },
  darkEmailDisabled: {
    backgroundColor: "#333",
    color: "#666",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: "#5e72e4",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#5e72e4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  darkSaveButton: {
    backgroundColor: "#4DA8FF",
    shadowColor: "#4DA8FF",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  darkCancelButton: {
    backgroundColor: "#222",
    borderColor: "#444",
  },
  cancelButtonText: {
    color: "#5e72e4",
    fontSize: 16,
    fontWeight: "700",
  },
  darkCancelButtonText: {
    color: "#4DA8FF",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f8f9fe",
  },
  darkFooter: {
    backgroundColor: "#111",
  },
  footerText: {
    fontSize: 12,
    color: "#a0aec0",
  },
  darkFooterText: {
    color: "#666",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  darkLoadingOverlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});