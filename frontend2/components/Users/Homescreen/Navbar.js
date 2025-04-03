import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation(); // ✅ Get navigation object

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Left Side: App Name & Icon */}
        <View style={styles.leftSection}>
          <Ionicons name="bus" size={28} color="#fff" style={styles.busIcon} />
          <Text style={styles.brandText}>BusMate</Text>
        </View>

        {/* Right Side: Icons */}
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('UserNoti')}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>

          {/* ✅ Clicking Settings navigates to Settings Screen */}
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('UserSettings')}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
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
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busIcon: {
    marginRight: 5,
  },
  brandText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
});

export default Navbar;
