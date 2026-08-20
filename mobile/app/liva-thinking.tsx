import React, { useState, useEffect, useRef } from 'react';
import { green, muted, softGreen, ink } from '../constants';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import LivaAvatar from '../components/layout/LivaAvatar';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const green = '#34C759';

export default function LivaThinkingScreen() {
  const router = useRouter();
  const [factIndex, setFactIndex] = useState(0);
  
  const rotatingHelper = [
    'Checking your nutrition...',
    "Reviewing today's meals...",
    'Calculating remaining calories...',
  ];

  const rotationAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation Animation
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Progress Bar Animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2900,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Text Rotation
    const factTimer = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();

      setTimeout(() => {
        setFactIndex((idx) => (idx + 1) % rotatingHelper.length);
      }, 200);
    }, 1000);

    const doneTimer = setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/');
      }
    }, 3000);

    return () => {
      clearInterval(factTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['10%', '100%']
  });

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.avatarWrapper}>
          <Animated.View style={[styles.dashedBorder, { transform: [{ rotate: spin }] }]} />
          <LivaAvatar size={132} floating />
        </View>

        <Text style={styles.title}>Thinking...</Text>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.subtitle}>{rotatingHelper[factIndex]}</Text>
        </Animated.View>

        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
      </View>
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
    paddingHorizontal: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedBorder: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    left: -20,
    right: -20,
    borderRadius: 999,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(52, 199, 89, 0.4)',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 18,
  },
  progressBarBg: {
    marginTop: 44,
    height: 10,
    width: '100%',
    maxWidth: 250,
    backgroundColor: '#e4f4ea',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 5,
  },
});

