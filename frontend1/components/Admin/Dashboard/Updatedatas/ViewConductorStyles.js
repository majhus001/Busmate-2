import { StyleSheet } from "react-native";

export default StyleSheet.create({
  gradientContainer: {
    flex: 1,
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
  },
  backButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: "#007AFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 20,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2d3748",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "30%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  loader: {
    marginTop: 40,
  },
  conductorCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  conductorHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  conductorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ebf5ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  conductorInfo: {
    flex: 1,
  },
  conductorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
  },
  conductorPhone: {
    fontSize: 14,
    color: "#718096",
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  activeBadge: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  inactiveBadge: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#4a5568",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  buttonText: {
    marginLeft: 8,
    color: "white",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#a0aec0",
    marginTop: 16,
  },
  clearSearchText: {
    color: "#007AFF",
    marginTop: 8,
    textDecorationLine: "underline",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  paginationButton: {
    padding: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageIndicator: {
    marginHorizontal: 16,
    color: "#4a5568",
  },
});