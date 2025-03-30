import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const TicketSuccess = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.goBack(); // Go back to the previous screen after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer if screen unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <Icon name="check-circle" size={100} color="#4CAF50" style={styles.icon} />

      {/* Success Message */}
      <Text style={styles.title}>Ticket Printed Successfully!</Text>
      <Text style={styles.subtitle}>Your ticket has been generated and printed.</Text>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
};

export default TicketSuccess;
