import React, { useState, useEffect, useRef } from 'react';
import { green, muted, softGreen, ink } from '../constants';
import { View, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import LivaAvatar from '../components/layout/LivaAvatar';
import PrimaryButton from '../components/ui/PrimaryButton';
import { ArrowLeft } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const green = '#34C759';

export default function LivaWeeklyCoachScreen() {
  const router = useRouter();
  const userName = 'User'; // Fallback or pass via context/params

  const metrics = [
    { label: 'Calories Target', value: '92%', color: green },
    { label: 'Protein Consistency', value: '78%', color: '#0EA5E9' },
    { label: 'Hydration Streak', value: '6/7 days', color: '#00C4B0' },
    { label: 'Active Minutes', value: '180 min', color: '#fb923c' },
  ];

  const chartData = [45, 60, 75, 55, 90, 80, 70];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const [coachResponse, setCoachResponse] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  const handleAskCoach = (question: string) => {
    setCoachResponse(null);
    fadeAnim.setValue(0);
    slideAnim.setValue(10);
    
    setTimeout(() => {
      if (question.includes('wednesday')) {
        setCoachResponse(
          'Liva Coach: On Wednesday, you had a late lunch at 3:15 PM, which caused you to skip your afternoon hydration slot and overeat 420 kcal of processed snacks at 7:30 PM.'
        );
      } else {
        setCoachResponse(
          'Liva Coach: Next week, to hit your 120g protein target, prepare breakfast quinoa bowls ahead of time. This guarantees 30g of protein within an hour of waking up.'
        );
      }

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }, 800);
  };

  const onFinish = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#0f172a" />
          </Pressable>
          <Text style={styles.headerTitle}>Weekly Coach Audit</Text>
          <Text style={styles.headerSubtitle}>Insights and explanations about your past week parameters.</Text>
        </View>

        <View style={styles.content}>
          {/* Progress chart illustration */}
          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {chartData.map((h, i) => (
                <View key={i} style={styles.chartCol}>
                  <View style={styles.chartBarBg}>
                    <View style={[styles.chartBarFill, { height: `${h}%` }]} />
                  </View>
                  <Text style={styles.chartLabel}>{days[i]}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Coach Voice Text Card */}
          <View style={styles.insightCard}>
            <LivaAvatar size={42} floating />
            <View style={styles.insightTextContainer}>
              <Text style={styles.insightTitle}>Liva Coach Insights</Text>
              <Text style={styles.insightDesc}>
                {userName}, you stayed within your calorie goal on{' '}
                <Text style={{ color: green, fontWeight: '700' }}>5 of the last 7 days</Text>
                . Let's analyze your off-target slots below.
              </Text>
            </View>
          </View>

          {/* Ask Liva Coach Interactive Section */}
          <View style={styles.interactiveCard}>
            <Text style={styles.interactiveTitle}>Analyze Week Anomalies</Text>
            
            <View style={styles.questionContainer}>
              <Pressable 
                onPress={() => handleAskCoach('wednesday')}
                style={({ pressed }) => [styles.questionBtn, pressed && styles.questionBtnPressed]}
              >
                <Text style={styles.questionText}>❓ Why did I peak calorie-wise on Wednesday?</Text>
              </Pressable>
              
              <Pressable 
                onPress={() => handleAskCoach('protein')}
                style={({ pressed }) => [styles.questionBtn, pressed && styles.questionBtnPressed]}
              >
                <Text style={styles.questionText}>❓ How can I hit protein targets next week?</Text>
              </Pressable>
            </View>

            {coachResponse && (
              <Animated.View style={[styles.responseBox, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <Text style={styles.responseText}>{coachResponse}</Text>
              </Animated.View>
            )}
          </View>

          {/* Stat metrics cards */}
          <View style={styles.metricsGrid}>
            {metrics.map((m, idx) => (
              <View key={idx} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <Text style={styles.metricValue}>{m.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton onPress={onFinish}>Finish Weekly Checkin</PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 120, // space for footer
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 24,
    gap: 16,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.1)',
    elevation: 3,
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 144,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  chartCol: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 28,
    gap: 6,
  },
  chartBarBg: {
    width: '100%',
    height: 112,
    backgroundColor: '#e4f4ea',
    borderRadius: 14,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: '#34C759',
    borderRadius: 14,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.1)',
    elevation: 3,
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    flexDirection: 'row',
    gap: 12,
  },
  insightTextContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  insightDesc: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
  },
  interactiveCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.06)',
    elevation: 2,
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
  },
  interactiveTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  questionContainer: {
    gap: 8,
  },
  questionBtn: {
    backgroundColor: '#f2faf5',
    padding: 10,
    borderRadius: 12,
  },
  questionBtnPressed: {
    backgroundColor: '#e4f4ea',
  },
  questionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  responseBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.16)',
    borderRadius: 16,
  },
  responseText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.06)',
    elevation: 2,
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  metricValue: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
});

