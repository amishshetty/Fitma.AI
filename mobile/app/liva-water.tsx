import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text as RNText, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Droplets } from 'lucide-react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import ScreenShell from '../components/layout/ScreenShell';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function LivaWaterScreen() {
  const router = useRouter();
  const [waterLogged, setWaterLogged] = useState(0);
  const waterGoal = 2500; // Mock goal
  
  const glassPercent = Math.min(100, Math.round((waterLogged / waterGoal) * 100));
  
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: glassPercent,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [glassPercent, fillAnim]);

  const heightInterpolation = fillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  const onLogWater = (amount: number) => {
    setWaterLogged((prev) => Math.max(0, prev + amount));
  };

  return (
    <View style={styles.root}>
      <ScreenShell
        title="Water visualizer"
        subtitle="Interactive hydration tracker."
        onBack={() => router.back()}
        footer={<PrimaryButton onPress={() => router.back()}>Close Tracker</PrimaryButton>}
      >
        <View style={styles.contentSpace}>
          {/* Fill Glass Card */}
          <View style={styles.glassCard}>
            {/* Visual Glass Container */}
            <View style={styles.glassContainer}>
              <Animated.View style={[styles.waterFill, { height: heightInterpolation }]}>
                <View style={styles.waterTopLevel} />
              </Animated.View>

              <View style={styles.glassMetricsContainer}>
                <Text style={[styles.glassMetricsText, { color: glassPercent > 50 ? '#ffffff' : '#10201a' }]}>
                  {glassPercent}%
                </Text>
              </View>
            </View>

            <View style={styles.metricsDetails}>
              <Text style={styles.metricsLabel}>Logged Today</Text>
              <Text style={styles.metricsValue}>
                {(waterLogged / 1000).toFixed(2)} L
              </Text>
              <Text style={styles.metricsTarget}>
                Target: {(waterGoal / 1000).toFixed(2)} L
              </Text>
              <Pressable onPress={() => onLogWater(-waterLogged)} style={styles.resetButton}>
                <Text style={styles.resetText}>Reset Log</Text>
              </Pressable>
            </View>
          </View>

          {/* Quick Log Buttons */}
          <View style={styles.logButtonsGrid}>
            <Pressable 
              style={({ pressed }) => [styles.logButton, pressed && styles.logButtonPressed]}
              onPress={() => onLogWater(250)}
            >
              <Droplets color="#00c4b0" size={20} />
              <Text style={styles.logButtonValue}>+250ml</Text>
              <Text style={styles.logButtonLabel}>Cup</Text>
            </Pressable>
            
            <Pressable 
              style={({ pressed }) => [styles.logButton, pressed && styles.logButtonPressed]}
              onPress={() => onLogWater(500)}
            >
              <Droplets color="#00c4b0" size={20} />
              <Text style={styles.logButtonValue}>+500ml</Text>
              <Text style={styles.logButtonLabel}>Bottle</Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [styles.logButton, pressed && styles.logButtonPressed]}
              onPress={() => onLogWater(1000)}
            >
              <Droplets color="#00c4b0" size={20} />
              <Text style={styles.logButtonValue}>+1000ml</Text>
              <Text style={styles.logButtonLabel}>Flask</Text>
            </Pressable>
          </View>
        </View>
      </ScreenShell>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentSpace: {
    gap: 24,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 20,
  },
  glassCard: {
    borderRadius: 28,
    backgroundColor: '#ffffff',
    padding: 24,
    borderColor: 'rgba(52, 199, 89, 0.12)',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: 'rgba(16, 32, 26, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  glassContainer: {
    height: 176, // 44 * 4
    width: 96, // 24 * 4
    borderWidth: 4,
    borderColor: '#f1f5f9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: '#f8fafc',
  },
  waterFill: {
    width: '100%',
    backgroundColor: 'rgba(0, 196, 176, 0.8)',
    position: 'relative',
  },
  waterTopLevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#00c4b0',
    opacity: 0.8,
  },
  glassMetricsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassMetricsText: {
    fontWeight: '900',
    fontSize: 14,
  },
  metricsDetails: {
    alignItems: 'flex-start',
    gap: 4,
  },
  metricsLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricsValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000000',
  },
  metricsTarget: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  resetButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
  resetText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#f43f5e',
  },
  logButtonsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  logButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderColor: 'rgba(0, 196, 176, 0.16)',
    borderWidth: 1,
    shadowColor: 'rgba(16, 32, 26, 0.03)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  logButtonPressed: {
    backgroundColor: '#e9fbf7',
  },
  logButtonValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  logButtonLabel: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
});
