import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text as RNText } from 'react-native';
import { ink, green } from '../constants';
import Svg, { Path, Circle } from 'react-native-svg';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProgressMonthlyScreen({
  onBack = () => {},
  loggedMeals = [],
  goals = { calories: 1800, protein: 100 },
}: any) {
  const stats = useMemo(() => {
    const now = new Date();
    // Start of the month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let sumCalories = 0;
    let sumProtein = 0;
    let daysWithFood = new Set();

    // Food frequencies
    const foodCounts: Record<string, number> = {};

    loggedMeals.forEach((meal: any) => {
      const mealDate = new Date(parseInt(meal.id));
      if (mealDate >= startOfMonth) {
        sumCalories += meal.calories || 0;
        sumProtein += meal.protein || 0;
        daysWithFood.add(mealDate.toDateString());

        if (meal.foodName) {
          foodCounts[meal.foodName] = (foodCounts[meal.foodName] || 0) + 1;
        }
      }
    });

    const daysLogged = daysWithFood.size;
    const avgCalories =
      daysLogged > 0 ? Math.round(sumCalories / daysLogged) : 0;
    const avgProtein = daysLogged > 0 ? Math.round(sumProtein / daysLogged) : 0;

    // Top foods
    const topFoods = Object.entries(foodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count: `${count} times logged` }));

    // If no data, use some fallback
    if (topFoods.length === 0) {
      topFoods.push({ name: 'No foods logged yet', count: '-' });
    }

    return {
      avgCalories,
      avgProtein,
      healthyDays: daysLogged,
      topFoods,
    };
  }, [loggedMeals]);

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Monthly Trends</Text>
          <Text style={styles.subtitle}>You've improved your consistency by 18% compared to last month.</Text>
        </View>

        {/* Weight Trend Line Chart */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Weight Journey Trend</Text>
            <Text style={styles.cardHeaderValue}>-1.2 kg this month</Text>
          </View>
          
          <View style={styles.svgContainer}>
            <Svg viewBox="0 0 200 80" style={styles.svg}>
              <Path
                d="M 10 70 L 40 66 L 80 62 L 120 58 L 160 55 L 190 52"
                fill="none"
                stroke={green}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {[70, 66, 62, 58, 55, 52].map((y, idx) => (
                <Circle
                  key={idx}
                  cx={10 + idx * 36}
                  cy={y}
                  r="4.5"
                  fill="white"
                  stroke={green}
                  strokeWidth="2.5"
                />
              ))}
            </Svg>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabelText}>Week 1</Text>
              <Text style={styles.chartLabelText}>Week 2</Text>
              <Text style={styles.chartLabelText}>Week 3</Text>
              <Text style={styles.chartLabelText}>Week 4</Text>
            </View>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.grid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Average Calorie</Text>
            <Text style={[styles.metricValue, { color: ink }]}>
              {stats.avgCalories.toLocaleString()} kcal
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Protein Average</Text>
            <Text style={[styles.metricValue, { color: '#0EA5E9' }]}>
              {stats.avgProtein}g / day
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Water Average</Text>
            <Text style={[styles.metricValue, { color: '#00c4b0' }]}>
              1.2 L / day
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Logged Days</Text>
            <Text style={[styles.metricValue, { color: '#34C759' }]}>
              {stats.healthyDays} days
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Meal Consistency</Text>
            <Text style={[styles.metricValue, { color: ink }]}>
              86%
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Skipped Breakfasts</Text>
            <Text style={[styles.metricValue, { color: '#f43f5e' }]}>
              3 days
            </Text>
          </View>
        </View>

        {/* Favorite Foods Card */}
        <View style={styles.foodsCard}>
          <Text style={styles.foodsTitle}>Favorite Foods</Text>
          <View>
            {stats.topFoods.map((food, idx) => (
              <View
                key={idx}
                style={[
                  styles.foodRow,
                  idx === stats.topFoods.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
                ]}
              >
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodCount}>{food.count}</Text>
              </View>
            ))}
          </View>
        </View>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardHeaderValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f43f5e',
  },
  svgContainer: {
    width: '100%',
    height: 112,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabelText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#94a3b8',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  foodsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  foodsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(241,245,249,0.5)',
  },
  foodName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ink,
  },
  foodCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
});
