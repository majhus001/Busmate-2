import { StyleSheet } from 'react-native';

const colors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#e74c3c',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2c3e50',
  textLight: '#7f8c8d',
  border: '#ecf0f1',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 8,
  },
  resultsContainer: {
    flex: 1, // Take up available space
    marginBottom: 16,
  },
  favoritesContainer: {
    flex: 2, // Take up more space for favorites
  },
  busCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  busNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1, // Allow text to take available space
  },
  busType: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150, // Fixed height for loading container
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 150, // Fixed height so it doesn't collapse
  },
  noResultsText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 120, // Minimum width for actions area
  },
  viewDetailsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  detailsButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },
  favoriteIcon: {
    padding: 6, // Increase touch target
  },
  listContainer: {
    flex: 1,
    marginBottom: 16,
    maxHeight: 280, // Limit search results height
  },
  flatListContent: {
    flexGrow: 1,
  },
  // Section divider
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  // Bus type badge
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  }
});

export default styles;