import React from 'react';
import { View, StyleSheet, Pressable, ScrollView, Text as RNText } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import BottomNav from '../components/layout/BottomNav';
import ScreenShell from '../components/layout/ScreenShell';
import { quickOptions } from '../constants';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function QuickLogScreen({
  onSelect,
  onBack,
  onNavigate,
}: any) {
  return (
    <View style={styles.container}>
      <ScreenShell
        title="Log Your Meal"
        subtitle="Choose the easiest way."
        onBack={onBack}
      >
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {quickOptions?.map((option: any) => {
            const Icon = option.icon;
            return (
              <Pressable
                key={option.title}
                onPress={() => onSelect?.(option.mode)}
                style={({ pressed }) => [
                  styles.optionButton,
                  pressed && { transform: [{ scale: 0.98 }] }
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: option.bg }]}>
                  <Icon size={30} color={option.tint} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <ChevronRight size={20} color="#64748B" />
              </Pressable>
            );
          })}
          
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Meals</Text>
            <View style={styles.grid}>
              {[
                'Paneer Paratha',
                'Chicken Biryani',
                'Dal Rice',
                'Oats Breakfast',
              ].map((meal) => (
                <Pressable key={meal} style={styles.mealButton}>
                  <Text style={styles.mealText}>{meal}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScreenShell>
      <BottomNav active="log" onNavigate={onNavigate} />
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
    backgroundColor: '#ffffff'
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  iconContainer: {
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    overflow: 'hidden',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  optionDescription: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b',
  },
  recentSection: {
    paddingTop: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mealButton: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: '48%',
  },
  mealText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  }
});
