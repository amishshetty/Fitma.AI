import React from 'react';
import { View, Text as RNText, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Egg, Wheat, Droplets, Leaf } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function NutritionBreakdownScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={20} color="#10201a" />
        </Pressable>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Nutrition Breakdown</Text>
          <Text style={styles.subtitle}>A clean summary before you save.</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainCard}>
          <View style={styles.ringPlaceholder}>
            <Text style={styles.ringLabel}>today</Text>
          </View>
          <Text style={styles.caloriesText}>610</Text>
          <Text style={styles.caloriesLabel}>calories in this meal</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.nutritionCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#eef2ff' }]}>
              <Egg size={20} color="#6366f1" />
            </View>
            <View>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>22g</Text>
            </View>
          </View>
          <View style={styles.nutritionCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#fff7ed' }]}>
              <Wheat size={20} color="#fb923c" />
            </View>
            <View>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>115g</Text>
            </View>
          </View>
          <View style={styles.nutritionCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#fef3c7' }]}>
              <Droplets size={20} color="#f59e0b" />
            </View>
            <View>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>8g</Text>
            </View>
          </View>
          <View style={styles.nutritionCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#ecfbf1' }]}>
              <Leaf size={20} color="#34C759" />
            </View>
            <View>
              <Text style={styles.nutritionLabel}>Fiber</Text>
              <Text style={styles.nutritionValue}>11g</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.scoreCard}>
            <View style={[styles.smallRing, { borderColor: '#0EA5E9' }]}>
              <Text style={styles.smallRingText}>76%</Text>
            </View>
            <Text style={styles.scoreLabel}>Water balance</Text>
          </View>
          <View style={styles.scoreCard}>
            <View style={[styles.smallRing, { borderColor: '#34C759' }]}>
              <Text style={styles.smallRingText}>84%</Text>
            </View>
            <Text style={styles.scoreLabel}>Healthy score</Text>
          </View>
        </View>

        <View style={styles.aiInsight}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>✨</Text>
          </View>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiInsightTitle}>AI Insight</Text>
            <Text style={styles.aiInsightText}>
              Great protein intake. You may need more vegetables to balance this meal.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.primaryBtnText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10201a',
  },
  subtitle: {
    fontSize: 14,
    color: '#6d8779',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 20,
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 26,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ringPlaceholder: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 8,
    borderColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10201a',
    textTransform: 'uppercase',
  },
  caloriesText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10201a',
    marginTop: 16,
  },
  caloriesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6d8779',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6d8779',
    fontWeight: '600',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10201a',
  },
  scoreCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  smallRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallRingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10201a',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6d8779',
    marginTop: 12,
  },
  aiInsight: {
    flexDirection: 'row',
    backgroundColor: '#eefaf2',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.18)',
    gap: 12,
  },
  aiAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: {
    fontSize: 20,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiInsightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10201a',
  },
  aiInsightText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6d8779',
    marginTop: 4,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  primaryBtn: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
