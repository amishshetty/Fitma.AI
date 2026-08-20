import React from 'react';
import { Pressable, Text as RNText, StyleSheet } from 'react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function TagChip({
  children,
  onClick,
  onPress,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress || onClick}
      style={styles.container}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: 'rgba(0,0,0,0.02)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10201A',
  },
});
