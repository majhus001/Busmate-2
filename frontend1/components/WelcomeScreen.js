import React from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView, 
  Dimensions,
  ImageBackground 
} from "react-native";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background with gradient effect using multiple views */}
      <View style={[styles.background, { backgroundColor: "#0052D4" }]} />
      <View style={[styles.backgroundGradient, { backgroundColor: "#4364F7", opacity: 0.7 }]} />
      <View style={[styles.backgroundGradient, { backgroundColor: "#6FB1FC", opacity: 0.5 }]} />
      
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Logo with enhanced styling */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: "https://webstockreview.net/images/clipart-bus-tourist-bus-3.png" }} 
              style={styles.logo} 
            />
          </View>
        </View>
        
        <Text style={styles.title}>Welcome to BusGo</Text>
        <Text style={styles.subtitle}>Your journey starts here</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => navigation.navigate("login")}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Decorative elements */}
      <View style={styles.topDecoration} />
      <View style={styles.bottomDecoration} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topDecoration: {
    position: 'absolute',
    width: width,
    height: height * 0.15,
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logoWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 50,
    textAlign: "center",
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#4364F7",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 25,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: "#fff",
    textDecorationLine: "underline",
  },
  bottomDecoration: {
    position: 'absolute',
    width: width,
    height: height * 0.1,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  }
});

export default WelcomeScreen;