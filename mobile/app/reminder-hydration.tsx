import { useAppStore } from '../store/useAppStore';
import React from 'react';
import { View, useColorScheme, ScrollView, Pressable, StyleSheet, Text as RNText } from 'react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

type GoalConfig = {
  water: number;
};

export default function ReminderHydrationScreen({
  onBack,
  waterLogged = 1000,
  goals = { water: 2500 },
  onLogWater,
}: {
  onBack?: () => void;
  waterLogged?: number;
  goals?: GoalConfig;
  onLogWater?: (amount: number) => void;
}) {
  const appTheme = useAppStore((s: any) => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);

  const waterGoal = goals.water;
  const cylinderPercent = Math.min(
    100,
    Math.round((waterLogged / waterGoal) * 100)
  );

  return (
    <View style={styles.rootContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Hydration Check</Text>
        <Text style={styles.subtitle}>You're only halfway to today's water goal.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.cylinderContainer}>
            <View style={[styles.waterFill, { height: `${cylinderPercent}%` }]}>
              <View style={styles.waterTop} />
            </View>
            <View style={styles.cylinderTextContainer}>
              <Text style={[styles.percentText, { color: cylinderPercent > 40 ? 'white' : '#0f172a' }]}>
                {cylinderPercent}%
              </Text>
              <Text style={[styles.hydratedText, { color: cylinderPercent > 40 ? 'white' : '#0f172a' }]}>
                Hydrated
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.statsLabel}>LOGGED TODAY</Text>
            <Text style={styles.statsValue}>{(waterLogged / 1000).toFixed(2)} L</Text>
            <Text style={styles.statsTarget}>Goal Target: {(waterGoal / 1000).toFixed(2)} L</Text>
          </View>

          <Pressable onPress={onBack} style={styles.remindButton}>
            <Text style={styles.remindText}>REMIND ME LATER</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.logButton} onPress={() => onLogWater?.(500)}>
          <Text style={styles.logButtonText}>Log 500ml Bottle</Text>
        </Pressable>
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  rootContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
  },
  header: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: isDark ? '#f8fafc' : '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: isDark ? '#94a3b8' : '#64748b',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  cylinderContainer: {
    height: 192,
    width: 128,
    borderWidth: 4,
    borderColor: isDark ? '#334155' : '#f1f5f9',
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  waterFill: {
    width: '100%',
    backgroundColor: 'rgba(0,196,176,0.8)',
    position: 'relative',
  },
  waterTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#00c4b0',
  },
  cylinderTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: 14,
    fontWeight: '900',
  },
  hydratedText: {
    fontSize: 10,
    opacity: 0.8,
    marginTop: 2,
  },
  statsContainer: {
    alignItems: 'center',
    gap: 4,
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: isDark ? '#94a3b8' : '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '900',
    color: isDark ? '#f8fafc' : '#0f172a',
  },
  statsTarget: {
    fontSize: 12,
    color: isDark ? '#94a3b8' : '#64748b',
    fontWeight: '600',
  },
  remindButton: {
    paddingVertical: 8,
  },
  remindText: {
    fontSize: 12,
    fontWeight: '700',
    color: isDark ? '#94a3b8' : '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderTopWidth: 1,
    borderTopColor: isDark ? '#334155' : '#f1f5f9',
  },
  logButton: {
    height: 56,
    backgroundColor: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logButtonText: {
    color: isDark ? '#1e293b' : '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
