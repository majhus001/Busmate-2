import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Splash3 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('signup')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

   <Image
     source={{ uri: 'https://static.vecteezy.com/system/resources/previews/029/183/024/non_2x/bus-stop-illustration-vector.jpg' }}
     style={styles.image}
     resizeMode="cover"
   />

      <Text style={styles.description}>
        Get real-time alerts and estimated arrival times for every bus.
      </Text>
      <Text style={styles.title}>Live Alerts & ETA</Text>

      <View style={styles.bottomRow}>
        <View style={styles.dotsContainer}>
          <View style={styles.dotInactive} />
          <View style={styles.dotInactive} />
          <View style={styles.dotActive} />
        </View>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.replace('signup')}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Splash3;

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
    borderRadius: 20,
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
