import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, LogOut, ShieldCheck, Mail, Smartphone, Edit2 } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import LivaAvatar from '../../components/layout/LivaAvatar';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProfileHomeScreen() {
  const router = useRouter();
  
  const userName = useAppStore((state) => state.userName);
  const goals = useAppStore((state) => state.goals);
  const logout = useAppStore((state) => state.logout);
  const caloriesLogged = useAppStore((state) => state.caloriesLogged);
  const waterLogged = useAppStore((state) => state.waterLogged);

  const getHealthScore = () => 85; // Mock logic, normally calculates based on adherence
  const userWeight = 75.4;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      router.replace('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const menuItems = [
    {
      label: 'Personal Information',
      route: '/profile-personal',
      desc: 'Edit name, email, phone',
    },
    {
      label: 'Health Profile',
      route: '/profile-health',
      desc: 'Lifestyle, allergies, dietary constraints',
    },
    {
      label: 'Goals Manager',
      route: '/profile-goals',
      desc: 'Configure nutrition and targets',
    },
    {
      label: 'AI Personalization (Liva)',
      route: '/profile-liva',
      desc: 'What Liva knows & memory timeline',
    },
    {
      label: 'Privacy & Security',
      route: '/profile-privacy',
      desc: 'Biometrics and data memory control',
    },
    {
      label: 'Help & Support FAQs',
      route: '/profile-help',
      desc: 'Contact support and rate app',
    },
    {
      label: 'General Settings',
      route: '/profile-settings',
      desc: 'Accessibility text, theme, units',
    },
    {
      label: 'Connected Devices',
      route: null,
      desc: 'Sync Apple Watch & Garmin logs (Coming Soon)',
      disabled: true,
    },
    {
      label: 'Premium Upgrade',
      route: null,
      desc: 'View plan details and benefits (Coming Soon)',
      disabled: true,
    },
  ];

  const score = getHealthScore();
  let bgClass = '#e0f2fe';
  let textClass = '#0EA5E9';
  let label = 'Good Progress';

  if (score >= 76) {
    bgClass = '#f2faf5';
    textClass = '#197a38';
    label = 'Excellent Progress';
  } else if (score < 51) {
    bgClass = '#fff7ed';
    textClass = '#ea580c';
    label = 'Needs Attention';
  }

  return (
    <View style={styles.rootContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Liva Passport</Text>
          <Text style={styles.headerSubtitle}>Manage your profile, goals, and Liva settings</Text>
        </View>

        <View style={styles.profileHeaderCard}>
          <View style={styles.profileHeaderRow}>
            <LivaAvatar size={64} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userName}</Text>
              <Text style={styles.profileJoined}>Joined 2026 • Fitma Pro User</Text>
            </View>
            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={16} color="#ef4444" />
            </Pressable>
          </View>
          
          <Pressable style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit Public Profile</Text>
          </Pressable>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <ShieldCheck size={16} color="#10201a" />
            <Text style={styles.scoreTitle}>Health Passport Score</Text>
          </View>
          <View style={styles.scoreBodyRow}>
            <View style={styles.scoreLeft}>
              <Text style={styles.scoreValue}>{score}</Text>
              <Text style={styles.scoreMax}>/ 100</Text>
              <View style={[styles.scoreBadge, { backgroundColor: bgClass }]}>
                <Text style={[styles.scoreBadgeText, { color: textClass }]}>{label}</Text>
              </View>
            </View>
            <View style={styles.scoreRight}>
              <Text style={styles.scoreTrendPos}>+4 this week</Text>
              <Text style={styles.scoreTrendContext}>Vs last 14 days</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Weight</Text>
            <Text style={styles.statVal}>{userWeight} kg</Text>
            <Text style={styles.statContext}>Target: 70kg</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statVal}>{goals.calories} kcal</Text>
            <Text style={styles.statContext}>Active limit</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Protein</Text>
            <Text style={styles.statVal}>{goals.protein}g</Text>
            <Text style={styles.statContext}>Macro target</Text>
          </View>
        </View>

        <View style={styles.badgesSection}>
          <Text style={styles.sectionHeading}>Recent Badges</Text>
          <View style={styles.badgesRow}>
            {['🔥', '🏃', '🥗', '💧'].map((badge, idx) => (
              <View key={idx} style={styles.badgeBox}>
                <Text style={styles.badgeEmoji}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.menuCard}>
          <Text style={styles.sectionHeading}>Passport Submenus</Text>
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <Pressable 
                key={item.label} 
                style={[
                  styles.menuItem, 
                  item.disabled && styles.menuItemDisabled,
                  index === menuItems.length - 1 && styles.menuItemLast
                ]}
                onPress={() => {
                  if (!item.disabled && item.route) {
                    router.push(item.route as any);
                  }
                }}
              >
                <View style={styles.menuItemTextCol}>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                  <Text style={styles.menuItemDesc}>{item.desc}</Text>
                </View>
                <ChevronRight size={16} color="#cbd5e1" />
              </Pressable>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
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
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
  },
  profileHeaderCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  profileJoined: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  editProfileBtn: {
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#10201a',
    textTransform: 'uppercase',
  },
  scoreBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000',
  },
  scoreMax: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginLeft: 4,
  },
  scoreBadge: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  scoreRight: {
    alignItems: 'flex-end',
  },
  scoreTrendPos: {
    fontSize: 12,
    fontWeight: '900',
    color: '#34C759',
  },
  scoreTrendContext: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    marginTop: 8,
  },
  statContext: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 4,
  },
  badgesSection: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  badgeBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  badgeEmoji: {
    fontSize: 20,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemDisabled: {
    opacity: 0.4,
  },
  menuItemTextCol: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  menuItemDesc: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
});
