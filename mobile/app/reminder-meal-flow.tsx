import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text as RNText } from 'react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ReminderMealFlowScreen({
  onBack,
  onLogCalories,
  userName = 'User',
}: {
  onBack?: () => void;
  onLogCalories?: (kcal: number) => void;
  userName?: string;
}) {
  const [response, setResponse] = useState<string | null>(null);

  const handleSelection = (choice: 'yes' | 'not_yet' | 'skip') => {
    if (choice === 'yes') {
      onLogCalories?.(610);
      setResponse(
        "Liva Coach: Awesome! I've logged your average lunch (610 kcal) onto your calories dashboard. Total calorie deficit is updated."
      );
    } else if (choice === 'not_yet') {
      setResponse(
        'Liva Coach: Understood! Take your time. I will remind you again in 45 minutes to keep digestion targets stable.'
      );
    } else {
      setResponse(
        "Liva Coach: Alright! Skip day recorded. Try adjusting dinner protein limits to balance today's macro splits."
      );
    }
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Adaptive Meal Check</Text>
        <Text style={styles.subtitle}>Context detection shows you haven't logged lunch yet.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>🤖</Text>
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.questionText}>Have you had lunch?</Text>
            <Text style={styles.descriptionText}>
              Hi {userName} 👋 You usually have lunch around 1 PM, but I haven't seen a meal today.
            </Text>
          </View>

          {response ? (
            <View style={styles.responseContainer}>
              <Text style={styles.responseText}>{response}</Text>
            </View>
          ) : (
            <View style={styles.buttonsContainer}>
              <Pressable style={styles.primaryButton} onPress={() => handleSelection('yes')}>
                <Text style={styles.primaryButtonText}>Yes, Log Standard Meal (610 kcal)</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => handleSelection('not_yet')}>
                <Text style={styles.secondaryButtonText}>Not Yet (Remind me in 45 mins)</Text>
              </Pressable>
              <Pressable style={styles.skipButton} onPress={() => handleSelection('skip')}>
                <Text style={styles.skipButtonText}>Skip Today's Lunch</Text>
              </Pressable>
            </View>
          )}
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
  header: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
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
    maxWidth: 320,
    alignSelf: 'center',
    width: '100%',
  },
  avatarContainer: {
    marginBottom: 24,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarText: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
  responseContainer: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f2faf5',
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.16)',
    width: '100%',
  },
  responseText: {
    fontSize: 12,
    color: '#197a38',
    lineHeight: 18,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    paddingTop: 16,
  },
  primaryButton: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
