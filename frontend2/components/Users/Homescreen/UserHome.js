import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

import Navbar from './Navbar';
import UserFindBus from './UserFindBus';
import Footer from './Footer';

const UserHomeApp = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00468b" barStyle="light-content" />
      <Navbar />
      <UserFindBus navigation={navigation} />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default UserHomeApp;
