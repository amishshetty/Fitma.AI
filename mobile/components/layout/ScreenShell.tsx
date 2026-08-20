import React from 'react';
import { View, Pressable, Text as RNText, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#10201A" />
          </Pressable>
        )}
        <View style={styles.titleContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <ScrollView contentContainerStyle={[styles.content, compact ? { paddingTop: 16 } : { paddingTop: 24 }]}>
        {children}
      </ScrollView>
      
      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#f1f5f9',
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
    color: '#10201A',
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748b',
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
