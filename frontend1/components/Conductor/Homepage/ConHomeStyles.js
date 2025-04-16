import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Lighter background for a modern look
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#007bff", // Deep blue for a professional touch
    paddingVertical: 15,
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  panelName: {
    fontSize: 16,
    color: "#d1d5db",
    marginTop: 5,
    fontStyle: "italic",
  },
  // Card Container - Used for all cards
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  // Card Header
  cardHeader: {
    padding: 16,
    borderBottomWidth: 0,
    borderBottomColor: "#f0f0f5",
  },
  cardHeaderExpanded: {
    borderBottomWidth: 1,
  },
  cardHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  // Conductor Card Styles
  conductorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  conductorPhone: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 2,
  },
  busInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  busInfoText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    marginLeft: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  // Expanded Content
  expandedContent: {
    padding: 16,
    backgroundColor: "#f9f9fb",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailIcon: {
    width: 24,
    alignItems: "center",
    marginRight: 12,
  },
  detailText: {
    fontSize: 15,
    color: "#3c3c43",
    flex: 1,
  },
  bold: {
    fontWeight: "bold",
    color: "#1f2937",
  },
  profileButton: {
    backgroundColor: "#f0f0f5",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    marginTop: 12,
  },
  profileButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  // Bus Card Styles
  busIcon: {
    marginRight: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  busRouteText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
    marginTop: 2,
  },
  busDetailsContainer: {
    padding: 16,
    backgroundColor: "#f9f9fb",
  },
  startRideButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  startRideButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // No Assignment Styles
  noAssignmentContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noAssignmentText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
    marginTop: 12,
  },
  noAssignmentSubtext: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 4,
    textAlign: "center",
  },
  // Quick Actions
  quickActionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#1c1c1e",
    textAlign: "center",
    marginTop: 4,
  },
  // Loading
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  // Status Card
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f5",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  statusContent: {
    padding: 16,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    color: "#3c3c43",
    marginLeft: 12,
  },
  // Statistics
  statsIcon: {
    marginRight: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#f9f9fb",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8e8e93",
  },
  // Notifications
  notificationIcon: {
    marginRight: 4,
  },
  notificationsContainer: {
    padding: 16,
    backgroundColor: "#f9f9fb",
  },
  notificationItem: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  notificationTime: {
    fontSize: 12,
    color: "#8e8e93",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#3c3c43",
    lineHeight: 20,
  },
});

export default styles;