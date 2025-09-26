import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore
import { Client, Message } from "react-native-paho-mqtt";
import * as Location from "expo-location";
// Storage object for Paho
const myStorage = {
  setItem: async (key, item) => AsyncStorage.setItem(key, item),
  getItem: async (key) => await AsyncStorage.getItem(key),
  removeItem: async (key) => AsyncStorage.removeItem(key),
};

let mqttClient;
let mqttIntervalId;

export const startMqttSharing = (busRouteNo, onLocationUpdate) => {
    let stopped = false;
    console.log("mqtt innn")
    
  mqttClient = new Client({
    uri: "ws://broker.hivemq.com:8000/mqtt",
    clientId: `bus-${busRouteNo}-${Date.now()}`,
    storage: myStorage, // ✅ provide React Native storage
  });

  console.log("mqtt")
  mqttClient.connect()
    .then(() => console.log("✅ MQTT connected"))
    .catch(err => console.error("❌ MQTT connection failed:", err));

  mqttIntervalId = setInterval(async () => {
    if (stopped) return;

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      if (!stopped && loc?.coords && mqttClient?.isConnected()) {
        const message = new Message(JSON.stringify({ busRouteNo, location: loc.coords }));
        message.destinationName = `bus/location/${busRouteNo}`;
        mqttClient.send(message);
        onLocationUpdate(loc.coords);
        console.log("📍 MQTT location sent:", loc.coords);
      }
    } catch (error) {
      console.error("❌ Error fetching location for MQTT:", error);
      if (!stopped) onLocationUpdate(null);
    }
  }, 3000);

  return () => {
    console.log(`🛑 Stopping MQTT location sharing for bus ${busRouteNo}`);
    stopped = true;

    if (mqttIntervalId) {
      clearInterval(mqttIntervalId);
      mqttIntervalId = null;
    }

    if (mqttClient) {
      mqttClient.disconnect();
      mqttClient = null;
    }
  };
};

export const stopMqttSharing = () => {
  if (mqttIntervalId) {
    clearInterval(mqttIntervalId);
    mqttIntervalId = null;
  }

  if (mqttClient) {
    mqttClient.disconnect();
    mqttClient = null;
  }
};
