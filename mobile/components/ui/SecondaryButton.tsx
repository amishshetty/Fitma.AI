import React, { useRef } from 'react';
import { Pressable, Text as RNText, StyleSheet, Animated } from 'react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function SecondaryButton({
  children,
  onPress,
  icon,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  icon?: React.ReactNode;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.button}
      >
        {icon}
        {typeof children === 'string' ? (
          <Text style={styles.text}>{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.14)',
  },
  text: {
    color: '#6d8779', // Muted green text
    fontSize: 14,
    fontWeight: 'bold',
  },
});
