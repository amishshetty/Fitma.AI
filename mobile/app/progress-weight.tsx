import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text as RNText } from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import { ink } from '../constants';
import { Check } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProgressWeightScreen({
  onBack = () => {},
  userWeight = 75.4,
  goals = {},
  onLogWeight = () => {},
}: any) {
  const goalWeight = goals.targetWeight || 70.0;
  const startWeight = 75.4; 
  const progressPercent = Math.max(0, Math.min(100, Math.round(((startWeight - userWeight) / (startWeight - goalWeight)) * 100)));

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Weight Journey</Text>
          <Text style={styles.subtitle}>Estimated Goal Date: September 20, 2026.</Text>
        </View>

        {/* Weight timeline progress card */}
        <View style={styles.progressCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Current Weight</Text>
              <Text style={[styles.statValue, { color: '#a855f7' }]}>{userWeight.toFixed(1)} kg</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Goal Weight</Text>
              <Text style={[styles.statValue, { color: '#34c759' }]}>{goalWeight.toFixed(1)} kg</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Total Loss</Text>
              <Text style={[styles.statValue, { color: '#0ea5e9' }]}>{(startWeight - userWeight).toFixed(1)} kg</Text>
            </View>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{progressPercent}% of goal completed</Text>
        </View>

        {/* Interactive Update Slider (Mocked with buttons for RN) */}
        <View style={styles.sliderCard}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderTitle}>Log New Weight</Text>
            <Text style={styles.sliderValue}>{userWeight.toFixed(1)} kg</Text>
          </View>
          
          <View style={styles.sliderControls}>
            <Pressable 
              style={styles.sliderBtn} 
              onPress={() => onLogWeight(Math.max(68, userWeight - 0.1))}
            >
              <Text style={styles.sliderBtnText}>-</Text>
            </Pressable>
            
            <View style={styles.sliderTrackBg}>
              <View style={[styles.sliderTrackFill, { width: `${Math.max(0, Math.min(100, ((userWeight - 68) / 10) * 100))}%` }]} />
            </View>

            <Pressable 
              style={styles.sliderBtn} 
              onPress={() => onLogWeight(Math.min(78, userWeight + 0.1))}
            >
              <Text style={styles.sliderBtnText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>68 kg</Text>
            <Text style={styles.sliderLabelText}>78 kg</Text>
          </View>
        </View>

        {/* Weight Milestones Timeline */}
        <View style={styles.milestonesCard}>
          <Text style={styles.milestonesTitle}>Milestones reached</Text>
          <View style={styles.timeline}>
            {[
              { title: 'First weight logged', detail: '75.4 kg on June 15', active: true },
              { title: 'Halfway there!', detail: '72.7 kg target passed', active: userWeight <= 72.7 },
              { title: 'Under 71kg club', detail: 'Goal unlocked', active: userWeight < 71.0 },
            ].map((milestone, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <View style={[styles.timelineDot, milestone.active ? styles.timelineDotActive : styles.timelineDotInactive]}>
                  {milestone.active && <Check size={10} color="#fff" />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineItemTitle, { color: milestone.active ? ink : '#94a3b8' }]}>{milestone.title}</Text>
                  <Text style={styles.timelineItemDetail}>{milestone.detail}</Text>
                </View>
              </View>
            ))}
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
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#a855f7',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  sliderCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#a855f7',
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a855f7',
  },
  sliderTrackBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#f5f0ff',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderTrackFill: {
    height: '100%',
    backgroundColor: '#a855f7',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 36,
  },
  sliderLabelText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94a3b8',
  },
  milestonesCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  milestonesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(168,85,247,0.2)',
    gap: 16,
  },
  timelineItem: {
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: -26,
    top: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotActive: {
    backgroundColor: '#a855f7',
  },
  timelineDotInactive: {
    backgroundColor: '#e2e8f0',
  },
  timelineContent: {
    paddingLeft: 8,
  },
  timelineItemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineItemDetail: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 2,
  },
});
