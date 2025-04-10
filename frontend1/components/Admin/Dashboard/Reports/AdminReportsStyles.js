import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');


export const colors = {
  primary: "#007AFF",
  background: "#f8f9fa",
  text: "#333",
  lightText: "#777",
  border: "#ddd",
  success: "#4CAF50",
  warning: "#FF5722",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingBottom: 15,
    paddingTop: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  headerRight: {
    width: 24, // Same as back button for balance
  },
  summaryContainer: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: 200,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  summaryIconContainer: {
    backgroundColor: "#f0f7ff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryCardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 2,
  },
  summaryCardSubtitle: {
    fontSize: 12,
    color: colors.lightText,
  },
  timeRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 5,
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeTimeRange: {
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  timeRangeText: {
    color: colors.lightText,
    fontWeight: "500",
  },
  activeTimeRangeText: {
    color: colors.primary,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 12,
    paddingRight: 40, 
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  tabSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 10,
    zIndex: 1,
  },
  stickyTabSection: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tabIcon: {
    marginRight: 5,
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: colors.primary,
  },
  searchBar: {
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  tabContentContainer: {
    paddingTop: 20, // Space for sticky tabs
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 20,
  },
  userDetailsTop:{
    flexDirection: "row",
    paddingRight: 1,
    justifyContent: "space-between",  
  },
  userCard: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  userAvatarContainer: {
    marginRight: 15,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarFallback: {},
  userInitial: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: colors.lightText,
    marginBottom: 5,
  },
  userMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userRole: {
    fontSize: 12,
    color: colors.primary,
  },
  userJoinDate: {
    fontSize: 12,
    color: colors.lightText,
  },
  revenueCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  routeIcon: {
    backgroundColor: "#f0f7ff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  routeNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  routeName: {
    fontSize: 13,
    color: colors.lightText,
  },
  revenueStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 220,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  revenueValue: {
    color: colors.primary,
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  disabledPaginationButton: {
    backgroundColor: "#ccc",
  },
  paginationText: {
    color: "#fff",
    fontWeight: "500",
  },
  pageIndicator: {
    color: colors.lightText,
  },
});