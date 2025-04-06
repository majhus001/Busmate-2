import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from "../../../LanguageContext";

const translations = {
  home: {
    english: 'Home',
    tamil: 'முகப்பு',
    hindi: 'होम'
  },
  ticket: {
    english: 'Tickets',
    tamil: 'டிக்கெட்',
    hindi: 'टिकट'
  },
  place: {
    english: 'Places',
    tamil: 'இடங்கள்',
    hindi: 'स्थान'
  },
  profile: {
    english: 'Profile',
    tamil: 'சுயவிவரம்',
    hindi: 'प्रोफ़ाइल'
  }
};

const Footer = ({ navigation }) => {
  const { language, darkMode } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [scaleAnims] = useState({
    home: new Animated.Value(1),
    ticket: new Animated.Value(1),
    place: new Animated.Value(1),
    profile: new Animated.Value(1),
  });

  const [translateYAnims] = useState({
    home: new Animated.Value(0),
    ticket: new Animated.Value(0),
    place: new Animated.Value(0),
    profile: new Animated.Value(0),
  });

  const getLabel = (tabName) => {
    // Ensure language is lowercase to match our translation keys
    const lang = language.toLowerCase();
    return translations[tabName]?.[lang] || tabName.charAt(0).toUpperCase() + tabName.slice(1);
  };

  const handleTabPress = (tabName) => {
    Object.keys(scaleAnims).forEach((key) => {
      Animated.timing(scaleAnims[key], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.timing(translateYAnims[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    Animated.sequence([
      Animated.timing(scaleAnims[tabName], {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[tabName], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(translateYAnims[tabName], {
      toValue: -5,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setActiveTab(tabName);

    if (tabName === 'home') {
      navigation.navigate('UserHome');
    }
    else if (tabName === 'ticket') {
      navigation.navigate('TicketHistory');
    }
    else if (tabName === 'place') {
      navigation.navigate('FavouriteBuses');
    }
    else if (tabName === 'profile') {
      navigation.navigate('UserProfile');
    }
  };

  const renderTabItem = (tabName, iconName, activeIconName) => {
    const isActive = activeTab === tabName;
    const iconToUse = isActive ? activeIconName : iconName;
    const colorToUse = isActive ? '#ffffff' : 'rgba(255,255,255,0.7)';
    
    return (
      <TouchableOpacity 
        onPress={() => handleTabPress(tabName)} 
        activeOpacity={0.7}
        key={tabName}
      >
        <Animated.View
          style={[
            styles.footerItem,
            {
              transform: [
                { scale: scaleAnims[tabName] }, 
                { translateY: translateYAnims[tabName] }
              ],
            },
          ]}
        >
          <Ionicons name={iconToUse} size={22} color={colorToUse} />
          <Text style={[
            isActive ? styles.footerText : styles.footerTextInactive,
          ]}>
            {getLabel(tabName)}
          </Text>
          {isActive && <View style={styles.activeDot} />}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footer}>
        {renderTabItem('home', 'home-outline', 'home')}
        {renderTabItem('ticket', 'ticket-outline', 'ticket')}
        {renderTabItem('place', 'location-outline', 'location')}
        {renderTabItem('profile', 'person-outline', 'person')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#007AFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    position: 'relative',
    minWidth: 60,
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    fontWeight: '500',
  },
  footerTextInactive: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  activeDot: {
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
});

export default Footer;