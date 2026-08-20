import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import LivaAvatar from '../components/layout/LivaAvatar';
import PrimaryButton from '../components/ui/PrimaryButton';
import ProgressDots from '../components/ui/ProgressDots';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function MeetLivaScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <LivaAvatar size={144} floating />
        <View style={styles.card}>
          <Text style={styles.title}>Hi, I'm Liva.</Text>
          <Text style={styles.subtitle}>
            I help you log meals quickly, estimate nutrition, and make small
            choices that add up.
          </Text>
        </View>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Your AI companion</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <PrimaryButton onPress={() => router.push('/goals')}>Continue</PrimaryButton>
        <ProgressDots total={5} current={2} />
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: 'rgba(16,32,26,0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b',
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#64748b',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 8,
    gap: 16,
  },
});
