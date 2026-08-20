import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text as RNText } from 'react-native';
import { ink, green } from '../constants';
import { Check } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProgressHabitsScreen({
  onBack = () => {},
}: any) {
  const [habits, setHabits] = useState<{ [key: string]: boolean }>({});
  
  const onToggleHabit = (key: string) => {
    setHabits((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentStreak = 5;
  const longestStreak = 12;

  const habitsList = [
    {
      key: 'breakfast',
      label: '🍳 Breakfast Logged',
      desc: 'Log meal before 10 AM',
    },
    {
      key: 'water',
      label: '💧 Water Goal met',
      desc: 'Drink 3.0 Liters or more',
    },
    {
      key: 'protein',
      label: '🥚 Protein Goal met',
      desc: 'Eat 120g of protein',
    },
    {
      key: 'exercise',
      label: '🏃 Exercise Done',
      desc: 'Minimum 30 minutes active',
    },
    {
      key: 'sleep',
      label: '😴 Sleep Goal met',
      desc: 'Get 7.5 hours or more rest',
    },
  ];

  const statusColors = ['#e4f4ea', '#a8dfb5', '#34c759'];

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Habit Tracker</Text>
          <Text style={styles.subtitle}>Consistent habits build lasting weight trajectories.</Text>
        </View>

        {/* Calendar Heatmap card */}
        <View style={styles.heatmapCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Consistency Heatmap</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>July 2026</Text>
            </View>
          </View>

          {/* Heatmap Grid (30 blocks) */}
          <View style={styles.grid}>
            {Array.from({ length: 30 }).map((_, index) => {
              const randomShade = index % 4 === 0 ? 0 : index % 3 === 0 ? 1 : 2;
              return (
                <View
                  key={index}
                  style={[
                    styles.gridItem,
                    {
                      backgroundColor: index > 21 ? '#f3f6f4' : statusColors[randomShade],
                    },
                  ]}
                />
              );
            })}
          </View>

          <View style={styles.heatmapFooter}>
            <Text style={styles.heatmapFooterText}>Streak: {currentStreak} days</Text>
            <Text style={styles.heatmapFooterText}>Record: {longestStreak} days</Text>
          </View>
        </View>

        {/* Habit Toggles checklist */}
        <View style={styles.habitsSection}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          
          {habitsList.map((hab) => {
            const active = habits[hab.key];
            return (
              <Pressable
                key={hab.key}
                onPress={() => onToggleHabit(hab.key)}
                style={[
                  styles.habitItem,
                  { borderColor: active ? 'rgba(52, 199, 89, 0.3)' : '#f1f5f9' },
                ]}
              >
                <View>
                  <Text
                    style={[
                      styles.habitLabel,
                      { color: active ? green : ink },
                    ]}
                  >
                    {hab.label}
                  </Text>
                  <Text style={styles.habitDesc}>
                    {hab.desc}
                  </Text>
                </View>
                
                <View
                  style={[
                    styles.checkbox,
                    { backgroundColor: active ? green : '#eef4f0' },
                  ]}
                >
                  {active && <Check size={14} color="#fff" />}
                </View>
              </Pressable>
            );
          })}
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
  heatmapCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#f2faf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#34C759',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    width: '12%', // roughly 1/7 minus gap
    aspectRatio: 1,
    borderRadius: 8,
  },
  heatmapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  heatmapFooterText: {
    fontSize: 8,
    color: '#94a3b8',
    fontWeight: '600',
  },
  habitsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  habitItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  habitLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  habitDesc: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  checkbox: {
    height: 26,
    width: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
