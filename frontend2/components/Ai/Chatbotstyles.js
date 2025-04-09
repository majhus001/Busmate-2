import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fa",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  messageBubble: {
    marginVertical: 6,
    padding: 14,
    borderRadius: 20,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: "#0a84ff",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#000",
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e1e1e1",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 6,
    maxHeight: 100,
    minHeight: 40,
    textAlignVertical: "top",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#0a84ff",
    padding: 10,
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: "#ff453a",
    padding: 10,
    borderRadius: 25,
  },
  voiceButton: {
    backgroundColor: "#32d74b",
    padding: 10,
    borderRadius: 25,
    marginLeft: 6,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
