import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text as RNText } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProfileHomeScreen() {
  const router = useRouter();
  
  // Mock data to match the web props
  const userWeight = 70;
  const goals = { weight: 65, calories: 2000, protein: 150 };
  const userName = 'User';
  const caloriesLogged = 1500;
  const waterLogged = 1500;
  
  const getHealthScore = () => 80;
  const getGreeting = () => 'Good day';

  const menuItems = [
    { label: 'Personal Information', screen: 'profile-personal', desc: 'Edit name, email, phone' },
    { label: 'Health Profile', screen: 'profile-health', desc: 'Lifestyle, allergies, dietary constraints' },
    { label: 'Goals Manager', screen: 'profile-goals', desc: 'Configure nutrition and targets' },
    { label: 'AI Personalization (Liva)', screen: 'profile-liva', desc: 'What Liva knows & memory timeline' },
    { label: 'Privacy & Security', screen: 'profile-privacy', desc: 'Biometrics and data memory control' },
    { label: 'Help & Support FAQs', screen: 'profile-help', desc: 'Contact support and rate app' },
    { label: 'General Settings', screen: 'reminder-settings', desc: 'Accessibility text, theme, units' },
    { label: 'Connected Devices (Coming Soon)', screen: 'profile-devices', desc: 'Sync Apple Watch & Garmin logs', disabled: true },
    { label: 'Premium Upgrade', screen: 'profile-premium', desc: 'View plan details and benefits', disabled: true },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <View style={styles.headerContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{getGreeting()}, {userName} 👋</Text>
            <Text style={styles.headerSubtitle}>Your health journey is improving every day.</Text>
          </View>
        </View>

        {/* Health Score Card */}
        <View style={styles.healthScoreCard}>
          <View style={styles.healthScoreLeft}>
            <Text style={styles.healthScoreLabel}>HEALTH SCORE</Text>
            <Text style={styles.healthScoreValue}>
              {getHealthScore()}
              <Text style={styles.healthScoreValueMax}> / 100</Text>
            </Text>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>Excellent Progress</Text>
            </View>
          </View>
          <View style={styles.healthScoreRight}>
            <Text style={styles.trendText}>↑ +4 this week</Text>
            <Text style={styles.trendLabel}>Vs last 14 days</Text>
          </View>
        </View>

        {/* Stats Passport Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>WEIGHT</Text>
            <Text style={styles.statValue}>{userWeight} kg</Text>
            <Text style={styles.statTarget}>Target: {goals.weight}kg</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>CALORIES</Text>
            <Text style={styles.statValue}>{goals.calories} kcal</Text>
            <Text style={styles.statTarget}>Active limit</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PROTEIN</Text>
            <Text style={styles.statValue}>{goals.protein}g</Text>
            <Text style={styles.statTarget}>Macro target</Text>
          </View>
        </View>

        {/* Achievements badging display */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>RECENT BADGES</Text>
          <View style={styles.badgesRow}>
            {['🏆', '🥗', '💪', '⚡'].map((badge, idx) => (
              <View key={idx} style={styles.badgeBox}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Menu Actions */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>PASSPORT SUBMENUS</Text>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              disabled={item.disabled}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
                item.disabled && styles.menuItemDisabled
              ]}
              onPress={() => router.push(`/${item.screen}` as any)}
            >
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <Text style={styles.menuItemDesc}>{item.desc}</Text>
              </View>
              <ChevronRight size={16} color="#9bb2a5" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff', paddingTop: 48 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 96, gap: 24 },
  
  headerContainer: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#34C759', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4, borderWidth: 2, borderColor: '#fff' },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '900', textTransform: 'uppercase' },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#000' },
  headerSubtitle: { fontSize: 12, fontWeight: '600', color: '#64748b', marginTop: 2 },

  healthScoreCard: { borderRadius: 28, backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: 'rgba(52, 199, 89, 0.12)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#10201a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 24, elevation: 2 },
  healthScoreLeft: { gap: 4 },
  healthScoreLabel: { fontSize: 10, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  healthScoreValue: { fontSize: 30, fontWeight: '900', color: '#000' },
  healthScoreValueMax: { fontSize: 16, fontWeight: '600', color: '#64748b' },
  progressBadge: { backgroundColor: '#f2faf5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, alignSelf: 'flex-start', marginTop: 4 },
  progressBadgeText: { fontSize: 10, fontWeight: '700', color: '#197a38' },
  healthScoreRight: { alignItems: 'flex-end' },
  trendText: { fontSize: 12, fontWeight: '800', color: '#34C759' },
  trendLabel: { fontSize: 9, fontWeight: '500', color: '#64748b', marginTop: 2 },

  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, borderRadius: 16, backgroundColor: '#fff', padding: 12, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#10201a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 12, elevation: 1 },
  statLabel: { fontSize: 9, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 12, fontWeight: '900', color: '#000', marginTop: 8 },
  statTarget: { fontSize: 8, color: '#64748b', marginTop: 2 },

  achievementsContainer: {},
  achievementsTitle: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  badgesRow: { flexDirection: 'row', gap: 8 },
  badgeBox: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  badgeText: { fontSize: 18 },

  menuContainer: { borderRadius: 28, backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#10201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 18, elevation: 2, marginBottom: 24 },
  menuTitle: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuItemLast: { borderBottomWidth: 0 },
  menuItemDisabled: { opacity: 0.4 },
  menuItemTextContainer: { flex: 1 },
  menuItemLabel: { fontSize: 12, fontWeight: '700', color: '#000' },
  menuItemDesc: { fontSize: 9, color: '#64748b', marginTop: 2 },
});
