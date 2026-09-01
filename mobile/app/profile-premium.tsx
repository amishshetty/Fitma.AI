import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text as RNText, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../components/ui/PrimaryButton';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProfilePremiumScreen() {
  const router = useRouter();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PREMIUM ACCESS</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.closeBtn}>Close</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.emoji}>👑</Text>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Fitma Premium</Text>
            <Text style={styles.subtitle}>
              Unlock the ultimate AI nutrition coach. Limitless tracking, forecasts, and medical audit files.
            </Text>
          </View>

          <View style={styles.benefits}>
            <View style={styles.benefitRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Unlimited AI Plate Scanning & Voice Log</Text>
            </View>
            <View style={styles.benefitRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Comprehensive Blood Report Analysis</Text>
            </View>
            <View style={styles.benefitRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Custom Grocery Lists & Restaurant Search</Text>
            </View>
          </View>

          <View style={styles.toggleContainer}>
            <Pressable
              style={[
                styles.planCard,
                billing === 'monthly' && styles.planCardActive
              ]}
              onPress={() => setBilling('monthly')}
            >
              <Text style={styles.planLabel}>MONTHLY</Text>
              <Text style={styles.planPrice}>
                $9.99<Text style={styles.planPricePeriod}>/mo</Text>
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.planCard,
                billing === 'yearly' && styles.planCardActive
              ]}
              onPress={() => setBilling('yearly')}
            >
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
              <Text style={styles.planLabel}>YEARLY</Text>
              <Text style={styles.planPrice}>
                $59.99<Text style={styles.planPricePeriod}>/yr</Text>
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton onPress={() => router.back()}>Upgrade Now</PrimaryButton>
          <Text style={styles.disclaimer}>Auto-renews. Cancel anytime in App Store.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#10201a' },
  container: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, paddingHorizontal: 24, paddingVertical: 40, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  headerTitle: { fontSize: 12, fontWeight: '900', color: '#6d8779', letterSpacing: 2 },
  closeBtn: { fontSize: 12, fontWeight: 'bold', color: '#f43f5e' },
  
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', maxWidth: 290, alignSelf: 'center', gap: 24 },
  emoji: { fontSize: 48, textAlign: 'center' },
  titleContainer: { alignItems: 'center' },
  title: { fontSize: 30, fontWeight: '900', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 12, color: '#9bb2a5', textAlign: 'center', marginTop: 8, lineHeight: 18 },
  
  benefits: { width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 8 },
  benefitRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  checkmark: { color: '#34c759', fontSize: 14, fontWeight: 'bold' },
  benefitText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  
  toggleContainer: { flexDirection: 'row', gap: 12, width: '100%' },
  planCard: { flex: 1, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'transparent', position: 'relative' },
  planCardActive: { borderColor: '#34c759', backgroundColor: 'rgba(52,199,89,0.08)' },
  planLabel: { fontSize: 9, fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' },
  planPrice: { fontSize: 14, fontWeight: '900', color: '#fff', marginTop: 4 },
  planPricePeriod: { fontSize: 10, fontWeight: 'normal', color: 'rgba(255,255,255,0.5)' },
  bestValueBadge: { position: 'absolute', top: -10, right: 8, backgroundColor: '#34c759', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  bestValueText: { color: '#fff', fontSize: 7, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  footer: { gap: 12, paddingBottom: 16 },
  disclaimer: { fontSize: 8, color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontWeight: '500' },
});
