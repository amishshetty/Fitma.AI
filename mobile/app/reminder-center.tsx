import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text as RNText } from 'react-native';
import { TrendingUp } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

type Screen = string;
type NotificationItem = {
  id: number;
  icon: string;
  category: string;
  time: string;
  text: string;
  read: boolean;
  screen?: Screen;
};

export default function ReminderCenterScreen({
  onBack,
  onNavigate,
}: {
  onBack?: () => void;
  onNavigate?: (screen: Screen) => void;
}) {
  const [activeTab, setActiveTab] = useState<'today' | 'earlier'>('today');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      icon: '🥗',
      category: 'Meal',
      time: '1:15 PM',
      text: 'You usually eat lunch around now. Have you had lunch today?',
      read: false,
      screen: 'reminder-meal-flow',
    },
    {
      id: 2,
      icon: '💧',
      category: 'Hydration',
      time: '11:00 AM',
      text: "You're only halfway to today's water goal.",
      read: false,
      screen: 'reminder-hydration',
    },
    {
      id: 3,
      icon: '💪',
      category: 'Protein',
      time: '9:30 AM',
      text: "Only 18g of protein left to reach today's target.",
      read: true,
      screen: 'progress-dashboard',
    },
    {
      id: 4,
      icon: '🎉',
      category: 'Achievement',
      time: 'Yesterday',
      text: "Congratulations! You've completed a 7-day logging streak.",
      read: true,
      screen: 'reminder-celebration',
    },
    {
      id: 5,
      icon: '📈',
      category: 'Weekly Report',
      time: 'Sunday',
      text: 'Your weekly nutrition report is ready.',
      read: true,
      screen: 'reminder-weekly-summary',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'today')
      return n.time.includes('PM') || n.time.includes('AM');
    return !n.time.includes('PM') && !n.time.includes('AM');
  });

  return (
    <View style={styles.rootContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Supportive coaching alerts from Liva.</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tab Selectors */}
        <View style={styles.tabsContainer}>
          <View style={[styles.tabIndicator, { left: activeTab === 'today' ? '0%' : '50%' }]} />
          <Pressable style={styles.tabButton} onPress={() => setActiveTab('today')}>
            <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>Today</Text>
          </Pressable>
          <Pressable style={styles.tabButton} onPress={() => setActiveTab('earlier')}>
            <Text style={[styles.tabText, activeTab === 'earlier' && styles.tabTextActive]}>Earlier</Text>
          </Pressable>
        </View>

        {/* Notifications Feed */}
        <View style={styles.feedContainer}>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  !item.read && styles.cardUnread,
                  item.read && styles.cardRead
                ]}
              >
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>{item.icon}</Text>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <Text style={styles.messageText}>{item.text}</Text>

                  <View style={styles.actionButtons}>
                    {item.screen && (
                      <Pressable
                        style={styles.actNowButton}
                        onPress={() => onNavigate?.(item.screen!)}
                      >
                        <Text style={styles.actNowText}>Act Now</Text>
                      </Pressable>
                    )}
                    <Pressable
                      style={styles.clearButton}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Text style={styles.clearText}>Clear</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No notifications in this folder.</Text>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.markReadButton} onPress={handleMarkAllRead}>
          <Text style={styles.markReadText}>Mark All Read</Text>
        </Pressable>
        <Pressable
          style={styles.smartRemindersButton}
          onPress={() => onNavigate?.('reminder-settings')}
        >
          <Text style={styles.smartRemindersText}>Smart{'\n'}Reminders</Text>
          <TrendingUp size={14} color="#fff" />
        </Pressable>
      </View>
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
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f4f9f6',
    padding: 4,
    borderRadius: 16,
    marginBottom: 24,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '50%',
    backgroundColor: '#34C759',
    borderRadius: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6d8779',
    textTransform: 'capitalize',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  feedContainer: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
    gap: 12,
  },
  cardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  cardRead: {
    opacity: 0.78,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  messageText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#0f172a',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actNowButton: {
    borderWidth: 1,
    borderColor: '#dcf4e6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actNowText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34C759',
  },
  clearButton: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  clearText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 40,
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingTop: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  markReadButton: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcf4e6',
  },
  markReadText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  smartRemindersButton: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  smartRemindersText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
});
