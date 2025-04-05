import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  darkSafeArea: {
    backgroundColor: "#111",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#FFFFFF",
  },
  darkContainer: {
    backgroundColor: "#111",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
    marginBottom: 30,
  },
  darkTitle: {
    color: "#FFFFFF",
  },
  searchSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkSearchSection: {
    backgroundColor: "#222",
    borderColor: "#333",
    borderWidth: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  markerIconContainer: {
    width: 36,
    alignItems: "center",
  },
  originMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  destinationMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E8EAF6",
    justifyContent: "center",
    alignItems: "center",
  },
  dotLine: {
    position: "absolute",
    left: 33,
    top: 30,
    height: 40,
    width: 2,
    borderStyle: "dotted",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    zIndex: -1,
  },
  darkDotLine: {
    borderColor: "#444",
  },
  inputWrapper: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  darkInputWrapper: {
    borderColor: "#444",
    backgroundColor: "#333",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  darkSearchInput: {
    color: "#FFFFFF",
  },
  clearButton: {
    padding: 5,
  },
  swapButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  darkSwapButton: {
    backgroundColor: "#333",
  },
  suggestionsContainer: {
    backgroundColor: "#FFFFFF",
    marginLeft: 46,
    marginRight: 15,
    marginBottom: 5,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  darkSuggestionsContainer: {
    backgroundColor: "#222",
    borderColor: "#444",
    borderWidth: 1,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  darkSuggestionItem: {
    borderBottomColor: "#444",
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333333",
  },
  darkSuggestionText: {
    color: "#CCCCCC",
  },
  startButton: {
    backgroundColor: "#3F51B5",
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 60,
    marginTop: 20,
    shadowColor: "#3F51B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  darkStartButton: {
    backgroundColor: "#4DA8FF",
    shadowColor: "#4DA8FF",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  startText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  darkLoadingContainer: {
    backgroundColor: "#111",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666666",
  },
  darkLoadingText: {
    color: "#CCCCCC",
  },
  resultsContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
  },
  darkResultsContainer: {
    backgroundColor: "#111",
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  darkResultsHeader: {
    color: "#CCCCCC",
  },
  busCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  darkBusCard: {
    backgroundColor: "#222",
    borderColor: "#444",
  },
  busCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  busNumberContainer: {
    backgroundColor: "#3F51B5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  darkBusNumberContainer: {
    backgroundColor: "#4DA8FF",
  },
  busNumber: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  darkBusNumber: {
    color: "#FFFFFF",
  },
  busType: {
    marginLeft: 12,
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  darkBusType: {
    color: "#AAAAAA",
  },
  routeContainer: {
    marginBottom: 12,
  },
  routeInfo: {
    paddingHorizontal: 5,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  timeContainer: {
    width: 80,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333333",
  },
  darkTimeText: {
    color: "#FFFFFF",
  },
  locationText: {
    marginLeft: 15,
    fontSize: 14,
    color: "#666666",
    flex: 1,
  },
  darkLocationText: {
    color: "#AAAAAA",
  },
  routeLineContainer: {
    paddingLeft: 25,
    height: 20,
  },
  routeLine: {
    width: 2,
    height: "100%",
    backgroundColor: "#E0E0E0",
    marginLeft: 0,
  },
  darkRouteLine: {
    backgroundColor: "#444",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  darkViewDetailsButton: {
    borderTopColor: "#444",
  },
  viewDetailsText: {
    color: "#007bff",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 4,
  },
  darkViewDetailsText: {
    color: "#4DA8FF",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
    backgroundColor: "#FFFFFF",
  },
  darkNoResultsContainer: {
    backgroundColor: "#111",
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666666",
    marginTop: 20,
  },
  darkNoResultsText: {
    color: "#CCCCCC",
  },
  tryAgainText: {
    fontSize: 14,
    color: "#999999",
    marginTop: 8,
  },
  darkTryAgainText: {
    color: "#AAAAAA",
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#FFFFFF",
  },
  darkInitialStateContainer: {
    backgroundColor: "#111",
  },
  illustration: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
  },
  darkInfoText: {
    color: "#CCCCCC",
  },
});