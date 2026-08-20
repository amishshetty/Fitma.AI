import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { Text as RNText } from 'react-native';
import { 
  ChevronLeft, ChevronDown, ChevronRight, 
  Sunrise, Sun, Moon, Coffee, Check, Flame, 
  Droplets, Target, Zap, Activity
} from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function MyPlanScreen() {
  const [selectedDate, setSelectedDate] = useState('2023-10-10');
  const [isWaterDrawerOpen, setIsWaterDrawerOpen] = useState(false);
  const [isWeightDrawerOpen, setIsWeightDrawerOpen] = useState(false);
  const [isMealDrawerOpen, setIsMealDrawerOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  const displayCalories = 1250;
  const dailyGoalCal = 2000;
  const displayWater = 1500;
  const dailyGoalWater = 2500;
  const displayWeight = 70.0;

  const meals = [
    { label: 'Breakfast', cal: 350, pro: 15, icon: Sunrise, color: '#FF8B6B' },
    { label: 'Lunch', cal: 600, pro: 35, icon: Sun, color: '#FFD166' },
    { label: 'Dinner', cal: 0, pro: 0, icon: Moon, color: '#118AB2' },
    { label: 'Snacks', cal: 300, pro: 10, icon: Coffee, color: '#06D6A0' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Plan</Text>
        </View>

        {/* Date Navigator */}
        <View style={styles.dateNavigator}>
          <Pressable style={styles.navBtn}><ChevronLeft size={18} color="#666" /></Pressable>
          <Pressable style={styles.dateBtn}>
            <Text style={styles.dateText}>Today</Text>
            <ChevronDown size={16} color="#000" />
          </Pressable>
          <Pressable style={[styles.navBtn, { opacity: 0.3 }]}><ChevronRight size={18} color="#666" /></Pressable>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Daily Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.mealsGrid}>
              {meals.map((meal, idx) => {
                const Icon = meal.icon;
                return (
                  <View key={idx} style={styles.mealSmallCard}>
                    <View style={styles.mealIconWrapper}>
                      <Icon size={18} color={meal.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mealLabel}>{meal.label}</Text>
                      <Text style={styles.mealCal}>{meal.cal} <Text style={styles.mealCalUnit}>kcal</Text></Text>
                    </View>
                  </View>
                );
              })}
            </View>
            
            <View style={styles.intakeRow}>
              <View>
                <Text style={styles.intakeLabel}>Total Intake</Text>
                <View style={styles.intakeValues}>
                  <Text style={styles.intakeCurrent}>{displayCalories}</Text>
                  <Text style={styles.intakeTarget}>/ {dailyGoalCal} kcal</Text>
                </View>
              </View>
              <View style={styles.progressRing}>
                <Activity size={24} color="#34C759" />
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Goals</Text>
            <Text style={styles.sectionCount}>0 / 5 <Check size={12} color="#666" /></Text>
          </View>

          {/* Log Cards */}
          <View style={styles.logCards}>
            <Pressable style={styles.logCard} onPress={() => setIsMealDrawerOpen(true)}>
              <View style={styles.logCardContent}>
                 <View style={styles.logCardDot} />
                 <Text style={styles.logCardTitle}>Log Your Food</Text>
                 <View style={styles.logCardDescRow}>
                   <Flame size={12} color="#666" />
                   <Text style={styles.logCardDescText}>{displayCalories} / {dailyGoalCal} cal</Text>
                 </View>
              </View>
              <View style={[styles.logCardImageBg, { backgroundColor: '#f9ebd6' }]} />
            </Pressable>

            <Pressable style={styles.logCard} onPress={() => setIsWaterDrawerOpen(true)}>
              <View style={styles.logCardContent}>
                 <View style={styles.logCardDot} />
                 <Text style={styles.logCardTitle}>Log Water</Text>
                 <View style={styles.logCardDescRow}>
                   <Droplets size={12} color="#666" />
                   <Text style={styles.logCardDescText}>{displayWater} / {dailyGoalWater}ml</Text>
                 </View>
              </View>
              <View style={[styles.logCardImageBg, { backgroundColor: '#dcf2fe' }]} />
            </Pressable>

            <Pressable style={styles.logCard} onPress={() => setIsWeightDrawerOpen(true)}>
              <View style={styles.logCardContent}>
                 <View style={styles.logCardDot} />
                 <Text style={styles.logCardTitle}>Log Weight</Text>
                 <View style={styles.logCardDescRow}>
                   <Target size={12} color="#666" />
                   <Text style={styles.logCardDescText}>{displayWeight} kg</Text>
                 </View>
              </View>
              <View style={[styles.logCardImageBg, { backgroundColor: '#f1f5f9' }]} />
            </Pressable>

            <View style={[styles.logCard, { opacity: 0.9, backgroundColor: '#f8fafc' }]}>
              <View style={styles.logCardContent}>
                 <View style={styles.logCardDot} />
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                   <Text style={styles.logCardTitle}>Log Activities</Text>
                   <View style={styles.comingSoonBadge}><Text style={styles.comingSoonText}>Coming Soon</Text></View>
                 </View>
                 <View style={styles.logCardDescRow}>
                   <Zap size={12} color="#666" />
                   <Text style={styles.logCardDescText}>Future Scope</Text>
                 </View>
              </View>
              <View style={[styles.logCardImageBg, { backgroundColor: '#fde9eb', opacity: 0.6 }]} />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Drawers */}
      {isWaterDrawerOpen && (
        <View style={styles.drawerOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsWaterDrawerOpen(false)} />
          <View style={styles.drawerContent}>
            <View style={styles.drawerHandle} />
            <Text style={styles.drawerTitle}>Log Water</Text>
            <Text style={styles.drawerSubtitle}>Quickly add water to your daily goal</Text>
            <View style={styles.waterGrid}>
               {[250, 500, 750, 1000].map(amt => (
                 <Pressable key={amt} style={styles.waterBtn} onPress={() => setIsWaterDrawerOpen(false)}>
                   <Droplets size={18} color="#0ea5e9" />
                   <Text style={styles.waterBtnText}>{amt}ml</Text>
                 </Pressable>
               ))}
            </View>
            <Pressable style={styles.cancelBtn} onPress={() => setIsWaterDrawerOpen(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      {isWeightDrawerOpen && (
        <View style={styles.drawerOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsWeightDrawerOpen(false)} />
          <View style={styles.drawerContent}>
            <View style={styles.drawerHandle} />
            <Text style={styles.drawerTitle}>Log Weight</Text>
            <Text style={styles.drawerSubtitle}>Update your body weight for today</Text>
            <View style={styles.weightInputContainer}>
               <TextInput 
                  style={styles.weightInput}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  placeholder="70.0"
                  placeholderTextColor="#ccc"
                  keyboardType="decimal-pad"
               />
               <Text style={styles.weightUnit}>kg</Text>
            </View>
            <Pressable style={styles.saveBtn} onPress={() => setIsWeightDrawerOpen(false)}>
              <Text style={styles.saveBtnText}>Save Weight</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={() => setIsWeightDrawerOpen(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      {isMealDrawerOpen && (
        <View style={styles.drawerOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsMealDrawerOpen(false)} />
          <View style={styles.drawerContent}>
            <View style={styles.drawerHandle} />
            <Text style={styles.drawerTitle}>Log Your Meal</Text>
            <Text style={styles.drawerSubtitle}>Choose how you want to track your food</Text>
            
            <View style={styles.mealOptions}>
              <Pressable style={styles.mealOptionBtn} onPress={() => setIsMealDrawerOpen(false)}>
                 <Text style={styles.mealOptionTitle}>Ask Liva AI</Text>
                 <Text style={styles.mealOptionSub}>Describe your meal naturally</Text>
              </Pressable>
              <Pressable style={styles.mealOptionBtn} onPress={() => setIsMealDrawerOpen(false)}>
                 <Text style={styles.mealOptionTitle}>Search Food</Text>
                 <Text style={styles.mealOptionSub}>Type to search our database</Text>
              </Pressable>
            </View>

            <Pressable style={styles.cancelBtn} onPress={() => setIsMealDrawerOpen(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  root: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff', flexDirection: 'column' },
  header: { paddingHorizontal: 24, paddingBottom: 16, paddingTop: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  dateNavigator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 24 },
  navBtn: { padding: 8 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  
  summaryCard: { backgroundColor: '#f8fafc', borderRadius: 32, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: '#f1f5f9' },
  mealsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  mealSmallCard: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#f1f5f9' },
  mealIconWrapper: { width: 40, height: 40, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  mealLabel: { fontSize: 10, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
  mealCal: { fontSize: 14, fontWeight: '900', color: '#000' },
  mealCalUnit: { fontSize: 10, fontWeight: '500', color: '#666' },
  
  intakeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  intakeLabel: { fontSize: 12, fontWeight: 'bold', color: '#666', textTransform: 'uppercase', marginBottom: 4 },
  intakeValues: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  intakeCurrent: { fontSize: 32, fontWeight: '900', color: '#000', lineHeight: 32 },
  intakeTarget: { fontSize: 14, fontWeight: '500', color: '#666', marginBottom: 2 },
  progressRing: { width: 56, height: 56, borderRadius: 28, borderWidth: 4, borderColor: '#34C759', justifyContent: 'center', alignItems: 'center' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#000' },
  sectionCount: { fontSize: 12, fontWeight: 'bold', color: '#666' },

  logCards: { gap: 16 },
  logCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2 },
  logCardContent: { flex: 1, padding: 20 },
  logCardDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#f1f5f9', marginBottom: 8 },
  logCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  logCardDescRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  logCardDescText: { fontSize: 12, fontWeight: '600', color: '#666' },
  logCardImageBg: { width: 140, height: 112, borderTopLeftRadius: 40, borderBottomLeftRadius: 40 },
  comingSoonBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  comingSoonText: { fontSize: 9, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },

  drawerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', zIndex: 100 },
  drawerContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  drawerHandle: { width: 48, height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, alignSelf: 'center', marginBottom: 24 },
  drawerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 8 },
  drawerSubtitle: { fontSize: 14, fontWeight: '600', color: '#666', textAlign: 'center', marginBottom: 24 },
  
  waterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  waterBtn: { width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(220,242,254,0.3)', borderColor: '#dcf2fe', borderWidth: 1.5, borderRadius: 20, paddingVertical: 20 },
  waterBtnText: { fontSize: 18, fontWeight: 'bold', color: '#0ea5e9' },
  
  weightInputContainer: { alignItems: 'center', marginBottom: 24, position: 'relative' },
  weightInput: { width: 200, backgroundColor: '#f8fafc', borderRadius: 24, padding: 20, fontSize: 30, fontWeight: '900', color: '#000', textAlign: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  weightUnit: { position: 'absolute', right: 70, top: 25, fontSize: 18, fontWeight: 'bold', color: '#666' },
  
  mealOptions: { gap: 12 },
  mealOptionBtn: { backgroundColor: '#fff', borderRadius: 20, borderWidth: 1.5, borderColor: '#f1f5f9', padding: 16 },
  mealOptionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  mealOptionSub: { fontSize: 12, fontWeight: '600', color: '#666', marginTop: 2 },

  saveBtn: { backgroundColor: '#34C759', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  cancelBtnText: { color: '#666', fontSize: 16, fontWeight: 'bold' },
});
