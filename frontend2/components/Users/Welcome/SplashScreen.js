import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo-av'; // ✅ Correct import
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const video = useRef(null);

  const handlePlaybackStatusUpdate = status => {
    if (status.didJustFinish) {
      navigation.replace('Splash1'); // Navigate to "login" screen after video finishes
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require('../../../assets/Busmate (2).mp4')} // Replace path as needed
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
