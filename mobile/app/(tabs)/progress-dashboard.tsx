import React, { useState, useMemo } from 'react';
import { green, muted, softGreen, ink } from '../../constants';
import { View, ScrollView, Pressable, StyleSheet, Text as RNText } from 'react-native';
import {
  TrendingUp, Leaf, Calendar, MessageCircle, Award, Target, Activity, Flame
} from 'lucide-react-native';
import LivaAvatar from '../../components/layout/LivaAvatar';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const ProgressRing = ({ value, size, color, label }: any) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 4, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: size / 4.5, color, fontWeight: 'bold' }}>{value}%</Text>
    {label && <Text style={{ fontSize: 8, color: '#94a3b8', marginTop: -2 }}>{label}</Text>}
  </View>
);

const green = '#34C759';

const getHealthScore = (caloriesLogged: number, waterLogged: number, goals: any, completedHabits: any) => {
  return 85; // Mock for demo, the user uses getHealthScore from utils.
};

export default function ProgressDashboardScreen({
  onNavigate = () => {},
  userWeight = 75.4,
  waterLogged = 0,
  completedHabits = {},
  goals = { calories: 2000, water: 2500, protein: 100 },
  caloriesLogged = 0,
  proteinLogged = 0,
  loggedMealsCount = 0,
  history = {},
  todaysLoggedMeals = [],
}: any) {
  const [activeChartTab, setActiveChartTab] = useState('Today');

  const habitCompletionRate = useMemo(() => {
    const total = 5;
    const completed = Object.values(completedHabits).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }, [completedHabits]);

  const score = getHealthScore(caloriesLogged, waterLogged, goals, completedHabits);
  let scoreBgClass = '#f2faf5';
  let scoreTextClass = '#197a38';
  let dot = '#22c55e';
  let label1 = 'Excellent';
  let label2 = '';

  if (score < 76 && score >= 51) {
    scoreBgClass = '#e6f4fe';
    scoreTextClass = '#2563eb';
    dot = '#3b82f6';
    label1 = 'Good';
    label2 = 'Progress';
  } else if (score < 51) {
    scoreBgClass = '#fff7ed';
    scoreTextClass = '#ea580c';
    dot = '#f97316';
    label1 = 'Needs';
    label2 = 'Attention';
  }

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <Text style={styles.headerSubtitle}>Great work! You're building healthy habits.</Text>
        </View>

        {/* Health Score Circular Indicator Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>Health Score</Text>
            <View style={styles.scoreValueRow}>
              <Text style={styles.scoreValue}>{score}</Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
            <View style={[styles.scoreBadge, { backgroundColor: scoreBgClass }]}>
              <View style={[styles.scoreDot, { backgroundColor: dot }]} />
              <Text style={[styles.scoreBadgeText, { color: scoreTextClass }]}>
                {label1}{label2 ? `\n${label2}` : ''}
              </Text>
            </View>
          </View>
          
          <View style={styles.ringsRow}>
            <ProgressRing value={Math.round((caloriesLogged / (goals.calories || 2000)) * 100)} size={56} color={green} label="cal" />
            <ProgressRing value={Math.min(100, Math.round(((proteinLogged || 0) / (goals.protein || 100)) * 100))} size={56} color="#0EA5E9" label="protein" />
            <ProgressRing value={Math.round((waterLogged / (goals.water || 2500)) * 100)} size={56} color="#00C4B0" label="water" />
          </View>
        </View>

        {/* AI Insight Card from Liva */}
        <View style={styles.insightCard}>
          <View style={styles.insightAvatarBox}>
            <LivaAvatar size={26} floating />
          </View>
          <View style={styles.insightTextContent}>
            <Text style={styles.insightTitle}>Liva Insight</Text>
            <Text style={styles.insightDesc}>
              You usually skip breakfast on Tuesdays. Eating a protein-rich breakfast may help maintain your energy levels throughout the day.
            </Text>
          </View>
        </View>

        {/* Nutrition Analytics Chart Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Nutrition Analytics</Text>
          
          <View style={styles.chartTabs}>
            {['Today', 'Week', 'Month'].map((tab) => (
              <Pressable 
                key={tab} 
                onPress={() => setActiveChartTab(tab)}
                style={[styles.chartTabBtn, activeChartTab === tab && styles.chartTabBtnActive]}
              >
                <Text style={[styles.chartTabText, activeChartTab === tab && styles.chartTabTextActive]}>{tab}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.chartMetricRow}>
            <Flame size={20} color="#059669" strokeWidth={2.5} />
            <Text style={styles.chartMetricText}>{caloriesLogged} kcal</Text>
          </View>

          <View style={styles.chartArea}>
            <Text style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 40 }}>Chart data visualization rendered here</Text>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>Fat</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>Carbs</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0ea5e9' }]} />
              <Text style={styles.legendText}>Protein</Text>
            </View>
          </View>
        </View>

        {/* Today's Summary Metrics Grid */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionHeading}>Today's Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Meals Logged</Text>
              <Text style={styles.summaryItemVal}>{loggedMealsCount} meal{loggedMealsCount !== 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Calories Consumed</Text>
              <Text style={[styles.summaryItemVal, { color: '#10b981' }]}>{caloriesLogged} kcal</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Water Intake</Text>
              <Text style={[styles.summaryItemVal, { color: '#06b6d4' }]}>{waterLogged} ml</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Habit Streaks</Text>
              <Text style={styles.summaryItemVal}>{habitCompletionRate}% done</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionHeading}>Analytics Modules</Text>
          <View style={styles.actionsGrid}>
            <Pressable style={styles.actionBtn} onPress={() => onNavigate('progress-weekly')}>
              <Activity size={18} color="#34C759" />
              <Text style={styles.actionBtnText}>Weekly Report</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => onNavigate('progress-monthly')}>
              <TrendingUp size={18} color="#0ea5e9" />
              <Text style={styles.actionBtnText}>Monthly Trend</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => onNavigate('progress-nutrition')}>
              <Leaf size={18} color="#fb923c" />
              <Text style={styles.actionBtnText}>Nutrition</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => onNavigate('progress-weight')}>
              <TrendingUp size={18} color="#a855f7" />
              <Text style={styles.actionBtnText}>Weight Log ({userWeight} kg)</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => onNavigate('progress-habits')}>
              <Calendar size={18} color="#e11d48" />
              <Text style={styles.actionBtnText}>Habits Heatmap</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => onNavigate('progress-insights')}>
              <MessageCircle size={18} color="#f59e0b" />
              <Text style={styles.actionBtnText}>AI Insights feed</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => onNavigate('progress-achievements')}>
              <Award size={18} color="#6366f1" />
              <Text style={styles.actionBtnText}>Achievements</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => onNavigate('progress-goals')}>
              <Target size={18} color="#f43f5e" />
              <Text style={styles.actionBtnText}>Goals Setup</Text>
            </Pressable>
          </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 38,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginLeft: 2,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
  },
  scoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scoreBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  ringsRow: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 4,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.2)',
    marginBottom: 24,
    gap: 14,
  },
  insightAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#f2faf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTextContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    marginBottom: 16,
  },
  chartTabs: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  chartTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  chartTabBtnActive: {
    backgroundColor: '#fff',
    elevation: 1,
  },
  chartTabText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
  },
  chartTabTextActive: {
    color: '#000',
  },
  chartMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  chartMetricText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
  },
  chartArea: {
    height: 120,
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
  },
  summarySection: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  summaryItemLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 4,
  },
  summaryItemVal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
});

