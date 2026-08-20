import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text as RNText } from 'react-native';
import { Clock, Calendar, Droplets, Utensils, Coffee, Droplet } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

type Screen = string;

export default function ReminderPreviewScreen({
  onBack,
  onNavigate,
  userName = 'Amish',
}: {
  onBack?: () => void;
  onNavigate?: (screen: Screen) => void;
  userName?: string;
}) {
  const firstName = userName.split(' ')[0];

  const previews = [
    {
      reason: 'WORKING LATE',
      time: '8:42 PM',
      tagColor: '#F59E0B',
      tagBg: '#FEF3C7',
      tagIcon: Clock,
      text: `Working late? Don't forget to log your dinner.`,
      actionLabel: 'Log Dinner',
      actionIcon: Utensils,
      screen: 'reminder-meal-flow',
    },
    {
      reason: 'MISSED ROUTINE',
      time: '9:15 AM',
      tagColor: '#3B82F6',
      tagBg: '#DBEAFE',
      tagIcon: Calendar,
      text: `Skipped breakfast again, ${firstName}? Keep a routine for better metabolism.`,
      actionLabel: 'Log Breakfast',
      actionIcon: Coffee,
      screen: 'quick-log',
    },
    {
      reason: 'HYDRATION CHECK',
      time: '3:00 PM',
      tagColor: '#06B6D4',
      tagBg: '#CFFAFE',
      tagIcon: Droplet,
      text: `You drank 1.3L yesterday. Aim for 2.5L today!`,
      actionLabel: 'Log Water',
      actionIcon: Droplets,
      screen: 'reminder-hydration',
    },
  ];

  return (
    <View style={styles.rootContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>How Liva Reminds You</Text>
        <Text style={styles.subtitle}>Smart nudges, not noise.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro text */}
        <View style={styles.introCard}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarMiniText}>🤖</Text>
          </View>
          <Text style={styles.introText}>
            Liva sends <Text style={styles.highlightText}>contextual nudges</Text> based on your patterns — designed to support, not interrupt.
          </Text>
        </View>

        {previews.map((pre, idx) => {
          const TagIcon = pre.tagIcon;
          const ActionIcon = pre.actionIcon;

          return (
            <Pressable
              key={idx}
              style={styles.previewCard}
              onPress={() => onNavigate?.(pre.screen)}
            >
              {/* Top Row */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.avatarMicro}>
                    <Text style={styles.avatarMicroText}>🤖</Text>
                  </View>
                  <Text style={styles.livaText}>Liva</Text>
                </View>
                <View style={styles.cardHeaderRight}>
                  <View style={[styles.tagContainer, { backgroundColor: pre.tagBg }]}>
                    <TagIcon size={10} color={pre.tagColor} strokeWidth={2.5} />
                    <Text style={[styles.tagText, { color: pre.tagColor }]}>{pre.reason}</Text>
                  </View>
                  <Text style={styles.timeText}>{pre.time}</Text>
                </View>
              </View>

              {/* Body text */}
              <Text style={styles.bodyText}>{pre.text}</Text>

              {/* Footer Buttons */}
              <View style={styles.cardFooter}>
                <Pressable style={styles.dismissButton}>
                  <Text style={styles.dismissText}>Dismiss</Text>
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => onNavigate?.(pre.screen)}
                >
                  <ActionIcon size={14} color="#ffffff" strokeWidth={2.5} />
                  <Text style={styles.actionButtonText}>{pre.actionLabel} {'→'}</Text>
                </Pressable>
              </View>
            </Pressable>
          );
        })}
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
    gap: 16,
  },
  introCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
    marginBottom: 8,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 16,
  },
  introText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: '#64748b',
  },
  highlightText: {
    color: '#34C759',
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarMicro: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMicroText: {
    fontSize: 12,
  },
  livaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#34C759',
    letterSpacing: -0.5,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  bodyText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
    color: '#0f172a',
    paddingLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dismissButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
  },
  dismissText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});
