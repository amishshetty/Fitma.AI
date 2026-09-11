import { useAppStore } from '../../store/useAppStore';
import React from 'react';
import { View, useColorScheme, Pressable, Text as RNText, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const appTheme = useAppStore((s: any) => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onChange(Math.max(1, value - 1))}
        style={styles.buttonMinus}
        accessibilityLabel="Decrease quantity"
      >
        <Minus size={16} color="#10201A" />
      </Pressable>
      
      <Text style={styles.valueText}>{value}</Text>
      
      <Pressable
        onPress={() => onChange(value + 1)}
        style={styles.buttonPlus}
        accessibilityLabel="Increase quantity"
      >
        <Plus size={16} color="#ffffff" />
      </Pressable>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: isDark ? '#334155' : '#f1f5f9',
    borderRadius: 999,
    padding: 4,
  },
  buttonMinus: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#e2e8f0',
  },
  buttonPlus: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: isDark ? '#4ade80' : '#34C759',
  },
  valueText: {
    width: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: isDark ? '#f8fafc' : '#10201A',
  },
});
