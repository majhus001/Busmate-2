import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#0F172A",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },
  darkTitle: {
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
  },
  darkSubtitle: {
    color: "#94A3B8",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: "#1E293B",
  },
  highlightCard: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  darkHighlightCard: {
    backgroundColor: "#007AFF",
  },
  liveTrackContainer: {
    marginVertical: 12,
    padding: 16,
    borderRadius: 8,
  },

  liveTrackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  routeLine: {
    position: "absolute",
    height: 3,
    left: 0,
    right: 0,
    top: 75,
  },
  stopsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  stopWrapper: {
    alignItems: "center",
    width: 80,
  },
  stopIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 8,
  },
  currentStopIndicator: {
    bottom: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
  },
  stopText: {
    fontSize: 12,
    textAlign: "center",
    color: "grey",
  },
  currentStopText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color:"#059669"
  },
  boardingStopIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    marginBottom: 6,
  },
  darkLiveTrackContainer: {
    backgroundColor: "#222",
  },
  darkLiveTrackTitle: {
    color: "#fff",
  },
  darkStopText: {
    color: "#ddd",
  },
  darkCurrentStopText: {
    color: "#fff",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500",
  },
  darkInfoLabel: {
    color: "#94A3B8",
  },
  infoValue: {
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "600",
  },
  darkInfoValue: {
    color: "#F8FAFC",
  },
  amountText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  darkAmountText: {
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },
  darkDivider: {
    backgroundColor: "#334155",
  },
  seatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seatButton: {
    backgroundColor: "#E2E8F0",
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  darkSeatButton: {
    backgroundColor: "#334155",
  },
  seatCount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginHorizontal: 20,
  },
  darkSeatCount: {
    color: "#F8FAFC",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  darkButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  darkButtonText: {
    color: "#FFFFFF",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginHorizontal: 8,
  },
  darkLocationText: {
    color: "#F8FAFC",
  },
  arrowIcon: {
    marginHorizontal: 8,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  darkWebViewContainer: {
    backgroundColor: "#0F172A",
  },
});
