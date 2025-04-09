import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e", // Dark background like Copilot
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chatContent: {
    flexGrow: 1,
    justifyContent: "flex-end", // Messages stack from bottom
    paddingBottom: 20,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    color: "#aaa",
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  messageBubble: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
    backgroundColor: "#2d2d2d", // Subtle dark gray for bubbles
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#0078d4", // Vibrant blue for user messages
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#333", // Slightly lighter for bot
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: "#fff", // White text for contrast
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    color: "#aaa",
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#252526", // Darker input bar like Copilot
    borderTopWidth: 1,
    borderColor: "#3c3c3c",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#3c3c3c", // Darker input field
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#555",
    color: "#fff",
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0078d4", // Copilot blue
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  stopButton: {
    backgroundColor: "#d83b01", // Orange-red for stop
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  voiceButton: {
    backgroundColor: "#0e639c", // Muted blue for mic
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listening: {
    backgroundColor: "#d83b01", // Orange when listening
  },
});