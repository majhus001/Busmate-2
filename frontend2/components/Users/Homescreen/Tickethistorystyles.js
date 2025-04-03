import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4299E1',
  },
  text: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusSuccess: {
    backgroundColor: '#48BB78',
  },
  statusPending: {
    backgroundColor: '#ECC94B',
  },
  statusFailed: {
    backgroundColor: '#F56565',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusTextSuccess: {
    color: '#48BB78',
  },
  statusTextPending: {
    color: '#ECC94B',
  },
  statusTextFailed: {
    color: '#F56565',
  },
  dateText: {
    fontSize: 14,
    color: '#718096',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  orderIdText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  busInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  busNumberText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  refreshButton: {
    backgroundColor: '#4299E1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default styles;