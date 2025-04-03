// AnimatedNavigation.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = () => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [logoColor] = useState(new Animated.Value(0));

  const animatePress = (element) => {
    if (element === 'logo') {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.timing(logoColor, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(logoColor, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    } else if (element === 'search') {
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const interpolatedLogoColor = logoColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.8)']
  });

  const interpolatedRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <TouchableOpacity 
            style={styles.profileIcon}
            onPress={() => {
              // Profile animation could be added here
            }}
          >
            <Ionicons name="person-circle" size={28} color="#333" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          onPress={() => animatePress('logo')}
          activeOpacity={0.7}
        >
          <Animated.View 
            style={[
              styles.logoContainer, 
              { 
                transform: [{ scale: scaleAnim }],
                backgroundColor: interpolatedLogoColor
              }
            ]}
          >
            <Ionicons name="bus" size={24} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => animatePress('search')}
          activeOpacity={0.7}
        >
          <Animated.View 
            style={[
              styles.searchIcon,
              { transform: [{ rotate: interpolatedRotation }] }
            ]}
          >
            <Ionicons name="search" size={24} color="#333" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00468b',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 10,
  },
  profileContainer: {
    width: 40,
  },
  profileIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  searchIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
});

export default Navbar;