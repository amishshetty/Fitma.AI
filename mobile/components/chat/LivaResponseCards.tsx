import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Leaf, Lightbulb, ChevronRight } from 'lucide-react-native';

export const NutritionSummaryCard = ({ calories, protein, carbs, fat }) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  return (
    <View style={styles.summaryCard}>
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Cals</Text>
          <Text style={styles.gridValue}>{calories}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Pro</Text>
          <Text style={styles.gridValue}>{protein}g</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Carbs</Text>
          <Text style={styles.gridValue}>{carbs}g</Text>
        </View>
        <View style={[styles.gridItem, { borderRightWidth: 0 }]}>
          <Text style={styles.gridLabel}>Fat</Text>
          <Text style={styles.gridValue}>{fat}g</Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = (isDark) => StyleSheet.create({
  summaryCard: {
    width: '100%',
    marginTop: 8,
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#f1f5f9',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: isDark ? '#334155' : '#f1f5f9',
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  gridValue: {
    fontWeight: '900',
    fontSize: 13,
    color: isDark ? '#f8fafc' : '#0f172a',
  }
});
