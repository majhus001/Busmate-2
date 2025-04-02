import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop:50,
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  complaintCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  issueType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  complaintText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'cover',
  },
  noDataText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    color: '#007bff',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default styles;