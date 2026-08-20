import React from 'react';
import { View, ScrollView, StyleSheet, Text as RNText } from 'react-native';
import { ink, green } from '../constants';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProgressAchievementsScreen({
  onBack = () => {},
}: any) {
  const achievements = [
    {
      title: 'First Meal Logged',
      criteria: 'Log your first meal using voice, camera, or text',
      count: 100,
      unlocked: true,
      icon: '🍳',
      bg: '#ecfbf1',
      color: '#34C759',
    },
    {
      title: '7-Day Streak',
      criteria: 'Consistently log food for 7 consecutive days',
      count: 70,
      unlocked: false,
      icon: '🔥',
      bg: '#fff8eb',
      color: '#fb923c',
    },
    {
      title: 'Protein Hero',
      criteria: 'Hit your daily protein target of 120g',
      count: 100,
      unlocked: true,
      icon: '🥚',
      bg: '#e9f7ff',
      color: '#0ea5e9',
    },
    {
      title: 'Hydration Master',
      criteria: 'Complete water targets for 6 days straight',
      count: 83,
      unlocked: false,
      icon: '💧',
      bg: '#e9fbf7',
      color: '#00C4B0',
    },
    {
      title: 'Goal Crusher',
      criteria: 'Lose your first 3 kilograms',
      count: 40,
      unlocked: false,
      icon: '🎯',
      bg: '#fff0f3',
      color: '#f43f5e',
    },
    {
      title: 'Healthy Week',
      criteria: 'Maintain a health score above 80 for 7 days',
      count: 100,
      unlocked: true,
      icon: '🥗',
      bg: '#f8fafc',
      color: '#10201a',
    },
  ];

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>Gamified milestones unlocked on Fitma.ai.</Text>
        </View>

        <View style={styles.grid}>
          {achievements.map((ach, idx) => (
            <View
              key={idx}
              style={[
                styles.card,
                { borderColor: ach.unlocked ? 'rgba(52, 199, 89, 0.24)' : '#f1f5f9' },
              ]}
            >
              <View>
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: ach.bg },
                    !ach.unlocked && { opacity: 0.5 },
                  ]}
                >
                  <Text style={[styles.iconText, !ach.unlocked && { opacity: 0.5 }]}>
                    {ach.icon}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: ach.unlocked ? ink : '#94a3b8' },
                  ]}
                >
                  {ach.title}
                </Text>
                <Text style={styles.cardDesc}>
                  {ach.criteria}
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${ach.count}%`,
                        backgroundColor: ach.unlocked ? green : '#cbd5e1',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {ach.unlocked ? 'Unlocked 🎉' : `${ach.count}% unlocked`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    marginBottom: 12,
    justifyContent: 'space-between',
    minHeight: 180,
  },
  iconWrapper: {
    height: 44,
    width: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '900',
    marginTop: 12,
  },
  cardDesc: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 14,
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 18,
  },
  progressBarBg: {
    height: 6,
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#64748b',
  },
});
