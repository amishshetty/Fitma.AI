import React, { useState, useMemo, useRef, useEffect } from 'react';
import { green, muted, softGreen, ink } from '../../constants';
import { View, useColorScheme, ScrollView, Pressable, StyleSheet, Text as RNText } from 'react-native';
import {
  TrendingUp, Leaf, Calendar, MessageCircle, Award, Target, Activity, Flame
} from 'lucide-react-native';
import LivaAvatar from '../../components/layout/LivaAvatar';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';

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

export default function ProgressDashboardScreen() {
  const appTheme = useAppStore(s => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);

  const router = useRouter();
  
  const waterLogged = useAppStore((state) => state.waterLogged);
  const caloriesLogged = useAppStore((state) => state.caloriesLogged);
  const proteinLogged = useAppStore((state) => state.proteinLogged);
  const goals = useAppStore((state) => state.goals);
  const meals = useAppStore((state) => state.meals);
  const history = useAppStore((state) => state.history);
  const completedHabits = useAppStore((state) => state.completedHabits) || {};
  
  const userWeight = 75.4; // TODO: Pull from settings
  const loggedMealsCount = meals.length;
  
  const todaysLoggedMeals = meals;

  const onNavigate = (route: string) => {
    router.push('/(tabs)/home'); 
  };
  
  const habitCompletionRate = useMemo(() => {
    const total = 5;
    const completed = Object.values(completedHabits).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }, [completedHabits]);

  const [activeChartTab, setActiveChartTab] = useState('Today');
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);

  const handleBarTap = (index: number) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    if (activeTooltipIndex === index) {
      setActiveTooltipIndex(null);
    } else {
      setActiveTooltipIndex(index);
      tooltipTimeoutRef.current = setTimeout(() => {
        setActiveTooltipIndex(null);
      }, 4000);
    }
  };

  const chartData = useMemo(() => {
    const data: any[] = [];
    let maxKcal = 500;

    if (activeChartTab === 'Week') {
      const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0];
        const dayData = history?.[dateStr] || {};
        const p = dayData.protein || 0;
        const c = dayData.carbs || 0;
        const f = dayData.fat || 0;
        const kcal = dayData.calories || 0;

        if (kcal > maxKcal) maxKcal = kcal;
        data.push({ day: days[d.getDay()], p, c, f, kcal });
      }
    } else if (activeChartTab === 'Month') {
      const labels = ['W1', 'W2', 'W3', 'W4'];
      for (let w = 3; w >= 0; w--) {
        let p = 0,
          c = 0,
          f = 0,
          kcal = 0;
        for (let i = 0; i < 7; i++) {
          const daysAgo = w * 7 + i;
          const d = new Date(Date.now() - daysAgo * 86400000);
          const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];
          const dayData = history?.[dateStr] || {};
          p += dayData.protein || 0;
          c += dayData.carbs || 0;
          f += dayData.fat || 0;
          kcal += dayData.calories || 0;
        }
        p = Math.round(p / 7);
        c = Math.round(c / 7);
        f = Math.round(f / 7);
        kcal = Math.round(kcal / 7);

        if (kcal > maxKcal) maxKcal = kcal;
        data.push({ day: labels[3 - w], p, c, f, kcal });
      }
    } else if (activeChartTab === 'Today') {
      const mealTypes = [
        { key: 'breakfast', label: 'B' },
        { key: 'lunch', label: 'L' },
        { key: 'snack', label: 'S' },
        { key: 'dinner', label: 'D' },
      ];

      mealTypes.forEach(({ key, label }) => {
        let p = 0,
          c = 0,
          f = 0,
          kcal = 0;
        if (todaysLoggedMeals) {
          todaysLoggedMeals.forEach((m: any) => {
            if (m.mealType === key) {
              p += m.protein || 0;
              c += m.carbs || 0;
              f += m.fat || 0;
              kcal += m.calories || 0;
            }
          });
        }

        if (kcal > maxKcal) maxKcal = kcal;
        data.push({ day: label, p, c, f, kcal });
      });
    }

    maxKcal = Math.ceil((maxKcal * 1.35) / 100) * 100;
    if (maxKcal < 500) maxKcal = 500;

    const yAxisLabels = [
      maxKcal,
      Math.round(maxKcal * 0.75),
      Math.round(maxKcal * 0.5),
      Math.round(maxKcal * 0.25),
      0,
    ];

    let displayMetric = 0;
    if (activeChartTab === 'Week' || activeChartTab === 'Today') {
      displayMetric = caloriesLogged;
    } else if (activeChartTab === 'Month') {
      displayMetric = Math.round(
        data.reduce((acc, curr) => acc + curr.kcal, 0) / 4
      );
    }

    return { data, maxKcal, yAxisLabels, displayMetric };
  }, [history, todaysLoggedMeals, activeChartTab, caloriesLogged]);

  // Use web HealthScore calculation logic directly inline for demo, as it matches Web's `getHealthScore(caloriesLogged, waterLogged, goals, completedHabits)`
  const score = useMemo(() => {
    let pts = 0;
    const calTarget = goals?.calories || 2000;
    const waterTarget = goals?.water || 2500;
    
    // Adherence to calorie goal
    if (caloriesLogged > 0) {
      const calRatio = caloriesLogged / calTarget;
      if (calRatio >= 0.8 && calRatio <= 1.1) pts += 40;
      else if (calRatio > 0 && calRatio < 1.3) pts += 25;
    }
    
    // Adherence to water goal
    if (waterLogged > 0) {
      const waterRatio = Math.min(1, waterLogged / waterTarget);
      pts += (waterRatio * 30);
    }
    
    // Base score for using the app
    pts += 15;
    
    // Additional points for completed habits
    const totalHabits = 5;
    const completed = Object.values(completedHabits || {}).filter(Boolean).length;
    pts += Math.min(15, completed * 3);
    
    return Math.min(100, Math.round(pts));
  }, [caloriesLogged, waterLogged, goals, completedHabits]);

  let scoreBgClass = isDark ? 'rgba(34,197,94,0.1)' : '#f2faf5';
  let scoreTextClass = isDark ? '#22c55e' : '#197a38';
  let dot = '#22c55e';
  let label1 = 'Excellent';
  let label2 = '';

  if (score < 76 && score >= 51) {
    scoreBgClass = isDark ? 'rgba(59,130,246,0.1)' : '#e6f4fe';
    scoreTextClass = isDark ? '#60a5fa' : '#2563eb';
    dot = '#3b82f6';
    label1 = 'Good';
    label2 = 'Progress';
  } else if (score < 51) {
    scoreBgClass = isDark ? 'rgba(234,88,12,0.1)' : '#fff7ed';
    scoreTextClass = isDark ? '#fb923c' : '#ea580c';
    dot = '#f97316';
    label1 = 'Needs';
    label2 = 'Attention';
  }

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
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
              <View style={[styles.scoreDot, { backgroundColor: dot, shadowColor: dot, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.5, shadowRadius: 3, elevation: 1 }]} />
              <Text style={[styles.scoreBadgeText, { color: scoreTextClass }]}>
                {label1}{label2 ? `\n${label2}` : ''}
              </Text>
            </View>
          </View>
          
          {/* Core Nutrient Rings Row */}
          <View style={styles.ringsRow}>
            <ProgressRing value={Math.round((caloriesLogged / (goals?.calories || 2000)) * 100)} size={56} color={green} label="cal" />
            <ProgressRing value={Math.min(100, Math.round(((proteinLogged || 0) / (goals?.protein || 100)) * 100))} size={56} color="#0EA5E9" label="protein" />
            <ProgressRing value={Math.round((waterLogged / (goals?.water || 2500)) * 100)} size={56} color="#00C4B0" label="water" />
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
          
          {/* Segment Control */}
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

          {/* Metric */}
          <View style={styles.chartMetricRow}>
            <Flame size={20} color="#059669" strokeWidth={2.5} />
            <Text style={styles.chartMetricText}>{chartData.displayMetric} kcal</Text>
          </View>

          {/* Chart */}
          <View style={styles.chartArea}>
            <View style={StyleSheet.absoluteFill}>
              {chartData.yAxisLabels.map((val, idx) => (
                <View key={idx} style={styles.chartYAxisRow}>
                  <Text style={styles.chartYAxisLabel}>{val}</Text>
                  <View style={styles.chartYAxisLine} />
                </View>
              ))}
            </View>

            <View style={styles.chartBarsContainer}>
              {chartData.data.map((data, i) => {
                const totalMacroKcal = data.p * 4 + data.c * 4 + data.f * 9 || 1;
                const pPct = ((data.p * 4) / totalMacroKcal) * 100;
                const cPct = ((data.c * 4) / totalMacroKcal) * 100;
                const fPct = ((data.f * 9) / totalMacroKcal) * 100;
                const barHeight = Math.min((data.kcal / chartData.maxKcal) * 100, 100);

                return (
                  <Pressable
                    key={i}
                    style={styles.chartBarCol}
                    onPress={() => handleBarTap(i)}
                  >
                    {data.kcal > 0 && (
                      <View style={[styles.chartBarWrapper, { height: `${barHeight}%` }]}>
                        <View style={[styles.chartBarSegment, { backgroundColor: '#10b981', height: `${fPct}%` }]} />
                        <View style={[styles.chartBarSegment, { backgroundColor: '#f59e0b', height: `${cPct}%` }]} />
                        <View style={[styles.chartBarSegment, { backgroundColor: '#0ea5e9', height: `${pPct}%` }]} />
                      </View>
                    )}

                    {activeTooltipIndex === i && data.kcal > 0 && (
                      <View style={styles.chartTooltip}>
                        <Text style={styles.chartTooltipTitle}>{data.kcal} <Text style={{fontSize: 10, fontWeight: 'bold', color: '#94a3b8'}}>kcal</Text></Text>
                        <View style={styles.chartTooltipRow}>
                          <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                            <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#0ea5e9'}} />
                            <Text style={styles.chartTooltipLabel}>Protein</Text>
                          </View>
                          <Text style={styles.chartTooltipValue}>{data.p}g</Text>
                        </View>
                        <View style={styles.chartTooltipRow}>
                          <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                            <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b'}} />
                            <Text style={styles.chartTooltipLabel}>Carbs</Text>
                          </View>
                          <Text style={styles.chartTooltipValue}>{data.c}g</Text>
                        </View>
                        <View style={styles.chartTooltipRow}>
                          <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                            <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981'}} />
                            <Text style={styles.chartTooltipLabel}>Fat</Text>
                          </View>
                          <Text style={styles.chartTooltipValue}>{data.f}g</Text>
                        </View>
                        <View style={styles.chartTooltipTriangle} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.chartXAxisLabels}>
              {chartData.data.map((data, i) => (
                <Text key={i} style={styles.chartXAxisLabel}>{data.day}</Text>
              ))}
            </View>
          </View>

          {/* Legend */}
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

const getStyles = (isDark: boolean) => StyleSheet.create({
  rootContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
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
    color: isDark ? '#f8fafc' : '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#94a3b8' : '#64748b',
    marginTop: 4,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#f1f5f9',
    marginBottom: 24,
    shadowColor: 'rgba(16,32,26,0.04)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
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
    color: isDark ? '#f8fafc' : '#000',
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
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(34,197,94,0.2)' : '#e4f4ea',
    marginBottom: 24,
    gap: 14,
    shadowColor: 'rgba(16,32,26,0.02)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  insightAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: isDark ? 'rgba(34,197,94,0.1)' : '#f2faf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTextContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: isDark ? '#22c55e' : '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightDesc: {
    fontSize: 12,
    color: isDark ? '#94a3b8' : '#64748b',
    lineHeight: 18,
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#f1f5f9',
    marginBottom: 24,
    shadowColor: 'rgba(16,32,26,0.04)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: isDark ? '#f8fafc' : '#000',
    marginBottom: 16,
  },
  chartTabs: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
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
    backgroundColor: isDark ? '#1e293b' : '#fff',
    elevation: 1,
  },
  chartTabText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: isDark ? '#94a3b8' : '#64748b',
  },
  chartTabTextActive: {
    color: isDark ? '#f8fafc' : '#000',
  },
  chartMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  chartMetricText: {
    fontSize: 22,
    fontWeight: '900',
    color: isDark ? '#f8fafc' : '#000',
  },
  chartArea: {
    height: 192,
    width: '100%',
    marginBottom: 8,
    position: 'relative',
  },
  chartYAxisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 192 / 4.5,
  },
  chartYAxisLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: isDark ? '#94a3b8' : '#64748b',
    width: 28,
    textAlign: 'left',
  },
  chartYAxisLine: {
    flex: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
    marginLeft: 8,
  },
  chartBarsContainer: {
    position: 'absolute',
    left: 36,
    right: 8,
    bottom: 24,
    top: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  chartBarCol: {
    height: '100%',
    width: 16,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  chartBarWrapper: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 0,
  },
  chartBarSegment: {
    width: '100%',
  },
  chartTooltip: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 8,
    backgroundColor: isDark ? '#0f172a' : '#fff',
    borderColor: isDark ? '#334155' : '#f1f5f9',
    borderWidth: 1,
    padding: 12,
    borderRadius: 16,
    width: 110,
    alignItems: 'center',
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 8,
  },
  chartTooltipTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: isDark ? '#f8fafc' : '#000',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#334155' : '#f1f5f9',
    paddingBottom: 8,
    marginBottom: 8,
    width: '100%',
  },
  chartTooltipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  chartTooltipLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: isDark ? '#94a3b8' : '#64748b',
  },
  chartTooltipValue: {
    fontSize: 11,
    fontWeight: '900',
    color: isDark ? '#f8fafc' : '#000',
  },
  chartTooltipTriangle: {
    position: 'absolute',
    top: '100%',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: isDark ? '#0f172a' : '#fff',
  },
  chartXAxisLabels: {
    position: 'absolute',
    bottom: 0,
    left: 36,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  chartXAxisLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: isDark ? '#94a3b8' : '#64748b',
    width: 16,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 12,
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
    color: isDark ? '#94a3b8' : '#64748b',
  },
  summarySection: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: isDark ? '#94a3b8' : '#64748b',
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
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#f1f5f9',
    shadowColor: 'rgba(16,32,26,0.02)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 1,
  },
  summaryItemLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: isDark ? '#94a3b8' : '#64748b',
    marginBottom: 4,
  },
  summaryItemVal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#f8fafc' : '#000',
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
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#f1f5f9',
    shadowColor: 'rgba(16,32,26,0.02)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: isDark ? '#f8fafc' : '#000',
    flex: 1,
  },
});
