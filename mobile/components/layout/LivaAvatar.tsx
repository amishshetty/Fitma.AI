import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Ellipse, Line } from 'react-native-svg';

export default function LivaAvatar({
  size = 52,
  floating = false,
}: {
  size?: number;
  floating?: boolean;
}) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (floating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -6,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      translateY.setValue(0);
    }
  }, [floating, translateY]);

  const svgSize = Math.round(size * 0.62);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateY }],
        },
      ]}
    >
      <Svg width={svgSize} height={svgSize} viewBox="0 0 80 80" fill="none">
        <Circle cx="40" cy="44" r="30" fill="#f0fdf4" />
        <Circle cx="40" cy="44" r="29" stroke="#d8f3df" strokeWidth="2" />
        <Circle cx="31" cy="40" r="5" fill="#0f1f1a" />
        <Circle cx="49" cy="40" r="5" fill="#0f1f1a" />
        <Circle cx="33" cy="38" r="2" fill="white" />
        <Circle cx="51" cy="38" r="2" fill="white" />
        <Path
          d="M32 51Q40 60 48 51"
          stroke="#0f1f1a"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <Ellipse cx="26" cy="52" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.48" />
        <Ellipse cx="54" cy="52" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.48" />
        <Line x1="40" y1="14" x2="40" y2="24" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" />
        <Circle cx="40" cy="11" r="5" fill="#34C759" />
        <Circle cx="40" cy="11" r="2.5" fill="#22c55e" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    elevation: 8,
    shadowColor: 'rgba(52, 199, 89, 0.4)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 13,
  },
});
