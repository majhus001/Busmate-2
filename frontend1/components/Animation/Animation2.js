import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { API_BASE_URL } from "../../apiurl";
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// FallingLeaf component logic
const FallingLeaf = ({ delay, initialX, initialY }) => {
  const translateY = useRef(new Animated.Value(initialY)).current;
  const translateX = useRef(new Animated.Value(initialX)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const [conid,setconid]=useState(null);
  const [newdata,setnewdata]=useState("");
   get =async() => {
    const storedData = await SecureStore.getItemAsync("currentUserData");
    const parsedData = JSON.parse(storedData);
  
    setconid(parsedData);
   }
  
  useEffect(() => {
    get();
    fetchConductorOnlineTickets(conid);
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 50, // Fall past screen bottom
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: initialX + Math.sin(SCREEN_HEIGHT / 50) * 50, // Sway effect
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(rotation, {
            toValue: 360,
            duration: 2000,
            useNativeDriver: true,
          })
        ),
      ]),
    ]);

    animation.start();

    return () => animation.stop();
  }, [delay, initialX]);

  const fetchConductorOnlineTickets = async (conductorId, includeDocs = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Conductor/online-tickets/${conductorId}`,
        {
          params: {
            withDocs: includeDocs.toString()
          }
        }
      );

      setnewdata(response.data);
      return response.data;
      
    } catch (error) {
      console.error('Error fetching online tickets:', error);
      throw error;
    }
  };
  
  

  const transform = [
    { translateX },
    { translateY },
    {
      rotate: rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
      }),
    },
  ];

  return (
    <Animated.View style={{ position: 'absolute', transform }}>
      <Svg width={8} height={12}>
        <Circle cx={4} cy={6} r={4} fill="#2D5A27" opacity={0.9} />
      </Svg>
    </Animated.View>
  );
};

// EcoImpactTree component logic
const EcoImpactTree = () => {
  const [growthStage, setGrowthStage] = useState(0);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const maxStages = 5;

  const createLeaves = () => {
    const newLeaves = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      delay: Math.random() * 1000,
      x: Math.random() * 300 - 150, // Relative to tree center
      y: -100 - Math.random() * 200, // Start within tree
    }));
    setLeaves((prev) => [...prev, ...newLeaves]);
    setTimeout(() => {
      setLeaves((prev) => prev.filter((leaf) => !newLeaves.some((nl) => nl.id === leaf.id)));
    }, 4000);
  };

  const handleGrow = () => {
    // Simulate payment action (replace with BusMate API)
    const paymentType = Math.random() > 0.5 ? 'online' : 'cash';
    if (paymentType === 'online') {
      setCarbonSaved((prev) => prev + 0.5);
      setGrowthStage((prev) => {
        const newStage = Math.min(prev + 1, maxStages);
        if (newStage > prev) {
          createLeaves();
        }
        return newStage;
      });
    }
  };

  // Animation for opacity and scale
  const animatedStyles = Array.from({ length: maxStages + 1 }, () =>
    useState(new Animated.Value(growthStage === 0 ? 1 : 0))[0]
  );

  useEffect(() => {
    animatedStyles.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: growthStage === index ? 1 : 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  }, [growthStage]);

  return (
    <View style={styles.container}>
        {/* <View>{newdata}</View> */}
      <Text style={styles.title}>Eco-Impact Tracker</Text>
      <Text style={styles.info}>Carbon Saved: {carbonSaved.toFixed(1)} kg CO2</Text>
      <View style={styles.treeContainer}>
        {leaves.map((leaf) => (
          <FallingLeaf
            key={leaf.id}
            delay={leaf.delay}
            initialX={leaf.x}
            initialY={leaf.y}
          />
        ))}

        {/* Stage 0: Seed */}
        <Animated.View
          style={[
            styles.stage,
            {
              opacity: animatedStyles[0],
              transform: [{ scale: animatedStyles[0] }],
            },
          ]}
        >
          <Svg width={16} height={24}>
            <Circle cx={8} cy={12} r={8} fill="#5C4033" />
          </Svg>
        </Animated.View>

        {/* Stage 1: Sprout */}
        <Animated.View
          style={[
            styles.stage,
            {
              opacity: animatedStyles[1],
              transform: [{ scale: animatedStyles[1] }],
            },
          ]}
        >
          <Svg width={24} height={32}>
            <Rect x={11} y={8} width={2} height={16} fill="#2D5A27" />
            <Circle cx={12} cy={4} r={6} fill="#2D5A27" transform="rotate(-45 12 4)" />
            <Circle cx={12} cy={4} r={6} fill="#2D5A27" transform="rotate(45 12 4)" />
          </Svg>
        </Animated.View>

        {/* Stage 2: Small Tree */}
        <Animated.View
          style={[
            styles.stage,
            {
              opacity: animatedStyles[2],
              transform: [{ scale: animatedStyles[2] }],
            },
          ]}
        >
          <Svg width={96} height={104} viewBox="0 0 96 104">
            <Rect x={46} y={44} width={4} height={60} fill="#5C4033" />
            <Circle cx={48} cy={40} r={24} fill="#2D5A27" />
            <Circle cx={48} cy={32} r={20} fill="#1B4721" />
          </Svg>
        </Animated.View>

        {/* Stage 3: Medium Tree */}
        <Animated.View
          style={[
            styles.stage,
            {
              opacity: animatedStyles[3],
              transform: [{ scale: animatedStyles[3] }],
            },
          ]}
        >
          <Svg width={128} height={176} viewBox="0 0 128 176">
            <Rect x={61} y={80} width={6} height={96} fill="#5C4033" />
            <Circle cx={64} cy={72} r={32} fill="#2D5A27" />
            <Circle cx={64} cy={60} r={28} fill="#1B4721" />
            <Circle cx={64} cy={48} r={24} fill="#2D5A27" />
          </Svg>
        </Animated.View>

        {/* Stage 4: Large Tree */}
        <Animated.View
          style={[
            styles.stage,
            {
              opacity: animatedStyles[4],
              transform: [{ scale: animatedStyles[4] }],
            },
          ]}
        >
          <Svg width={192} height={264} viewBox="0 0 192 264">
            <Rect x={92} y={120} width={8} height={144} fill="#5C4033" />
            <Circle cx={96} cy={108} r={48} fill="#2D5A27" />
            <Circle cx={96} cy={84} r={40} fill="#1B4721" />
            <Circle cx={96} cy={60} r={36} fill="#2D5A27" />
          </Svg>
        </Animated.View>

        {/* Stage 5: Full Tree */}
        <Animated.View
          style={[
            styles.stage,
            {
              opacity: animatedStyles[5],
              transform: [{ scale: animatedStyles[5] }],
            },
          ]}
        >
          <Svg width={256} height={360} viewBox="0 0 256 360">
            <Rect x={122} y={168} width={12} height={192} fill="#5C4033" />
            <Circle cx={128} cy={152} r={64} fill="#2D5A27" />
            <Circle cx={128} cy={120} r={56} fill="#1B4721" />
            <Circle cx={128} cy={88} r={48} fill="#2D5A27" />
          </Svg>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[styles.button, growthStage >= maxStages && styles.disabledButton]}
        onPress={handleGrow}
        disabled={growthStage >= maxStages}
      >
        <Text style={styles.buttonText}>
          {growthStage >= maxStages ? 'Fully Grown!' : 'Make Payment'}
        </Text>
      </TouchableOpacity>
      {growthStage > 0 && (
        <Text style={styles.message}>
          Great job! Online payment saves trees! 🌳
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  treeContainer: {
    width: 256,
    height: 450, // Increased to accommodate taller SVGs
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  stage: {
    position: 'absolute',
    bottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default EcoImpactTree;