import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../LanguageContext';
import { useFocusEffect } from '@react-navigation/native'; // ✅ This was missing

const messages = {
  en: 'No Notifications Available',
  ta: 'அறிவிப்புகள் இல்லை',
  hi: 'कोई सूचना उपलब्ध नहीं है',
};

const UserNotification = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const { language } = useLanguage();

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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Ionicons name="notifications-off-outline" size={50} color="#999" />
      <Text style={styles.message}>
        {messages[language] || messages.en}
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
  message: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default UserNotification;
