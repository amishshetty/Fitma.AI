import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text as RNText } from 'react-native';
import LivaAvatar from '../components/layout/LivaAvatar';
import PrimaryButton from '../components/ui/PrimaryButton';
import { ink, green, muted } from '../constants';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProgressWeeklyScreen({
  onBack = () => {},
  onNavigate = () => {},
  loggedMeals = [],
  goals = { calories: 1800, protein: 100 },
}: any) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const stats = useMemo(() => {
    const dailyTotals = [0, 0, 0, 0, 0, 0, 0];
    const dailyProtein = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    loggedMeals.forEach((meal: any) => {
      const mealDate = new Date(parseInt(meal.id));
      if (mealDate >= monday) {
        const dayIdx = (mealDate.getDay() + 6) % 7;
        dailyTotals[dayIdx] += meal.calories || 0;
        dailyProtein[dayIdx] += meal.protein || 0;
      }
    });

    let goalsMet = 0;
    let proteinMet = 0;
    let sumCalories = 0;
    let healthiestIdx = 0;
    let closestToGoalDiff = 99999;
    let currentStreak = 0;
    let daysWithFood = 0;

    for (let i = 0; i <= dayOfWeek; i++) {
      if (dailyTotals[i] > 0) {
        sumCalories += dailyTotals[i];
        daysWithFood++;
      }
      const metGoal = dailyTotals[i] > 0 && dailyTotals[i] <= goals.calories + 100 && dailyTotals[i] >= goals.calories - 400;
      if (metGoal) {
        goalsMet++;
        currentStreak++;
      } else {
        currentStreak = 0;
      }
      if (dailyProtein[i] >= (goals.protein || 100)) {
        proteinMet++;
      }
      const diff = Math.abs(dailyTotals[i] - goals.calories);
      if (dailyTotals[i] > 0 && diff < closestToGoalDiff) {
        closestToGoalDiff = diff;
        healthiestIdx = i;
      }
    }

    const avgCalories = daysWithFood > 0 ? Math.round(sumCalories / daysWithFood) : 0;
    const dayNamesFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return {
      trend: dailyTotals,
      goalsMet,
      streak: currentStreak,
      avgCalories,
      proteinMet,
      healthiestDay: sumCalories > 0 ? dayNamesFull[healthiestIdx] : 'N/A',
    };
  }, [loggedMeals, goals]);

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>This Week</Text>
          <Text style={styles.subtitle}>Excellent week! You met your calorie goal on {stats.goalsMet} out of 7 days.</Text>
        </View>

        <View style={styles.trendCard}>
          <Text style={styles.trendTitle}>Daily Calorie Consumption</Text>
          <View style={styles.chartRow}>
            {stats.trend.map((kcal, index) => {
              const maxKcal = Math.max(2800, goals.calories * 1.2);
              const percent = Math.min(100, Math.round((kcal / maxKcal) * 100));
              const isOverGoal = kcal > goals.calories + 100;
              return (
                <View key={index} style={styles.barCol}>
                  <Text style={styles.barVal}>{kcal > 0 ? kcal : ''}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${percent}%`, backgroundColor: isOverGoal ? '#fb923c' : green }]} />
                  </View>
                  <Text style={styles.barLabel}>{days[index]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.highlightsGrid}>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>🏆 Longest Streak</Text>
            <Text style={styles.highlightVal}>{stats.streak} Days</Text>
          </View>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>🥗 Healthiest Day</Text>
            <Text style={[styles.highlightVal, { color: green }]}>{stats.healthiestDay}</Text>
          </View>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>🔥 Average Calories</Text>
            <Text style={styles.highlightVal}>{stats.avgCalories.toLocaleString()} kcal</Text>
          </View>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>💪 Protein Goal Met</Text>
            <Text style={[styles.highlightVal, { color: '#0EA5E9' }]}>{stats.proteinMet} / 7 Days</Text>
          </View>
        </View>

        <View style={styles.livaCard}>
          <LivaAvatar size={38} floating />
          <View style={styles.livaTextWrapper}>
            <Text style={styles.livaTitle}>Liva Weekly Summary</Text>
            <Text style={styles.livaDesc}>
              {stats.goalsMet > 4
                ? `You stayed within your calorie goal on ${stats.goalsMet} of the last 7 days. Great consistency! Keep up the good work and maintain this momentum.`
                : stats.goalsMet > 0
                  ? `You hit your calorie goals on ${stats.goalsMet} days this week. Focus on making small sustainable choices for the remaining days.`
                  : `You haven't hit your calorie goals this week yet. Start fresh tomorrow by planning your meals ahead!`}
            </Text>
          </View>
        </View>

      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton onPress={() => onNavigate('progress-monthly')}>
          View Monthly Insights
        </PrimaryButton>
      </View>
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
  trendCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  trendTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 144,
  },
  barCol: {
    alignItems: 'center',
    gap: 8,
    width: 32,
  },
  barVal: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
    height: 12,
  },
  barTrack: {
    width: '100%',
    height: 96,
    backgroundColor: '#f2faf5',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 16,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  highlightCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.06)',
  },
  highlightLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 6,
  },
  highlightVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  livaCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.16)',
    gap: 12,
  },
  livaTextWrapper: {
    flex: 1,
  },
  livaTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#197a38',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  livaDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
});
