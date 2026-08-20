import React from 'react';
import { View, Pressable, Text as RNText, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    padding: 4,
  },
  buttonMinus: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  buttonPlus: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#34C759',
  },
  valueText: {
    width: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10201A',
  },
});
