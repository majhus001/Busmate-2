import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserNotification = () => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Fade-in effect

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Ionicons name="notifications-off-outline" size={50} color="#999" />
      <Text style={styles.message}>No Notifications Available</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default UserNotification;
