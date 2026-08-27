import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Text as RNText } from 'react-native';
import { 
  ChevronLeft, ChevronDown, ChevronRight, 
  Sunrise, Sun, Moon, Coffee, Check, Flame, 
  Droplets, Activity
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function MyPlanScreen() {
  const [dateOffset, setDateOffset] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const goals = useAppStore(s => s.goals);
  const history = useAppStore(s => s.history);
  const logWater = useAppStore(s => s.logWater);
  
  // Date Logic
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + dateOffset);
  const targetDateString = new Date(targetDate.getTime() - targetDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const isToday = dateOffset === 0;
  const dateLabel = isToday ? 'Today' : targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Get data for the selected date from Firebase history
  const selectedData = history[targetDateString] || {};
  const selectedDateMeals: any[] = selectedData.meals ? Object.values(selectedData.meals) : [];

  // Aggregate calories per meal type
  let breakfastCal = 0, lunchCal = 0, dinnerCal = 0, snacksCal = 0;
  selectedDateMeals.forEach(m => {
    const type = (m.mealType || '').toLowerCase();
    if (type.includes('breakfast')) breakfastCal += m.calories || 0;
    else if (type.includes('lunch')) lunchCal += m.calories || 0;
    else if (type.includes('dinner')) dinnerCal += m.calories || 0;
    else snacksCal += m.calories || 0;
  });

  const displayCalories = breakfastCal + lunchCal + dinnerCal + snacksCal;
  const dailyGoalCal = goals.calories || 2000;
  const displayWater = selectedData.water || 0;
  const dailyGoalWater = goals.water || 2500;

  const mealSummary = [
    { label: 'BREAKFA...', cal: breakfastCal, icon: Sunrise, color: '#FF8B6B' },
    { label: 'LUNCH', cal: lunchCal, icon: Sun, color: '#FFD166' },
    { label: 'DINNER', cal: dinnerCal, icon: Moon, color: '#118AB2' },
    { label: 'SNACKS', cal: snacksCal, icon: Coffee, color: '#06D6A0' },
  ];

  // Calendar generation
  const calMonth = targetDate.getMonth();
  const calYear = targetDate.getFullYear();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  const calProgress = Math.min(1, displayCalories / dailyGoalCal);

  const getMealIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('breakfast')) return { Icon: Sunrise, color: '#FF8B6B' };
    if (t.includes('lunch')) return { Icon: Sun, color: '#FFD166' };
    if (t.includes('dinner')) return { Icon: Moon, color: '#118AB2' };
    return { Icon: Coffee, color: '#06D6A0' };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Plan</Text>
        </View>

        {/* Date Navigator */}
        <View style={styles.dateNav}>
          <Pressable style={styles.dateArrow} onPress={() => setDateOffset(d => d - 1)}>
            <ChevronLeft size={18} color="#64748b" />
          </Pressable>
          <Pressable style={styles.dateBtn} onPress={() => setIsCalendarOpen(!isCalendarOpen)}>
            <Text style={styles.dateLabel}>{dateLabel}</Text>
            <ChevronDown size={14} color="#10201a" />
          </Pressable>
          <Pressable 
            style={[styles.dateArrow, isToday && { opacity: 0.3 }]} 
            onPress={() => !isToday && setDateOffset(d => d + 1)}
            disabled={isToday}
          >
            <ChevronRight size={18} color="#64748b" />
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Summary Card */}
          <View style={styles.card}>
            {/* 2x2 Meal Grid */}
            <View style={styles.mealGrid}>
              {mealSummary.map((m, i) => {
                const Icon = m.icon;
                return (
                  <View key={i} style={styles.mealCell}>
                    <View style={[styles.mealIconWrap]}>
                      <Icon size={16} color={m.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mealCellLabel}>{m.label}</Text>
                      <Text style={styles.mealCellCal}>{m.cal} <Text style={styles.mealCellUnit}>kcal</Text></Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Total Intake */}
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>TOTAL INTAKE</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
                  <Text style={styles.totalValue}>{displayCalories}</Text>
                  <Text style={styles.totalGoal}>/ {dailyGoalCal} kcal</Text>
                </View>
              </View>
              {/* Progress Ring */}
              <View style={styles.ring}>
                <View style={[styles.ringFill, { 
                  borderTopColor: calProgress >= 0.25 ? '#34C759' : '#e2e8f0',
                  borderRightColor: calProgress >= 0.5 ? '#34C759' : '#e2e8f0',
                  borderBottomColor: calProgress >= 0.75 ? '#34C759' : '#e2e8f0',
                  borderLeftColor: calProgress >= 1 ? '#34C759' : '#e2e8f0',
                }]} />
                <Activity size={18} color="#34C759" />
              </View>
            </View>

            {/* Meal List */}
            {selectedDateMeals.length === 0 ? (
              <View style={styles.emptyMeals}>
                <Text style={styles.emptyText}>No meals logged for this day.</Text>
              </View>
            ) : (
              <View style={{ gap: 10, marginTop: 8 }}>
                {selectedDateMeals.map((meal: any, idx: number) => {
                  const { Icon, color } = getMealIcon(meal.mealType || 'snack');
                  return (
                    <View key={meal.id || idx} style={styles.mealRow}>
                      <View style={styles.mealRowLeft}>
                        <View style={styles.mealRowIcon}>
                          <Icon size={16} color={color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.mealRowType}>{meal.mealType || 'Snack'}</Text>
                          <Text style={styles.mealRowName} numberOfLines={1}>{meal.name || ''}</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.mealRowCal}>{meal.calories || 0} kcal</Text>
                        <Text style={styles.mealRowPro}>{meal.protein || 0}g protein</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Daily Goals */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Daily Goals</Text>
            <Text style={styles.sectionCount}>
              {(displayCalories > 0 ? 1 : 0) + (displayWater > 0 ? 1 : 0)} / 5
            </Text>
          </View>

          {/* Log Food */}
          <Pressable style={styles.logCard}>
            <View style={styles.logCardBody}>
              <View style={[styles.logDot, displayCalories > 0 && styles.logDotDone]}>
                {displayCalories > 0 && <Check size={12} color="#fff" />}
              </View>
              <Text style={styles.logCardTitle}>Log Your Food</Text>
              <View style={styles.logCardSub}>
                <Flame size={12} color="#94a3b8" />
                <Text style={styles.logCardSubText}>{displayCalories} / {dailyGoalCal} cal</Text>
              </View>
            </View>
            <View style={[styles.logCardImg, { backgroundColor: '#f9ebd6' }]} />
          </Pressable>

          {/* Log Water */}
          <Pressable style={[styles.logCard, { marginTop: 12 }]}>
            <View style={styles.logCardBody}>
              <View style={[styles.logDot, displayWater > 0 && styles.logDotDone]}>
                {displayWater > 0 && <Check size={12} color="#fff" />}
              </View>
              <Text style={styles.logCardTitle}>Log Water</Text>
              <View style={styles.logCardSub}>
                <Droplets size={12} color="#94a3b8" />
                <Text style={styles.logCardSubText}>{displayWater} / {dailyGoalWater}ml</Text>
              </View>
            </View>
            <View style={[styles.logCardImg, { backgroundColor: '#dcf2fe' }]} />
          </Pressable>
        </ScrollView>

        {/* Calendar Drawer — inline, NOT Modal, so it stays within 480px container */}
        {isCalendarOpen && (
          <View style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsCalendarOpen(false)} />
            <View style={styles.drawer}>
              <View style={styles.handle} />
              <Text style={styles.drawerTitle}>Pick a Date</Text>

              {/* Day headers */}
              <View style={styles.calHeader}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <Text key={d} style={styles.calDayHeader}>{d}</Text>
                ))}
              </View>

              <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.calMonthLabel}>{monthName}</Text>
                <View style={styles.calGrid}>
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <View key={`e${i}`} style={styles.calCell} />
                  ))}
                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const thisDayStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSel = thisDayStr === targetDateString;
                    return (
                      <Pressable
                        key={day}
                        style={[styles.calCell, isSel && styles.calCellSel]}
                        onPress={() => {
                          const diff = Math.round((new Date(thisDayStr).getTime() - new Date().setHours(0,0,0,0)) / 86400000);
                          setDateOffset(diff);
                          setIsCalendarOpen(false);
                        }}
                      >
                        <Text style={[styles.calDay, isSel && { color: '#fff', fontWeight: 'bold' }]}>{day}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>

              <Pressable style={styles.continueBtn} onPress={() => setIsCalendarOpen(false)}>
                <Text style={styles.continueBtnText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#EAF8F1' },
  root: { 
    width: '100%', 
    maxWidth: 480, 
    alignSelf: 'center', 
    flex: 1, 
    backgroundColor: '#EAF8F1',
    position: 'relative',
    overflow: 'hidden',
  },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#10201a' },

  dateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingBottom: 16 },
  dateArrow: { padding: 8 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateLabel: { fontSize: 15, fontWeight: 'bold', color: '#10201a' },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 32 },

  // ── Summary Card ──
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 28, 
    padding: 18, 
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 4,
  },
  mealGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  mealCell: { 
    width: '47%', flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', padding: 10, borderRadius: 18,
    borderWidth: 1, borderColor: '#f1f5f9',
  },
  mealIconWrap: { 
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', 
    justifyContent: 'center', alignItems: 'center', 
    borderWidth: 1, borderColor: '#f1f5f9',
  },
  mealCellLabel: { fontSize: 8, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.3 },
  mealCellCal: { fontSize: 15, fontWeight: '900', color: '#10201a', marginTop: 1 },
  mealCellUnit: { fontSize: 9, fontWeight: '600', color: '#94a3b8' },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  totalValue: { fontSize: 30, fontWeight: '900', color: '#10201a', lineHeight: 30 },
  totalGoal: { fontSize: 13, fontWeight: '600', color: '#94a3b8', marginBottom: 2 },

  ring: { 
    width: 44, height: 44, borderRadius: 22, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#e2e8f0',
  },
  ringFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 3,
  },

  emptyMeals: { padding: 16, backgroundColor: '#f8fafc', borderRadius: 16, marginTop: 8, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },

  // ── Meal rows ──
  mealRow: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, backgroundColor: '#fff', borderRadius: 18,
    borderWidth: 1, borderColor: '#f1f5f9',
  },
  mealRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  mealRowIcon: { 
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#f8fafc', 
    justifyContent: 'center', alignItems: 'center', 
    borderWidth: 1, borderColor: '#f1f5f9' 
  },
  mealRowType: { fontSize: 14, fontWeight: 'bold', color: '#10201a', textTransform: 'capitalize' },
  mealRowName: { fontSize: 11, color: '#94a3b8', marginTop: 2, maxWidth: 120 },
  mealRowCal: { fontSize: 13, fontWeight: 'bold', color: '#10201a' },
  mealRowPro: { fontSize: 10, color: '#94a3b8', fontWeight: '500', marginTop: 2 },

  // ── Section ──
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#10201a' },
  sectionCount: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8' },

  // ── Log Cards ──
  logCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2,
  },
  logCardBody: { flex: 1, padding: 18 },
  logDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#e2e8f0', marginBottom: 6, justifyContent: 'center', alignItems: 'center' },
  logDotDone: { backgroundColor: '#34C759', borderColor: '#34C759' },
  logCardTitle: { fontSize: 15, fontWeight: 'bold', color: '#10201a' },
  logCardSub: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  logCardSubText: { fontSize: 11, fontWeight: '600', color: '#94a3b8' },
  logCardImg: { width: 120, height: 100, borderTopLeftRadius: 32, borderBottomLeftRadius: 32 },

  // ── Overlay (inline, NOT Modal) ──
  overlay: { 
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', zIndex: 100,
  },
  drawer: { 
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, 
    padding: 20, paddingBottom: 32, maxHeight: '80%',
  },
  handle: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  drawerTitle: { fontSize: 18, fontWeight: 'bold', color: '#10201a', textAlign: 'center', marginBottom: 18 },

  calHeader: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', marginBottom: 8 },
  calDayHeader: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', width: '14.28%', textAlign: 'center' },
  calMonthLabel: { fontSize: 12, fontWeight: 'bold', color: '#34C759', textAlign: 'center', marginVertical: 12, letterSpacing: 1 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
  calCellSel: { backgroundColor: '#34C759', borderRadius: 20 },
  calDay: { fontSize: 13, color: '#64748b', fontWeight: '500' },

  continueBtn: { backgroundColor: '#101828', padding: 16, borderRadius: 18, alignItems: 'center', marginTop: 16 },
  continueBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
