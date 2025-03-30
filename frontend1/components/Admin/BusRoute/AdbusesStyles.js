import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginBottom: 10, paddingBottom: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: "#fff" },
  picker: { marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});

export default styles;
