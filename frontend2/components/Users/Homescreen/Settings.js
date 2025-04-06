import React, { useState, useRef, useEffect } from 'react'; // Ensure useState is imported
import {
  View, Text, Switch, StyleSheet, Animated, TouchableOpacity,
  Alert, Share, Linking, ScrollView
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../../LanguageContext'; // Adjust path as needed
import Footer from './Footer';

const translations = {
  English: {
    settings: 'Settings',
    darkMode: 'Dark Mode',
    rateApp: 'Rate App',
    shareApp: 'Share App',
    privacyPolicy: 'Privacy Policy',
    terms: 'Terms and Conditions',
    contactUs: 'Contact Us',
    language: 'Language',
    logout: 'Logout',
    privacyText: 'We value your privacy. We do not sell, share, or misuse your data. Your personal information is securely stored.',
    termsText: 'By using this app, you agree to abide by our policies and regulations. Misuse of the app may lead to account suspension.',
    callSupport: 'Call Support',
    emailSupport: 'Email Support',
    visitWebsite: 'Visit Website',
    selectLang: 'Select Language',
    selectedLang: 'Selected',
    logoutConfirm: 'Are you sure you want to logout?',
  },
  Tamil: {
    settings: 'அமைப்புகள்',
    darkMode: 'இருண்ட பயன்முறை',
    rateApp: 'பயன்பாட்டை மதிப்பீடு செய்யவும்',
    shareApp: 'பயன்பாட்டை பகிரவும்',
    privacyPolicy: 'தனியுரிமைக் கொள்கை',
    terms: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்',
    contactUs: 'எங்களை தொடர்புகொள்ள',
    language: 'மொழி',
    logout: 'வெளியேறு',
    privacyText: 'நாங்கள் உங்கள் தனிப்பட்ட தகவல்களை பாதுகாப்பாக வைத்திருக்கிறோம். எங்களால் உங்கள் தகவல்கள் பகிரப்படாது.',
    termsText: 'இந்த பயன்பாட்டைப் பயன்படுத்துவதன் மூலம், எங்கள் விதிமுறைகளை நீங்கள் ஒப்புக்கொள்கிறீர்கள்.',
    callSupport: 'ஆதரவை அழைக்கவும்',
    emailSupport: 'மின்னஞ்சல் ஆதரவு',
    visitWebsite: 'இணையதளத்தை பார்வையிடவும்',
    selectLang: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    selectedLang: 'தேர்ந்தெடுக்கப்பட்டது',
    logoutConfirm: 'நீங்கள் வெளியேற விரும்புகிறீர்களா?',
  },
  Hindi: {
    settings: 'सेटिंग्स',
    darkMode: 'डार्क मोड',
    rateApp: 'ऐप को रेट करें',
    shareApp: 'ऐप शेयर करें',
    privacyPolicy: 'गोपनीयता नीति',
    terms: 'नियम और शर्तें',
    contactUs: 'संपर्क करें',
    language: 'भाषा',
    logout: 'लॉगआउट',
    privacyText: 'हम आपकी गोपनीयता का सम्मान करते हैं। हम आपके डेटा को साझा या दुरुपयोग नहीं करते।',
    termsText: 'ऐप का उपयोग करके, आप हमारे नियमों और शर्तों को स्वीकार करते हैं। दुरुपयोग पर खाता निलंबित हो सकता है।',
    callSupport: 'सहायता कॉल करें',
    emailSupport: 'ईमेल सहायता',
    visitWebsite: 'वेबसाइट पर जाएं',
    selectLang: 'भाषा चुनें',
    selectedLang: 'चयनित',
    logoutConfirm: 'क्या आप लॉग आउट करना चाहते हैं?',
  }
};

const Settings = ({navigation}) => {
  // const navigation = useNavigation();
  const { language, setLanguage, darkMode, setDarkMode } = useLanguage(); // Use context
  const [expandedSection, setExpandedSection] = useState(null); // Local state for expanded section

  const translateY = useRef(new Animated.Value(-10)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const t = translations[language]; // Translation helper

  useEffect(() => {
    // Animation for entry
    Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    // Load saved settings
    const loadSettings = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('app_language');
        const savedDarkMode = await AsyncStorage.getItem('app_darkMode');
        if (savedLang) setLanguage(savedLang);
        if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode)); // Parse string to boolean
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, [setLanguage, setDarkMode]); // Dependencies

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    try {
      await AsyncStorage.setItem('app_darkMode', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error("Error saving dark mode:", error);
    }
  };

  const toggleSection = (section) => setExpandedSection(expandedSection === section ? null : section);

  const rateApp = () => Linking.openURL('https://play.google.com/store/apps/details?id=com.yourapp');
  const shareApp = async () => {
    try {
      await Share.share({ message: 'Check out this amazing app! https://busmate.com' });
    } catch {
      Alert.alert("Error", "Could not share app.");
    }
  };

  const handleLogout = () => {
    Alert.alert(t.logout, t.logoutConfirm, [
      { text: "Cancel", style: "cancel" },
      { text: t.logout, onPress: () => navigation.replace('welcomepage') }
    ]);
  };

  const callSupport = () => Linking.openURL('tel:+919566699153');
  const emailSupport = () => Linking.openURL('mailto:support@busmate.com');
  const visitWebsite = () => Linking.openURL('https://Busmate.com');

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    try {
      await AsyncStorage.setItem('app_language', lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const settingsOptions = [
    { title: t.darkMode, icon: 'moon-outline', isSwitch: true },
    { title: t.rateApp, icon: 'star-outline', action: rateApp },
    { title: t.shareApp, icon: 'share-social-outline', action: shareApp },
    { title: t.privacyPolicy, icon: 'lock-closed-outline', section: 'privacy' },
    { title: t.terms, icon: 'document-text-outline', section: 'terms' },
    { title: t.contactUs, icon: 'mail-outline', section: 'contact' },
    { title: t.language, icon: 'language-outline', section: 'language' },
    { title: t.logout, icon: 'log-out-outline', action: handleLogout },
  ];

  return (
    <>
    
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      
      <Text style={[styles.header, darkMode && styles.darkHeader]}>{t.settings}</Text>

      <ScrollView>
        {settingsOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => (item.section ? toggleSection(item.section) : item.action?.())}
          >
            <Animated.View style={[
              styles.option,
              {
                transform: [{ translateY }],
                opacity,
                backgroundColor: darkMode ? '#333' : '#f9f9f9'
              }
            ]}>
              <Ionicons name={item.icon} size={24} color={darkMode ? "#fff" : "#333"} />
              <Text style={[styles.optionText, darkMode && styles.darkText]}>{item.title}</Text>
              {item.isSwitch ? (
                <Switch value={darkMode} onValueChange={toggleDarkMode} />
              ) : (
                item.section && (
                  <Feather
                    name={expandedSection === item.section ? "chevron-up" : "chevron-down"}
                    size={22}
                    color={darkMode ? "#fff" : "#777"}
                  />
                )
              )}
            </Animated.View>
          </TouchableOpacity>
        ))}

        {expandedSection === 'privacy' && (
          <View style={[styles.expandedSection, darkMode && styles.darkSection]}>
            <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>{t.privacyPolicy}</Text>
            <Text style={[styles.sectionText, darkMode && styles.darkSectionText]}>{t.privacyText}</Text>
          </View>
        )}

        {expandedSection === 'terms' && (
          <View style={[styles.expandedSection, darkMode && styles.darkSection]}>
            <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>{t.terms}</Text>
            <Text style={[styles.sectionText, darkMode && styles.darkSectionText]}>{t.termsText}</Text>
          </View>
        )}

        {expandedSection === 'contact' && (
          <View style={[styles.expandedSection, darkMode && styles.darkSection]}>
            <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>{t.contactUs}</Text>
            <TouchableOpacity style={styles.contactOption} onPress={callSupport}>
              <Ionicons name="call-outline" size={20} color="#007AFF" />
              <Text style={styles.contactText}>{t.callSupport}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactOption} onPress={emailSupport}>
              <Ionicons name="mail-outline" size={20} color="#007AFF" />
              <Text style={styles.contactText}>{t.emailSupport}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactOption} onPress={visitWebsite}>
              <Ionicons name="globe-outline" size={20} color="#007AFF" />
              <Text style={styles.contactText}>{t.visitWebsite}</Text>
            </TouchableOpacity>
          </View>
        )}

        {expandedSection === 'language' && (
          <View style={[styles.expandedSection, darkMode && styles.darkSection]}>
            <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>{t.selectLang}</Text>
            {['English', 'Tamil', 'Hindi'].map((lang) => (
              <TouchableOpacity key={lang} style={styles.contactOption} onPress={() => changeLanguage(lang)}>
                <Ionicons
                  name={language === lang ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color="#007AFF"
                />
                <Text style={styles.contactText}>{lang}</Text>
              </TouchableOpacity>
            ))}
            <Text style={[styles.selectedLangText, darkMode && styles.darkSelectedLangText]}>
              {t.selectedLang}: {language}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
    <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  darkContainer: { backgroundColor: '#111' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  darkHeader: { color: '#fff' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  optionText: { flex: 1, fontSize: 16, marginLeft: 10, color: '#333' },
  darkText: { color: '#fff' },
  expandedSection: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
  },
  darkSection: { backgroundColor: '#222' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  darkSectionTitle: { color: '#4DA8FF' }, // Lighter blue for dark mode
  sectionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  darkSectionText: { color: '#ccc' }, // Light gray for dark mode
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  contactText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#007AFF',
  },
  selectedLangText: {
    marginTop: 10,
    color: '#666',
  },
  darkSelectedLangText: { color: '#aaa' }, // Light gray for dark mode
});

export default Settings;