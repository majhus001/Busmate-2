import { StyleSheet } from "react-native";

const colors = {
  primary: "#3498db",
  secondary: "#2ecc71",
  accent: "#e74c3c",
  background: "#f8f9fa",
  card: "#ffffff",
  text: "#2c3e50",
  textLight: "#7f8c8d",
  border: "#ecf0f1",
  shadow: "rgba(0, 0, 0, 0.1)",
  darkBackground: "#111",
  darkCard: "#222",
  darkText: "#FFFFFF",
  darkTextLight: "#AAAAAA",
  darkBorder: "#444",
  darkShadow: "rgba(0, 0, 0, 0.3)",
  darkPrimary: "#4DA8FF", // Lighter blue for dark mode
};

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  darkSafeArea: {
    backgroundColor: colors.darkBackground,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  darkContainer: {
    backgroundColor: colors.darkBackground,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  darkTitle: {
    color: colors.darkText,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    height: 56,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  darkSearchSection: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
    borderWidth: 1,
    shadowColor: colors.darkShadow,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  darkSearchInput: {
    color: colors.darkText,
  },
  clearButton: {
    padding: 8,
  },
  busCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkBusCard: {
    backgroundColor: colors.darkCard,
    shadowColor: colors.darkShadow,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  darkBusNumber: {
    color: colors.darkText,
  },
  busType: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  darkBusType: {
    color: colors.darkTextLight,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    backgroundColor: colors.background,
  },
  darkLoadingContainer: {
    backgroundColor: colors.darkBackground,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
  darkLoadingText: {
    color: colors.darkTextLight,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 150,
  },
  darkNoResultsContainer: {
    backgroundColor: colors.darkCard,
    shadowColor: colors.darkShadow,
  },
  noResultsText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
  },
  darkNoResultsText: {
    color: colors.darkTextLight,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 120,
  },
  viewDetailsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  darkViewDetailsButton: {
    backgroundColor: colors.darkPrimary,
  },
  detailsButtonText: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 14,
  },
});