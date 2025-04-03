import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [scaleAnims] = useState({
    home: new Animated.Value(1),
    ticket: new Animated.Value(1),
    place: new Animated.Value(1),
    profile: new Animated.Value(1)
  });
  
  const [translateYAnims] = useState({
    home: new Animated.Value(0),
    ticket: new Animated.Value(0),
    place: new Animated.Value(0),
    profile: new Animated.Value(0)
  });

  const handleTabPress = (tabName) => {
    // Reset all animations
    Object.keys(scaleAnims).forEach((key) => {
      Animated.timing(scaleAnims[key], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
      
      Animated.timing(translateYAnims[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();
    });
    
    // Animate the selected tab
    Animated.sequence([
      Animated.timing(scaleAnims[tabName], {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnims[tabName], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      })
    ]).start();
    
    // Move selected tab slightly up
    Animated.timing(translateYAnims[tabName], {
      toValue: -5,
      duration: 200,
      useNativeDriver: true
    }).start();
    
    setActiveTab(tabName);
  };

  const renderTabItem = (tabName, iconName, activeIconName) => {
    const isActive = activeTab === tabName;
    const iconToUse = isActive ? activeIconName : iconName;
    const colorToUse = isActive ? '#00468b' : '#aaa';
    const textStyle = isActive ? styles.footerText : styles.footerTextInactive;
    
    return (
      <TouchableOpacity 
        onPress={() => handleTabPress(tabName)}
        activeOpacity={0.7}
      >
        <Animated.View 
          style={[
            styles.footerItem,
            {
              transform: [
                { scale: scaleAnims[tabName] },
                { translateY: translateYAnims[tabName] }
              ]
            }
          ]}
        >
          <Ionicons name={iconToUse} size={22} color={colorToUse} />
          <Text style={textStyle}>{tabName.charAt(0).toUpperCase() + tabName.slice(1)}</Text>
          
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
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    color: '#00468b',
    marginTop: 4,
    fontWeight: '500',
  },
  footerTextInactive: {
    fontSize: 12,
    color: '#00468b',
    marginTop: 4,
  },
  activeDot: {
    width: 4,
    height: 4,
    backgroundColor: '#00468b',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
});

export default Footer;
