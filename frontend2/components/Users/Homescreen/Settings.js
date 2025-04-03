import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, Switch, StyleSheet, Animated, TouchableOpacity, 
  Alert, Share, Linking, ScrollView 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const translateY = useRef(new Animated.Value(-10)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const rateApp = () => {
    const storeURL = 'https://play.google.com/store/apps/details?id=com.yourapp';
    Linking.openURL(storeURL).catch(() => Alert.alert("Error", "Could not open store."));
  };

  const shareApp = async () => {
    try {
      await Share.share({ message: 'Check out this amazing app! https://busmate.com' });
    } catch (error) {
      Alert.alert("Error", "Could not share app.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        onPress: () => {
          console.log("Logged out!");
          navigation.replace('welcomepage'); // ✅ Navigate to UserHome after logout
        } 
      }
    ]);
  };

  const contactUs = () => {
    Alert.alert("Contact Us", "Need help? Reach us at:");
  };

  const callSupport = () => Linking.openURL('tel:+919566699153');
  const emailSupport = () => Linking.openURL('mailto:support@busmate.com');
  const visitWebsite = () => Linking.openURL('https://Busmate.com');

  const settingsOptions = [
    { title: 'Dark Mode', icon: 'moon-outline', isSwitch: true },
    { title: 'Rate App', icon: 'star-outline', action: rateApp },
    { title: 'Share App', icon: 'share-social-outline', action: shareApp },
    { title: 'Privacy Policy', icon: 'lock-closed-outline', section: 'privacy' },
    { title: 'Terms and Conditions', icon: 'document-text-outline', section: 'terms' },
    { title: 'Contact Us', icon: 'mail-outline', section: 'contact' },
    { title: 'Logout', icon: 'log-out-outline', action: handleLogout },
  ];

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <Text style={[styles.header, darkMode && styles.darkHeader]}>Settings</Text>
      
      <ScrollView>
        {settingsOptions.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => item.section ? toggleSection(item.section) : item.action?.()}>
            <Animated.View 
              style={[
                styles.option, 
                { transform: [{ translateY }], opacity, backgroundColor: darkMode ? '#333' : '#f9f9f9' }
              ]}
            >
              <Ionicons name={item.icon} size={24} color={darkMode ? "#fff" : "#333"} />
              <Text style={[styles.optionText, darkMode && styles.darkText]}>{item.title}</Text>
              {item.isSwitch ? (
                <Switch value={darkMode} onValueChange={toggleDarkMode} />
              ) : (
                <Feather 
                  name={expandedSection === item.section ? "chevron-up" : "chevron-down"} 
                  size={22} 
                  color={darkMode ? "#fff" : "#777"} 
                />
              )}
            </Animated.View>
          </TouchableOpacity>
        ))}

        {/* Privacy Policy Section */}
        {expandedSection === 'privacy' && (
          <View style={[styles.expandedSection, darkMode && styles.darkSection]}>
            <Text style={styles.sectionTitle}>Privacy Policy</Text>
            <Text style={styles.sectionText}>
              We value your privacy. We do not sell, share, or misuse your data. Your personal information is securely stored.
            </Text>
          </View>
        )}

        {/* Terms and Conditions Section */}
        {expandedSection === 'terms' && (
          <View style={[styles.expandedSection, darkMode && styles.darkSection]}>
            <Text style={styles.sectionTitle}>Terms and Conditions</Text>
            <Text style={styles.sectionText}>
              By using this app, you agree to abide by our policies and regulations. Misuse of the app may lead to account suspension.
            </Text>
          </View>
        )}

        {/* Contact Us Section */}
        {expandedSection === 'contact' && (
          <View style={[styles.expandedSection, darkMode && styles.darkSection]}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <TouchableOpacity style={styles.contactOption} onPress={callSupport}>
              <Ionicons name="call-outline" size={20} color="#007AFF" />
              <Text style={styles.contactText}>Call Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactOption} onPress={emailSupport}>
              <Ionicons name="mail-outline" size={20} color="#007AFF" />
              <Text style={styles.contactText}>Email Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactOption} onPress={visitWebsite}>
              <Ionicons name="globe-outline" size={20} color="#007AFF" />
              <Text style={styles.contactText}>Visit Website</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  darkContainer: { backgroundColor: '#111' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  darkHeader: { color: '#fff' },
  option: { flexDirection: 'row', alignItems: 'center', padding: 15, marginVertical: 5, borderRadius: 10 },
  optionText: { flex: 1, fontSize: 16, marginLeft: 10, color: '#333' },
  darkText: { color: '#fff' },
  expandedSection: { padding: 15, backgroundColor: '#f0f0f0', borderRadius: 10, marginBottom: 10 },
  darkSection: { backgroundColor: '#222' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  sectionText: { fontSize: 14, color: '#555' },
  contactOption: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  contactText: { fontSize: 16, marginLeft: 10, color: '#007AFF' },
});

export default Settings;
