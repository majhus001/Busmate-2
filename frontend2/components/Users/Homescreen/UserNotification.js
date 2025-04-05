import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../LanguageContext';
import { useFocusEffect } from '@react-navigation/native';

const messages = {
  English: 'No Notifications Available',
  Tamil: 'அறிவிப்புகள் இல்லை',
  Hindi: 'कोई सूचना उपलब्ध नहीं है',
};

const UserNotification = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const { language, darkMode } = useLanguage(); // Access darkMode from context

  useFocusEffect(
    React.useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  return (
    <Animated.View style={[
      styles.container,
      { opacity: fadeAnim },
      darkMode && styles.darkContainer // Apply dark mode styles
    ]}>
      <Ionicons
        name="notifications-off-outline"
        size={50}
        color={darkMode ? "#ccc" : "#999"} // Adjust icon color
      />
      <Text style={[
        styles.message,
        darkMode && styles.darkMessage // Adjust text color
      ]}>
        {messages[language] || messages.English}
      </Text>
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
  darkContainer: {
    backgroundColor: '#111', // Dark mode background
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  darkMessage: {
    color: '#ccc', // Dark mode text color
  },
});

export default UserNotification;