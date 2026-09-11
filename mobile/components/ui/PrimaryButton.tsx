import { useAppStore } from '../../store/useAppStore';
import React, { useRef } from 'react';
import { Pressable, useColorScheme, Text as RNText, StyleSheet, Animated } from 'react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function PrimaryButton({
  children,
  onPress,
  icon,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  const appTheme = useAppStore((s: any) => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled) {
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          disabled ? styles.buttonDisabled : styles.buttonActive,
        ]}
      >
        {typeof children === 'string' ? (
          <Text style={styles.text}>{children}</Text>
        ) : (
          children
        )}
        {icon}
      </Pressable>
    </Animated.View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  button: {
    minHeight: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonActive: {
    backgroundColor: isDark ? '#4ade80' : '#34C759', // Fitma Primary Green
    shadowColor: 'rgba(52,199,89,0.34)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#b9dec5',
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: isDark ? '#1e293b' : '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
