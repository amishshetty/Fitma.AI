import React, { useState } from 'react';
import { View, StyleSheet, Text as RNText, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Flame, Target, Leaf, Wheat, Sparkles, Search } from 'lucide-react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import ProgressDots from '../components/ui/ProgressDots';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function GoalsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  const goals = [
    { label: 'Lose Weight', icon: Flame, color: '#fb923c' },
    { label: 'Gain Muscle', icon: Target, color: '#6366f1' },
    { label: 'Eat Healthier', icon: Leaf, color: '#34C759' },
    { label: 'Maintain Weight', icon: Wheat, color: '#06b6d4' },
    { label: 'Improve Energy', icon: Sparkles, color: '#f59e0b' },
    { label: 'Just Exploring', icon: Search, color: '#94a3b8' },
  ];

  const handleNext = () => {
    if (selected !== null) {
      router.push('/permissions');
    }
  };

  const handleSkip = () => {
    router.push('/permissions');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>What would you like to achieve?</Text>
          <Text style={styles.headerSubtitle}>
            Liva will personalize your experience based on your goal.
          </Text>
        </View>

        <View style={styles.grid}>
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            const active = selected === index;
            return (
              <Pressable
                key={goal.label}
                onPress={() => setSelected(index)}
                style={[
                  styles.goalButton,
                  {
                    borderColor: active ? goal.color : 'rgba(16,32,26,0.06)',
                    shadowColor: active ? goal.color : 'rgba(16,32,26,0.05)',
                    shadowOffset: { width: 0, height: active ? 8 : 4 },
                    shadowOpacity: active ? 0.24 : 1,
                    shadowRadius: active ? 20 : 14,
                    elevation: active ? 4 : 2,
                  }
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${goal.color}18` }]}>
                  <Icon size={23} color={goal.color} />
                </View>
                <Text style={[styles.goalLabel, { color: active ? goal.color : '#000000' }]}>
                  {goal.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton onPress={handleNext} disabled={selected === null}>
          Continue
        </PrimaryButton>
        <SecondaryButton onPress={handleSkip}>Skip for now</SecondaryButton>
        <ProgressDots total={5} current={3} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 32,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  goalButton: {
    width: '48%',
    minHeight: 128,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    padding: 16,
  },
  iconContainer: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 8,
    gap: 12,
  },
});
