import React from 'react';
import { View, Pressable, Text as RNText, StyleSheet, ScrollView, SafeAreaView, useColorScheme } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import { useAppStore } from '../../store/useAppStore';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ScreenShell({
  title,
  subtitle,
  children,
  footer,
  onBack,
  compact,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onBack?: () => void;
  compact?: boolean;
}) {
  const appTheme = useAppStore(s => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);
  
  const textColor = isDark ? '#f8fafc' : '#000';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const iconColor = isDark ? '#f8fafc' : '#10201A';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const backBtnBg = isDark ? '#334155' : '#f1f5f9';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        {onBack && (
          <Pressable onPress={onBack} style={[styles.backButton, { backgroundColor: backBtnBg }]}>
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
        )}
        <View style={styles.titleContainer}>
          {title && <Text style={[styles.title, { color: textColor }]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, { color: subtextColor }]}>{subtitle}</Text>}
        </View>
      </View>
      
      <ScrollView contentContainerStyle={[styles.content, compact ? { paddingTop: 16 } : { paddingTop: 24 }]}>
        {children}
      </ScrollView>
      
      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeAreaView>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#334155' : '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#f8fafc' : '#10201A',
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: isDark ? '#94a3b8' : '#64748b',
    lineHeight: 20,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 8,
  },
});
