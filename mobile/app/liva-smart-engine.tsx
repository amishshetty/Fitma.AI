import React, { useState } from 'react';
import { green, muted, softGreen, ink } from '../constants';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text as RNText } from 'react-native';
import { BrainCircuit, Activity, Zap, Info, Clock, Calendar, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const green = '#34C759';
const muted = '#64748b';

export default function LivaSmartEngineScreen() {
  const [enabled, setEnabled] = useState(true);
  const router = useRouter();

  const aiCategories = [
    {
      id: 'meals',
      name: 'Smart Meal Reminders',
      description: 'Adapts to your eating schedule to send timely reminders without spam.',
      stage: 'STAGE_2_ADAPTIVE',
      statusText: 'Adaptive Learning (Day 12)',
      nextPrediction: 'Lunch at 1:15 PM',
      confidence: 85,
    },
    {
      id: 'water',
      name: 'Dynamic Hydration',
      description: 'Calculates intake vs wake time. Adjusts on workout days.',
      stage: 'STAGE_1_LEARNING',
      statusText: 'Initial Learning Phase',
      nextPrediction: '200ml every 1.5 hours',
      confidence: 45,
    },
    {
      id: 'protein',
      name: 'Protein Optimization',
      description: 'Analyzes daily macros to suggest high-protein snacks.',
      stage: 'STAGE_3_OPTIMIZED',
      statusText: 'Fully Optimized',
      nextPrediction: 'Summary at 5:00 PM',
      confidence: 96,
    },
  ];

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#0f172a" />
          </Pressable>
          <Text style={styles.headerTitle}>Liva AI Engine</Text>
          <Text style={styles.headerSubtitle}>Your personal intelligence core for smart notifications.</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.switchCard}>
            <View style={[styles.switchIndicator, { backgroundColor: enabled ? green : muted }]} />
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Liva Smart Reminders</Text>
              <Text style={styles.switchSubtitle}>Let AI manage your notification schedule.</Text>
            </View>
            <Pressable 
              onPress={() => setEnabled(!enabled)}
              style={[styles.switchTrack, enabled ? styles.switchTrackEnabled : styles.switchTrackDisabled]}
            >
              <View style={styles.switchThumb} />
            </Pressable>
          </View>

          <View style={[styles.aiEngineStatus, { opacity: enabled ? 1 : 0.5 }]} pointerEvents={enabled ? 'auto' : 'none'}>
            <View style={styles.modulesHeader}>
              <BrainCircuit size={16} color={green} />
              <Text style={styles.modulesTitle}>Intelligence Modules</Text>
            </View>

            <View style={styles.categoriesContainer}>
              {aiCategories.map((cat, idx) => (
                <View key={idx} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <View style={[
                      styles.statusBadge,
                      {
                        backgroundColor: cat.stage === 'STAGE_3_OPTIMIZED' ? '#f5f3ff' : cat.stage === 'STAGE_2_ADAPTIVE' ? '#fffbeb' : '#ecfbf1',
                      }
                    ]}>
                      <Activity size={10} color={cat.stage === 'STAGE_3_OPTIMIZED' ? '#8B5CF6' : cat.stage === 'STAGE_2_ADAPTIVE' ? '#F59E0B' : '#34C759'} />
                      <Text style={[
                        styles.statusBadgeText,
                        { color: cat.stage === 'STAGE_3_OPTIMIZED' ? '#8B5CF6' : cat.stage === 'STAGE_2_ADAPTIVE' ? '#F59E0B' : '#34C759' }
                      ]}>{cat.statusText}</Text>
                    </View>
                  </View>

                  <Text style={styles.categoryDesc}>{cat.description}</Text>

                  <View style={styles.predictionBox}>
                    <View style={styles.predictionRow}>
                      <View style={styles.predictionLabel}>
                        <Clock size={12} color="#64748b" />
                        <Text style={styles.predictionLabelText}>Next Prediction</Text>
                      </View>
                      <Text style={styles.predictionValue}>{cat.nextPrediction}</Text>
                    </View>

                    <View style={styles.predictionRow}>
                      <View style={styles.predictionLabel}>
                        <Zap size={12} color="#64748b" />
                        <Text style={styles.predictionLabelText}>AI Confidence</Text>
                      </View>
                      <View style={styles.confidenceContainer}>
                        <View style={styles.confidenceBarBg}>
                          <View style={[styles.confidenceBarFill, { width: `${cat.confidence}%` }]} />
                        </View>
                        <Text style={styles.predictionValue}>{cat.confidence}%</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.infoBox}>
            <Info size={16} color={green} style={{ marginTop: 2 }} />
            <Text style={styles.infoText}>
              Liva's Brain evaluates your patterns every 15 minutes. It actively prevents notification fatigue and only sends what matters.
            </Text>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 48,
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
  },
  switchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  switchIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    opacity: 0.8,
  },
  switchTextContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  switchSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  switchTrack: {
    width: 48,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchTrackEnabled: {
    backgroundColor: '#34C759',
    alignItems: 'flex-end',
  },
  switchTrackDisabled: {
    backgroundColor: '#e2e8f0',
    alignItems: 'flex-start',
  },
  switchThumb: {
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  aiEngineStatus: {
    marginTop: 24,
  },
  modulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  modulesTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#64748b',
    marginLeft: 8,
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  categoryDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 16,
  },
  predictionBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 8,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginLeft: 4,
  },
  predictionValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceBarBg: {
    width: 64,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 3,
  },
  infoBox: {
    backgroundColor: '#f0f9f4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2f5e9',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#0f172a',
    lineHeight: 18,
  },
});

