import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text as RNText } from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import QuantityStepper from '../components/ui/QuantityStepper';
import ScreenShell from '../components/layout/ScreenShell';
import { mealItems } from '../constants';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function PortionSelectionScreen({
  onBack,
  onContinue,
}: any) {
  const [quantities, setQuantities] = useState([2, 1, 1]);
  const items = mealItems || [
    { name: 'Paneer Paratha', calories: 310 },
    { name: 'Chicken Biryani', calories: 520 },
    { name: 'Dal Rice', calories: 390 }
  ];

  const calories = items.reduce(
    (sum: number, item: any, index: number) => sum + item.calories * (quantities[index] || 1),
    0
  );

  return (
    <View style={styles.container}>
      <ScreenShell
        title="Portion Selection"
        subtitle="Fine tune portions before saving."
        onBack={onBack}
        footer={
          <View style={styles.footerContainer}>
            <View style={styles.liveCaloriesCard}>
              <Text style={styles.liveCaloriesLabel}>Live calories</Text>
              <Text style={styles.liveCaloriesValue}>{calories} kcal</Text>
            </View>
            <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
          </View>
        }
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          {items.map((item: any, index: number) => (
            <View key={item.name} style={styles.foodCard}>
              <View style={styles.foodCardHeader}>
                <View>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodCalories}>
                    {item.calories * (quantities[index] || 1)} kcal
                  </Text>
                </View>
                <QuantityStepper
                  value={quantities[index] || 1}
                  onChange={(value: number) =>
                    setQuantities((previous) => {
                      const next = [...previous];
                      next[index] = value;
                      return next;
                    })
                  }
                />
              </View>
              <View style={styles.detailsGrid}>
                <Pressable style={styles.detailButton}>
                  <Text style={styles.detailLabel}>Portion size</Text>
                  <Text style={styles.detailValue}>Medium</Text>
                </Pressable>
                <Pressable style={styles.detailButton}>
                  <Text style={styles.detailLabel}>Weight</Text>
                  <Text style={styles.detailValue}>120 g</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScreenShell>
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
    gap: 12,
    paddingBottom: 20,
  },
  footerContainer: {
    gap: 12,
  },
  liveCaloriesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  liveCaloriesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  liveCaloriesValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
  },
  foodCard: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
    marginBottom: 12,
  },
  foodCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  foodCalories: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  detailButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#f2faf5',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  detailValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  }
});
