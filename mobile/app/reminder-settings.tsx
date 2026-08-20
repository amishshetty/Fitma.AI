import React, { useState } from 'react';
import { green, muted, softGreen, ink } from '../constants';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Text as RNText, Alert } from 'react-native';
import { Check, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const ScreenShell = ({ title, subtitle, onBack, children, footer }: any) => (
  <View style={shellStyles.container}>
    <View style={shellStyles.header}>
      <Pressable onPress={onBack} style={shellStyles.backButton}>
        <ArrowLeft size={24} color="#000" />
      </Pressable>
      <View>
        <Text style={shellStyles.title}>{title}</Text>
        <Text style={shellStyles.subtitle}>{subtitle}</Text>
      </View>
    </View>
    <ScrollView style={shellStyles.scroll} contentContainerStyle={shellStyles.scrollContent}>
      {children}
    </ScrollView>
    {footer && <View style={shellStyles.footer}>{footer}</View>}
  </View>
);

const shellStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  header: { paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#000' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 48 },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#f1f5f9', backgroundColor: '#fff' }
});

export default function ReminderSettingsScreen() {
  const router = useRouter();

  const [aiEnabled, setAiEnabled] = useState(true);
  const [frequency, setFrequency] = useState('balanced');
  const [silentStart, setSilentStart] = useState('22:00');
  const [silentEnd, setSilentEnd] = useState('07:00');
  const [travelMode, setTravelMode] = useState(false);
  const [categories, setCategories] = useState({
    meals: true, water: true, protein: true, weekly: true, weight: true, habits: true
  });

  const green = '#34C759';
  const muted = '#64748b';

  return (
    <View style={styles.root}>
      <ScreenShell 
        title="Smart Reminders" 
        subtitle="Reminders adapt dynamically based on your daily schedule." 
        onBack={() => router.back()}
        footer={
          <View style={{ gap: 12 }}>
            <PrimaryButton onPress={() => Alert.alert('Preview Reminders')}>Preview Liva Reminders</PrimaryButton>
            <SecondaryButton onPress={() => Alert.alert('Push notifications setup required')}>Subscribe to AI Backend</SecondaryButton>
            <SecondaryButton onPress={() => router.back()}>Save Preferences</SecondaryButton>
          </View>
        }
      >
        <View style={styles.content}>
          {/* Master AI Toggle Switch */}
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Enable AI Reminders</Text>
                <Text style={styles.toggleSubtitle}>Allow Liva to optimize trigger timing</Text>
              </View>
              <Pressable
                onPress={() => setAiEnabled(!aiEnabled)}
                style={[styles.toggleSwitch, { backgroundColor: aiEnabled ? green : '#e2e8f0', alignItems: aiEnabled ? 'flex-end' : 'flex-start' }]}
              >
                <View style={styles.toggleThumb} />
              </Pressable>
            </View>
          </View>

          {aiEnabled && (
            <>
              {/* Reminder Category checkboxes */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>ENABLED CATEGORIES</Text>
                {[
                  { key: 'meals', label: 'Meal Reminders', desc: 'Adaptive meal timing logs' },
                  { key: 'water', label: 'Water Hydration logs', desc: 'Adaptive glass indicators' },
                  { key: 'protein', label: 'Protein Targets', desc: 'Alerts when macros fall behind' },
                  { key: 'weekly', label: 'Weekly Reports', desc: 'Weekly health summaries' },
                  { key: 'weight', label: 'Weight Check-ins', desc: 'Goal progression checkups' },
                ].map((cat, index, arr) => (
                  <Pressable
                    key={cat.key}
                    onPress={() => setCategories({ ...categories, [cat.key]: !(categories as any)[cat.key] })}
                    style={[styles.checkboxRow, index === arr.length - 1 && styles.checkboxRowLast]}
                  >
                    <View style={styles.checkboxTextContainer}>
                      <Text style={styles.checkboxLabel}>{cat.label}</Text>
                      <Text style={styles.checkboxDesc}>{cat.desc}</Text>
                    </View>
                    <View style={[styles.checkboxIconBox, { backgroundColor: (categories as any)[cat.key] ? green : 'transparent', borderColor: (categories as any)[cat.key] ? green : '#f1f5f9' }]}>
                      {(categories as any)[cat.key] && <Check size={12} color="#fff" />}
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Frequency selector */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>REMINDERS FREQUENCY</Text>
                <View style={styles.frequencyContainer}>
                  {[
                    { key: 'minimal', label: 'Minimal' },
                    { key: 'balanced', label: 'Balanced' },
                    { key: 'frequent', label: 'Frequent' },
                  ].map((freq) => (
                    <Pressable
                      key={freq.key}
                      onPress={() => setFrequency(freq.key)}
                      style={[styles.frequencyButton, { backgroundColor: frequency === freq.key ? green : 'transparent' }]}
                    >
                      <Text style={[styles.frequencyText, { color: frequency === freq.key ? '#fff' : muted }]}>{freq.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Silent hours */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>QUIET HOURS</Text>
                <View style={styles.timeGrid}>
                  <View style={styles.timeInputContainer}>
                    <Text style={styles.timeLabel}>Quiet Start</Text>
                    <TextInput style={styles.timeInput} value={silentStart} onChangeText={setSilentStart} />
                  </View>
                  <View style={styles.timeInputContainer}>
                    <Text style={styles.timeLabel}>Quiet End</Text>
                    <TextInput style={styles.timeInput} value={silentEnd} onChangeText={setSilentEnd} />
                  </View>
                </View>
              </View>

              {/* Travel Mode Toggle */}
              <View style={styles.card}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleTextContainer}>
                    <Text style={styles.toggleTitle}>Travel Mode</Text>
                    <Text style={styles.toggleSubtitle}>Reduces frequency & adjusts time zone</Text>
                  </View>
                  <Pressable
                    onPress={() => setTravelMode(!travelMode)}
                    style={[styles.toggleSwitch, { backgroundColor: travelMode ? green : '#e2e8f0', alignItems: travelMode ? 'flex-end' : 'flex-start' }]}
                  >
                    <View style={styles.toggleThumb} />
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </View>
      </ScreenShell>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff' },
  content: { gap: 20 },
  card: { borderRadius: 24, backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#10201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 18, elevation: 2 },
  cardTitle: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 },
  
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleTextContainer: { flex: 1 },
  toggleTitle: { fontSize: 14, fontWeight: '700', color: '#000' },
  toggleSubtitle: { fontSize: 10, fontWeight: '600', color: '#64748b', marginTop: 2 },
  toggleSwitch: { width: 48, height: 26, borderRadius: 13, padding: 2, justifyContent: 'center' },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  checkboxRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  checkboxTextContainer: { flex: 1 },
  checkboxLabel: { fontSize: 12, fontWeight: '700', color: '#000' },
  checkboxDesc: { fontSize: 9, color: '#64748b', marginTop: 2 },
  checkboxIconBox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  frequencyContainer: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 4, borderRadius: 16 },
  frequencyButton: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  frequencyText: { fontSize: 12, fontWeight: '700' },

  timeGrid: { flexDirection: 'row', gap: 12 },
  timeInputContainer: { flex: 1 },
  timeLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8 },
  timeInput: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, fontSize: 14, fontWeight: '700', color: '#64748b' }
});

