import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export default function IconButton({
  children,
  onClick,
  onPress,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  onPress?: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress || onClick}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={styles.content}>
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
