import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 16,
  },
  darkContainer: {
    backgroundColor: "#111",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 20,
    textAlign: "center",
  },
  darkTitle: {
    color: "#FFFFFF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  darkLoaderContainer: {
    backgroundColor: "#111",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#4299E1",
  },
  darkCard: {
    backgroundColor: "#222",
    borderLeftColor: "#4DA8FF",
    shadowColor: "#000",
  },
  busInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  darkBusInfoContainer: {
    borderBottomColor: "#444",
  },
  busNumberText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D3748",
  },
  darkBusNumberText: {
    color: "#FFFFFF",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
  },
  darkAmountText: {
    color: "#FFFFFF",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusSuccess: {
    backgroundColor: "#48BB78",
  },
  statusPending: {
    backgroundColor: "#ECC94B",
  },
  statusFailed: {
    backgroundColor: "#F56565",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
  },
  statusTextSuccess: {
    color: "#48BB78",
  },
  statusTextPending: {
    color: "#ECC94B",
  },
  statusTextFailed: {
    color: "#F56565",
  },
  darkStatusText: {
    // No change needed as status colors remain consistent; override if needed
  },
  orderIdText: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 8,
  },
  darkOrderIdText: {
    color: "#AAAAAA",
  },
  downloadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#F5F7FA",
  },
  darkEmptyContainer: {
    backgroundColor: "#111",
  },
  emptyText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
  darkEmptyText: {
    color: "#CCCCCC",
  },
});