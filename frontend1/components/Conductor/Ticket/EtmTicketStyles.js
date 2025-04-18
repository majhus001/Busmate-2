import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f0f5fa',
    marginTop: 5,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Header styles
  header: {
    paddingVertical: 16,   // Reduced from 20
    alignItems: 'center',
    marginBottom: 6,       // Reduced from 8
  },
  title: {
    fontSize: 22,          // Reduced from 24
    fontWeight: '700',
    color: '#1e293b',
  },

  // Card styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,       // Reduced from 12
    paddingHorizontal: 14,
    paddingTop:10,
    paddingBottom:10,       // Reduced from 16
    marginBottom: 7,      // Reduced from 16
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardheader: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  // Text styles
  label: {
    fontSize: 13.5,        // Reduced from 14
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 6,       // Reduced from 8
  },
  value: {
    fontSize: 15,          // Reduced from 16
    color: '#1e293b',
    fontWeight: '600',
  },

  // Row layout
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,      // Reduced from 12

  },
  infoBox: {
    flex: 1,
    paddingHorizontal: 0,  // Reduced from 8
  },

  // Seats container
  seatsContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  seatsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e8b57', // Green color for available seats
  },

  // Location button
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 8,    // Reduced from 10
    paddingHorizontal: 14, // Reduced from 16
    borderRadius: 7,       // Reduced from 8
    alignSelf: 'flex-start',
  },
  locationIcon: {
    marginRight: 6,        // Reduced from 8
    fontSize: 15,          // Reduced from 16
  },
  locationText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 13.5,        // Reduced from 14
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 18, // Reduced from 20
    borderTopRightRadius: 18,
    padding: 20,           // Reduced from 24
    maxHeight: '75%',      // Reduced from 80%
  },
  modalTitle: {
    fontSize: 19,          // Reduced from 20
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 14,      // Reduced from 16
    textAlign: 'center',
  },

  // All other styles remain exactly the same below this point
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#64748b',
    lineHeight: 28,
    fontWeight: '300',
  },
  locationItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledLocationItem: {
    backgroundColor: '#f8fafc',
  },
  selectedLocationItem: {
    backgroundColor: '#f0f9ff',
  },
  locationItemText: {
    fontSize: 16,
    color: '#1e293b',
  },
  disabledText: {
    color: '#94a3b8',
  },
  selectedIcon: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledIcon: {
    color: '#94a3b8',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#334155',
    fontWeight: '500',
  },
  picker: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  counterButton: {
    backgroundColor: '#e2e8f0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 20,
    color: '#334155',
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#1e293b',
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  paymentOption: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedPayment: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  paymentText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    // marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  locationButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  nextStopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  nextStopLabel: {
    fontSize: 14,
    color: '#fff',
    marginRight: 5,
  },
  nextStopValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextStopValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },

  // Journey Progress Indicator
  journeyProgressContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginVertical: 16,
    position: 'relative',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  stopsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    position: 'absolute',
    top: -3,
  },
  activeDot: {
    backgroundColor: '#3b82f6',
    width: 16,
    height: 16,
    borderRadius: 8,
    top: -5,
    borderWidth: 2,
    borderColor: '#dbeafe',
  },
  completedDot: {
    backgroundColor: '#10b981',
  },
  stopLabel: {
    fontSize: 12,
    color: '#64748b',
    position: 'absolute',
    top: 16,
    width: 80,
    textAlign: 'center',
    marginLeft: -40,
  },
  activeLabel: {
    color: '#1e40af',
    fontWeight: '600',
  },

  // Clock and Timer
  clockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  clockItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clockLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  clockValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },

  // Quick Ticket
  quickTicketContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickTicketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  quickTicketsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickTicketItem: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '48%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickTicketItemActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  quickTicketRoute: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  quickTicketPrice: {
    fontSize: 12,
    color: '#64748b',
  },

  // Ticket Summary
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'right',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },

  // Enhanced Button
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Animation styles
  fadeIn: {
    opacity: 0,
  },
  slideUp: {
    transform: [{ translateY: 50 }],
  },

  // Tickets button
  ticketsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  ticketsButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },

  // Card styles - enhanced
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardheader: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default styles;