import { StyleSheet, Platform } from "react-native";

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    color: '#1A202C',
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
    marginBottom: 8,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    color: '#1A202C',
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
    marginBottom: 8,
  },
  iconContainer: {
    top: Platform.select({ ios: 16, android: 14 }),
    right: 12,
  },
  placeholder: {
    color: '#A0AEC0',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 2,
  },
  pickerContainer: {
    borderRadius: 8,
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonInner: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#3182CE',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#4A5568',
    marginTop: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#E53E3E',
  },
  errorText: {
    color: '#E53E3E',
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
  plateContainer: {
    backgroundColor: '#EBF8FF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BEE3F8',
  },
  plateLabel: {
    color: '#2B6CB0',
    fontWeight: '600',
    marginRight: 8,
  },
  plateNumber: {
    color: '#2B6CB0',
    fontWeight: '700',
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
});

export default styles;