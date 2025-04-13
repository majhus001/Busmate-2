import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Splash1 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('login')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: 'https://img.freepik.com/premium-photo/bus-travel-around-whole-world-illustration_977617-97781.jpg' }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.description}>
        Book your bus in seconds and enjoy a smooth ride with real-time updates.
      </Text>
      <Text style={styles.title}>Smart Travel, Smart Life</Text>

      <View style={styles.bottomRow}>
        <View style={styles.dotsContainer}>
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
          <View style={styles.dotInactive} />
        </View>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Splash2')}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Splash1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backText: {
    fontSize: 24,
    color: '#000',
  },
  skipText: {
    fontSize: 16,
    color: '#888',
  },
  image: {
    width: '100%',
    height: 250,
    alignSelf: 'center',
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000066',
    textAlign: 'center',
    marginTop: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000066',
    marginHorizontal: 3,
  },
  dotInactive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  startButton: {
    backgroundColor: '#000066',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
