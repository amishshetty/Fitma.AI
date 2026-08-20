import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text as RNText } from 'react-native';
import { ink, green } from '../constants';
import Svg, { Circle } from 'react-native-svg';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProgressNutritionScreen({
  onBack = () => {},
  loggedMeals = [],
  goals = { calories: 1800, protein: 100 },
}: any) {
  const { macros, nutrientBars, alerts } = useMemo(() => {
    let todayCarbs = 0;
    let todayProtein = 0;
    let todayFat = 0;
    let todayCalories = 0;
    let todayFiber = 0;
    let todaySodium = 0;

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);

    loggedMeals.forEach((m: any) => {
      const time = parseInt(m.id);
      if (time >= todayStart && time <= todayEnd) {
        todayCalories += m.calories || 0;
        todayProtein += m.protein || 0;
        todayCarbs += m.carbs || 0;
        todayFat += m.fat || 0;
        todayFiber += Math.round((m.carbs || 0) * 0.15);
        todaySodium += Math.round((m.calories || 0) * 0.8);
      }
    });

    const totalMacros = todayCarbs + todayProtein + todayFat;
    const carbPercent = totalMacros > 0 ? Math.round((todayCarbs / totalMacros) * 100) : 0;
    const proteinPercent = totalMacros > 0 ? Math.round((todayProtein / totalMacros) * 100) : 0;
    const fatPercent = totalMacros > 0 ? 100 - carbPercent - proteinPercent : 0;

    const macrosData = [
      {
        label: 'Carbs',
        value: `${todayCarbs}g`,
        percent: carbPercent,
        color: '#fb923c',
      },
      {
        label: 'Protein',
        value: `${todayProtein}g`,
        percent: proteinPercent,
        color: '#0EA5E9',
      },
      {
        label: 'Fat',
        value: `${todayFat}g`,
        percent: fatPercent,
        color: '#f59e0b',
      },
    ];

    const barsData = [
      {
        label: 'Calories',
        current: todayCalories,
        target: goals.calories || 2000,
        color: green,
        unit: 'kcal',
      },
      {
        label: 'Protein',
        current: todayProtein,
        target: goals.protein || 100,
        color: '#0ea5e9',
        unit: 'g',
      },
      {
        label: 'Fiber',
        current: todayFiber,
        target: 30,
        color: '#a855f7',
        unit: 'g',
      },
      {
        label: 'Sodium',
        current: todaySodium,
        target: 2000,
        color: '#fb923c',
        unit: 'mg',
      },
    ];

    const dynamicAlerts = [];
    if (todayFiber < 15 && todayCalories > 500) {
      dynamicAlerts.push(
        `⚠️ **Low Fiber**: You've logged only ${todayFiber}g of fiber (target: 30g). Try adding more veggies.`
      );
    }
    if (todaySodium > 2000) {
      dynamicAlerts.push(
        `⚠️ **High Sodium**: Sodium consumption is already at ${todaySodium}mg, exceeding your daily recommended limit.`
      );
    }
    if (dynamicAlerts.length === 0) {
      dynamicAlerts.push(
        `✅ **On Track**: Your nutrient balance looks great so far today!`
      );
    }

    return {
      macros: macrosData,
      nutrientBars: barsData,
      alerts: dynamicAlerts,
    };
  }, [loggedMeals, goals]);

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition Analytics</Text>
          <Text style={styles.subtitle}>Detailed breakdown of macro and micro goals.</Text>
        </View>

        {/* Macro Donut SVG Card */}
        <View style={styles.macroCard}>
          <View style={styles.donutContainer}>
            <View style={styles.svgWrapper}>
              <Svg viewBox="0 0 36 36" style={styles.svg}>
                <Circle cx="18" cy="18" r="15.91" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                {/* Carbs Arc */}
                <Circle
                  cx="18"
                  cy="18"
                  r="15.91"
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="3.5"
                  strokeDasharray={`${macros[0].percent} ${100 - macros[0].percent}`}
                  strokeDashoffset="0"
                />
                {/* Protein Arc */}
                <Circle
                  cx="18"
                  cy="18"
                  r="15.91"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="3.5"
                  strokeDasharray={`${macros[1].percent} ${100 - macros[1].percent}`}
                  strokeDashoffset={`-${macros[0].percent}`}
                />
                {/* Fat Arc */}
                <Circle
                  cx="18"
                  cy="18"
                  r="15.91"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeDasharray={`${macros[2].percent} ${100 - macros[2].percent}`}
                  strokeDashoffset={`-${macros[0].percent + macros[1].percent}`}
                />
              </Svg>
            </View>
            <View style={styles.donutCenter}>
              <Text style={styles.donutCenterTitle}>Macros</Text>
              <Text style={styles.donutCenterSubtitle}>Split</Text>
            </View>
          </View>

          <View style={styles.macrosList}>
            {macros.map((mac) => (
              <View key={mac.label} style={styles.macroLegendRow}>
                <View style={[styles.macroDot, { backgroundColor: mac.color }]} />
                <Text style={styles.macroLegendText}>
                  {mac.label}: {mac.value} ({mac.percent}%)
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Nutrient Gaps alerts */}
        <View style={styles.alertsCard}>
          <Text style={styles.alertsTitle}>Nutrient Alerts</Text>
          {alerts.map((alertText, idx) => {
            const isWarning = alertText.includes('⚠️');
            return (
              <Text key={idx} style={styles.alertText}>
                {alertText}
              </Text>
            );
          })}
        </View>

        {/* Daily Nutrient progress bars */}
        <View style={styles.targetsCard}>
          <Text style={styles.targetsTitle}>Nutrient Targets</Text>
          <View style={styles.barsContainer}>
            {nutrientBars.map((nut) => {
              const percent = Math.min(
                100,
                Math.round((nut.current / nut.target) * 100)
              );
              return (
                <View key={nut.label} style={styles.barItem}>
                  <View style={styles.barHeader}>
                    <Text style={styles.barLabel}>{nut.label}</Text>
                    <Text style={styles.barLabel}>
                      {nut.current} / {nut.target} {nut.unit}
                    </Text>
                  </View>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${percent}%`, backgroundColor: nut.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
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
  macroCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  donutContainer: {
    position: 'relative',
    height: 112,
    width: 112,
  },
  svgWrapper: {
    width: '100%',
    height: '100%',
    transform: [{ rotate: '-90deg' }],
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  donutCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: ink,
  },
  donutCenterSubtitle: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  macrosList: {
    gap: 8,
  },
  macroLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  macroDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  macroLegendText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ink,
  },
  alertsCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#fff8eb',
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.2)',
    marginBottom: 20,
  },
  alertsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#c2410c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  alertText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
    marginBottom: 8,
  },
  targetsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  targetsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  barsContainer: {
    gap: 12,
  },
  barItem: {
    marginBottom: 12,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ink,
  },
  barBg: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
