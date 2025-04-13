import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

import Navbar from './Navbar';
import UserFindBus from './UserFindBus';
import Footer from './Footer/Footer';
import { useLanguage } from "../../../LanguageContext"; // Ensure this path is correct

const UserHomeApp = ({ navigation }) => {
    const { language, darkMode } = useLanguage();
  
    return (
        <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
            <StatusBar 
                backgroundColor={darkMode ? "#007AFF" : "#007AFF"} 
                barStyle={darkMode ? "light-content" : "light-content"} 
            />
            <Navbar />
            <UserFindBus navigation={navigation} />
            <Footer navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    darkContainer: {
        backgroundColor: '#111', // or 'black'
    },
});

export default UserHomeApp;