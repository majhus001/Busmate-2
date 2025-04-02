import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    Admincontainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom:50,
  },

  leftSection: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  profileRole: {
    fontSize: 16,
    color: "#dfe6e9",
  },
  profileDetail: {
    fontSize: 14,
    color: "#b2bec3",
    marginTop: 5,
  },

  /* Buttons Section */
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#28a745",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  busconinfo: {
    display: "flex",
    flexDirection: "row",
    gap: 70,
    marginTop: 10,
    
  },
  busconbtn: {
    backgroundColor: "#fff",
    padding: 7,
    borderRadius: 5,
    // color: "#fff",
  },

  /* Toggle Buttons Section */
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  toggleButtonText: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  activeTab: {
    backgroundColor: "#007bff",
  },
  activeTabText: {
    color: "#fff",
  },
// Search Input
searchInput: {
    width: '90%',
    height: 45,
    marginVertical: 15,
    alignSelf: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingLeft: 20,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  
  /* Section Title */
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },

  /* Bus Card */
  busCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#007bff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  busHeader: {
    marginBottom: 10,
  },
  busText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  available: {
    color: "#28a745",
  },
  onService: {
    color: "#ffc107",
  },

  /* Dropdown Details */
  dropdown: {
    backgroundColor: "#f1f3f5",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },

  /* Conductor Card */
  conductorCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#6c757d",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  conductorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  conductorContact: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  conductorStatus: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  active: {
    color: "#28a745",
  },
  onLeave: {
    color: "#dc3545",
  },

  bustimingcont: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10
  },
  dropdowntimingText: {
    color: "#fff"
  },
  /* Pagination Section */
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  paginationButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  paginationButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },

  /* No Data Message */
  noDataText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
});

export default styles;
