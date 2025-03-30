import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview"; // Ensure this line is correct
import io from 'socket.io-client'; // Ensure this line is correct
import { API_BASE_URL } from "../../../apiurl";

const UserMap = ({ route }) => {
  const [socket, setSocket] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const conductorId = route.params?.conductorId;

  useEffect(() => {
    const newSocket = io(`${API_BASE_URL}`);
    setSocket(newSocket);

    // Listen for conductor location updates
    newSocket.on('locationUpdate', (data) => {
      if (webViewRef.current) {
        setLastUpdate(new Date());
        webViewRef.current.injectJavaScript(`
          updateConductorLocation(
            ${data.location.lat},
            ${data.location.lng},
            ${data.location.speed || 0},
            ${data.location.heading || 0}
          );
          true;
        `);
      }
    });

    // Request initial conductor location
    if (conductorId) {
      newSocket.emit('requestLocation', { conductorId });
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [conductorId]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <style>
        #map { height: 100vh; width: 100vw; }
        .info-box {
          position: absolute;
          top: 10px;
          right: 10px;
          background: white;
          padding: 10px;
          border-radius: 4px;
          z-index: 1000;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div id="info" class="info-box"></div>
      <script>
        var map = L.map('map').setView([20.5937, 78.9629], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var conductorMarker;
        var path = L.polyline([], { color: 'red' });
        path.addTo(map);
        
        function updateConductorLocation(lat, lng, speed, heading) {
          const pos = [lat, lng];
          
          if (conductorMarker) {
            conductorMarker.setLatLng(pos);
          } else {
            conductorMarker = L.marker(pos, {
              title: 'Conductor Location'
            }).addTo(map);
          }
          
          // Update path
          path.addLatLng(pos);
          
          // Update info display
          document.getElementById('info').innerHTML = \`
            Conductor Location:<br>
            Speed: \${speed ? (speed * 3.6).toFixed(1) + ' km/h' : 'N/A'}<br>
            Direction: \${heading ? heading.toFixed(1) + '°' : 'N/A'}
          \`;
          
          map.setView(pos, 16);
        }
      </script>
    </body>
    </html>
  `;

  const webViewRef = React.useRef(null);

  return (
    <View style={styles.container}>
      <WebView 
        ref={webViewRef}
        source={{ html: htmlContent }}
      />
      {!lastUpdate && (
        <View style={styles.overlay}>
          <Text>Waiting for conductor's location...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default UserMap;