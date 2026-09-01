import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text as RNText } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProgressRing({
  value,
  size = 88,
  color = '#34C759',
  label,
}: {
  value: number;
  size?: number;
  color?: string;
  label?: string;
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width="100%" height="100%" viewBox="0 0 96 96" style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth="9"
          />
          <AnimatedCircle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
        <View style={[StyleSheet.absoluteFillObject, styles.center]} pointerEvents="none">
          <Text style={[styles.percent, { color }]}>{Math.round(value)}%</Text>
        </View>
      </View>
      {label && (
        <Text style={[styles.label, { color }]}>{label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
    textTransform: 'uppercase',
  },
});
