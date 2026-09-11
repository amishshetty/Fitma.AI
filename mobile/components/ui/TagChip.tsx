import { useAppStore } from '../../store/useAppStore';
import React from 'react';
import { Pressable, useColorScheme, Text as RNText, StyleSheet } from 'react-native';

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
  const appTheme = useAppStore((s: any) => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);

  return (
    <Pressable
      onPress={onPress || onClick}
      style={styles.container}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#f1f5f9',
    shadowColor: 'rgba(0,0,0,0.02)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#f8fafc' : '#10201A',
  },
});
