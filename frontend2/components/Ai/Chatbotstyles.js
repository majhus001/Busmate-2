import { StyleSheet, Platform, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  mainContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  chatContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  welcomeText: {
    fontSize: 20,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: "85%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  botMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
    minWidth: 60,
  },
  userBubble: {
    backgroundColor: "#1E3A8A",
  },
  botBubble: {
    backgroundColor: "#E5E7EB",
  },
  messageText: {
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 22,
  },
  userBubble: {
    backgroundColor: "#00468b",
  },
  botBubble: {
    backgroundColor: "#E5E7EB",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userBubble: {
    backgroundColor: "#1E3A8A",
  },
  botBubble: {
    backgroundColor: "#E5E7EB",
  },
  messageText: {
    fontSize: 16,
    color: (props) => (props.sender === "user" ? "#FFFFFF" : "#1F2937"),
  },
  timestamp: {
    fontSize: 10,
    color: "#9CA3AF",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 16 : 8,
    paddingTop: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  webView: {
    height: 0,
    width: 0,
    opacity: 0,
    position: "absolute",
  },
})