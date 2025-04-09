import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  darkContainer: {
    backgroundColor: '#121212', // example dark background
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  busNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  darkText: {
    color: "#FFFFFF",
  },
  route: {
    fontSize: 16,
    color: "#636366",
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  activeBadge: {
    backgroundColor: "#34C759",
  },
  inactiveBadge: {
    backgroundColor: "#FF3B30",
  },
  statusText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: "#1C1C1E",
    // Keep the same other properties as card
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#000000", // Light mode color
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: "#636366",
  },
  rowValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  seatGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  seatPill: {
    width: "48%",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  darkPill: {
    backgroundColor: '#333333', // example dark pill background
  },
  seatLabel: {
    fontSize: 13,
    color: "#636366",
  },
  seatValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F2F2F7",
    borderTopWidth: 1,
    borderTopColor: "#D1D1D6",
  },
  darkFooter: {
    backgroundColor: "#1C1C1E",
    borderTopColor: "#2C2C2E",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 8,
  },
});
