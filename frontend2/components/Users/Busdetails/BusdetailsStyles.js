import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  darkContainer: {
    backgroundColor: "#1C1C1E",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  busNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  route: {
    fontSize: 18,
    color: "#48484A",
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 8,
  },
  activeBadge: {
    backgroundColor: "#34C759",
  },
  inactiveBadge: {
    backgroundColor: "#FF3B30",
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: "#2C2C2E",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  darkText: {
    color: "#fff",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  rowIcon: {
    marginRight: 8,
  },
  rowLabel: {
    fontSize: 16,
    color: "#48484A",
    flex: 1,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  seatGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  seatPill: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 12,
    width: "48%",
    alignItems: "center",
    marginVertical: 6,
  },
  darkPill: {
    backgroundColor: "#3A3A3C",
  },
  seatLabel: {
    fontSize: 14,
    color: "#48484A",
  },
  seatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  complaintInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    height: 120,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  darkInput: {
    backgroundColor: "#3A3A3C",
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default styles;