import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text as RNText, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import LivaAvatar from '../components/layout/LivaAvatar';
import ScreenShell from '../components/layout/ScreenShell';
import { rotatingFacts } from '../constants';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function AIProcessingScreen() {
  const router = useRouter();
  const [factIndex, setFactIndex] = useState(0);
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(8)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    const factTimer = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true })
      ]).start();
      
      setTimeout(() => {
        setFactIndex((index) => (index + 1) % rotatingFacts.length);
      }, 150);
    }, 900);

    const doneTimer = setTimeout(() => {
      // Navigate somewhere or pop, defaulting to liva-response as next step
      router.push('/liva-response');
    }, 3200);

    return () => {
      clearInterval(factTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const widthInterpolation = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.root}>
      <ScreenShell>
        <View style={styles.container}>
          <View style={styles.avatarWrapper}>
            <Animated.View style={[styles.dashedCircle, { transform: [{ rotate: spin }] }]} />
            <LivaAvatar size={132} floating />
          </View>
          
          <Text style={styles.title}>Analyzing your meal...</Text>
          
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.factText}>{rotatingFacts[factIndex]}</Text>
          </Animated.View>

          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBarFill, { width: widthInterpolation }]} />
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 132,
    height: 132,
  },
  dashedCircle: {
    position: 'absolute',
    top: -18,
    left: -18,
    right: -18,
    bottom: -18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(52, 199, 89, 0.35)',
    borderStyle: 'dashed',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  factText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  progressBarContainer: {
    marginTop: 40,
    height: 12,
    width: '100%',
    maxWidth: 260,
    backgroundColor: '#e4f4ea',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 6,
  },
});
