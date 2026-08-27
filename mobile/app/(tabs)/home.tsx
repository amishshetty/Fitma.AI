import React, { useState, useMemo } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet, Text as RNText, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Mic, Camera, Keyboard, Bell, MessageCircle, Send, Plus, Sparkles,
  Droplets, Minus, Sunrise, Sun, Moon, Coffee, Trash2, ArrowRight, Zap, Check
} from 'lucide-react-native';
import { green, muted, softGreen, ink } from '../../constants';
import LivaAvatar from '../../components/layout/LivaAvatar';

import Svg, { Circle } from 'react-native-svg';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const ProgressRing = ({ value, size, color }: any) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeValue = Math.min(Math.max(value || 0, 0), 100);
  const strokeDashoffset = circumference - (safeValue / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle
          stroke="#e2e8f0"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={{ fontSize: size / 4, color, fontWeight: 'bold' }}>{safeValue}%</Text>
    </View>
  );
};


const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';

export default function HomeScreen() {
  const router = useRouter();
  
  // Connect to Zustand store
  const userName = useAppStore((state) => state.userName);
  const goals = useAppStore((state) => state.goals);
  const rawWaterLogged = useAppStore((state) => state.waterLogged);
  const history = useAppStore((state) => state.history);
  const loggedMeals = useAppStore((state) => state.meals);
  const logWater = useAppStore((state) => state.logWater);
  const deleteMeal = useAppStore((state) => state.deleteMeal);

  // Compute today's metrics dynamically (like the Web App does)
  const targetStart = new Date().setHours(0, 0, 0, 0);
  const targetEnd = new Date().setHours(23, 59, 59, 999);
  
  const todayMeals = loggedMeals.filter((m: any) => {
    const time = parseInt(m.id);
    if (isNaN(time)) return true; // fallback for mocked data without proper ID
    return time >= targetStart && time <= targetEnd;
  });

  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const waterLogged = history[todayStr]?.water || 0;

  const caloriesLogged = todayMeals.reduce((acc: number, curr: any) => acc + (curr.calories || 0), 0);
  const proteinLogged = todayMeals.reduce((acc: number, curr: any) => acc + (curr.protein || 0), 0);

  const calPercent = Math.min(100, Math.round((caloriesLogged / (goals?.calories || 2000)) * 100));
  const proteinPercent = Math.min(100, Math.round((proteinLogged / (goals?.protein || 120)) * 100));
  const waterPercent = Math.min(100, Math.round((waterLogged / (goals?.water || 2500)) * 100));
  
  const onNavigate = (route: string) => {
    // Basic mapping from web route names to expo paths
    if (route === 'quick-log') router.push('/quick-log');
    else if (route === 'liva-home') router.push('/(tabs)/liva-home');
    else if (route === 'reminder-center') router.push('/reminder-center');
    else router.push('/(tabs)/home'); // Fallback
  };
  
  const onStartLog = (mode: string) => {
    if (mode === 'text') router.push('/text-logging');
    else if (mode === 'voice') router.push('/voice-logging');
    else if (mode === 'camera') router.push('/camera-meal-selection');
    else router.push('/quick-log');
  };
  
  const onLogWater = (amount: number) => {
    logWater(amount);
  };
  
  const onDeleteMeal = (id: string) => {
    deleteMeal(id);
  };
  const onSetChatInitialMsg = (msg: string) => {};
  const [askLivaText, setAskLivaText] = useState('');
  const [isMealDrawerOpen, setIsMealDrawerOpen] = useState(false);
  const [selectedMealCategory, setSelectedMealCategory] = useState<string | null>(null);

  const waterGlasses = Math.min(12, Math.round(waterLogged / 250));


  const insights = useMemo(() => {
    const hour = new Date().getHours();
    const generated = [];
    const calTarget = goals?.calories || 2000;
    const protTarget = goals?.protein || 100;
    const calRemaining = Math.max(0, calTarget - caloriesLogged);
    const protRemaining = Math.max(0, protTarget - proteinLogged);

    const hasBreakfast = loggedMeals.some((m: any) => m.mealType?.toLowerCase() === 'breakfast');
    const hasLunch = loggedMeals.some((m: any) => m.mealType?.toLowerCase() === 'lunch');
    const hasDinner = loggedMeals.some((m: any) => m.mealType?.toLowerCase() === 'dinner');

    if (hour >= 17) {
      if (!hasDinner) {
        generated.push({
          id: 'time-dinner',
          icon: <Moon size={16} color="#00C4B0" />,
          title: 'Evening Update',
          text: calRemaining > 800 ? 'You have enough calories left. Enjoy a good dinner!' : 'Calories are low. Try a light dinner like soup or salad.',
          actionText: 'Log dinner',
          onClick: () => onStartLog('text'),
          color: '#00C4B0',
        });
      } else {
        generated.push({
          id: 'time-dinner-done',
          icon: <Moon size={16} color="#00C4B0" />,
          title: 'Evening Update',
          text: 'Dinner is logged! Have a relaxing evening.',
          color: '#00C4B0',
        });
      }
    } else if (hour < 11) {
      if (!hasBreakfast) {
        generated.push({
          id: 'time-morning',
          icon: <Sunrise size={16} color="#00C4B0" />,
          title: 'Morning Routine',
          text: waterGlasses < 3 ? 'You need more water today. Drink a glass now!' : 'Start your day right with a healthy breakfast!',
          actionText: waterGlasses < 3 ? 'Add water' : 'Log breakfast',
          onClick: waterGlasses < 3 ? () => onLogWater(250) : () => onStartLog('text'),
          color: '#00C4B0',
        });
      } else {
        generated.push({
          id: 'time-morning-done',
          icon: <Sunrise size={16} color="#00C4B0" />,
          title: 'Morning Routine',
          text: waterGlasses < 3 ? 'You need more water today. Drink a glass now!' : 'Great start today! Keep up the good work.',
          actionText: waterGlasses < 3 ? 'Add water' : 'Log snack',
          onClick: waterGlasses < 3 ? () => onLogWater(250) : () => onStartLog('text'),
          color: '#00C4B0',
        });
      }
    } else {
      if (!hasLunch) {
        generated.push({
          id: 'time-lunch',
          icon: <Sun size={16} color="#00C4B0" />,
          title: 'Mid-day Check',
          text: caloriesLogged < calTarget * 0.3 ? "You've barely eaten today! Make sure to grab a nutritious lunch." : 'Time for lunch! Refuel your body.',
          actionText: 'Log lunch',
          onClick: () => onStartLog('text'),
          color: '#00C4B0',
        });
      } else {
        generated.push({
          id: 'time-lunch-done',
          icon: <Sun size={16} color="#00C4B0" />,
          title: 'Mid-day Check',
          text: "You're doing great on your meals! A quick walk can give you a mid-day energy boost.",
          color: '#00C4B0',
        });
      }
    }

    if (proteinPercent < calPercent - 15) {
      generated.push({
        id: 'macro-protein',
        icon: <Sparkles size={16} color="#0EA5E9" />,
        title: 'Protein Check',
        text: `You need ${protRemaining}g more protein, but only have ${calRemaining} calories left. Try to eat lean meat.`,
        actionText: 'High-protein snacks',
        onClick: () => onNavigate('liva-home'),
        color: '#0EA5E9',
      });
    } else {
      generated.push({
        id: 'macro-track',
        icon: <Sparkles size={16} color="#0EA5E9" />,
        title: 'Macro Balance',
        text: 'Your protein and calories look great today. Keep it up! 💪',
        color: '#0EA5E9',
      });
    }

    generated.push({
      id: 'trend-fat',
      type: 'suggestion',
      icon: <Check size={16} color="#34C759" />,
      title: 'Weekly Trend',
      text: 'You ate a lot of fats this week. Try eating more veggies today. 🌱',
    });
    if (generated.length === 0) {
      generated.push({
        id: '5',
        type: 'success',
        icon: <Check size={16} color="#34C759" />,
        title: 'On Track!',
        text: "You're doing great today. Keep up the consistent logging.",
        actionText: 'View trends',
        onClick: () => onNavigate('progress-dashboard'),
      });
    }

    return generated.slice(0, 3);
  }, [caloriesLogged, proteinLogged, waterGlasses, goals, proteinPercent, calPercent, onNavigate, onStartLog, onLogWater, loggedMeals]);

  const nutrition = [
    { label: 'Calories', value: calPercent, detail: `${(caloriesLogged || 0).toLocaleString()} / ${(goals?.calories || 2000).toLocaleString()}`, color: green },
    { label: 'Protein', value: proteinPercent, detail: `${proteinLogged}g / ${goals?.protein || 100}g`, color: '#0EA5E9' },
    { label: 'Water', value: waterPercent, detail: `${(waterLogged / 1000).toFixed(1)} / ${(goals?.water / 1000 || 2.5).toFixed(1)}L`, color: '#00C4B0' },
  ];

  const logActions = [
    { label: 'Voice', icon: Mic, mode: 'voice', color: '#86efac', bg: 'rgba(0,0,0,0.28)' },
    { label: 'Camera', icon: Camera, mode: 'camera', color: '#7dd3fc', bg: 'rgba(0,0,0,0.28)' },
    { label: 'Text', icon: Keyboard, mode: 'text', color: '#d8b4fe', bg: 'rgba(0,0,0,0.28)' },
  ];

  const getMealCategoryData = (category: string) => {
    const categoryMeals = todayMeals.filter((m: any) => m.mealType && m.mealType.toLowerCase() === category.toLowerCase());
    
    if (categoryMeals.length === 0) return { calories: '0 kcal', status: 'Not logged yet', active: false };
    const totalCal = categoryMeals.reduce((sum: number, m: any) => sum + (m.calories || 0), 0);
    const names = categoryMeals.map((m: any) => m.name).join(', ');
    return { calories: `${totalCal} kcal`, status: names, active: true };
  };

  const meals = [
    { label: 'Breakfast', time: '8:30 AM', ...getMealCategoryData('breakfast') },
    { label: 'Lunch', time: '1:00 PM', ...getMealCategoryData('lunch') },
    { label: 'Dinner', time: '8:00 PM', ...getMealCategoryData('dinner') },
    { label: 'Snack', time: 'Anytime', ...getMealCategoryData('snack') },
  ];

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greetingText}>{getGreeting()},{'\n'}{userName || 'User'}</Text>
            <Text style={styles.subGreetingText}>Small wins today. Log meals quickly and let Liva keep the numbers tidy.</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.bellButton} onPress={() => onNavigate('reminder-center')}>
              <Bell size={20} color={green} />
            </Pressable>
            <View style={styles.avatarWrapper}>
              <LivaAvatar size={44} floating={false} />
            </View>
          </View>
        </View>

        {/* Ask Liva */}
        <Pressable 
          style={styles.askLivaContainer} 
          onPress={() => {
            if (askLivaText.trim()) {
              onSetChatInitialMsg(askLivaText);
              onNavigate('liva-home');
            }
          }}
        >
          <View style={styles.askLivaRow}>
            <LivaAvatar size={38} floating />
            <View style={styles.askLivaInputBox}>
              <Text style={styles.askLivaTitle}>Ask Liva</Text>
              <View style={styles.askLivaInputWrapper}>
                <MessageCircle size={16} color={green} />
                <TextInput
                  style={styles.askLivaInput}
                  placeholder="What did you eat today?"
                  placeholderTextColor={muted}
                  value={askLivaText}
                  onChangeText={setAskLivaText}
                  onSubmitEditing={() => {
                    if (askLivaText.trim()) {
                      onSetChatInitialMsg(askLivaText);
                      onNavigate('liva-home');
                    }
                  }}
                />
                <Pressable onPress={() => {
                  if (askLivaText.trim()) {
                    onSetChatInitialMsg(askLivaText);
                    onNavigate('liva-home');
                  }
                }}>
                  <Send size={16} color={green} />
                </Pressable>
              </View>
            </View>
          </View>
        </Pressable>

        {/* Quick Log Meal */}
        <View style={styles.quickLogContainer}>
          <View style={styles.quickLogHeader}>
            <View>
              <Text style={styles.quickLogTitle}>Quick Log Meal</Text>
              <Text style={styles.quickLogSub}>Under 15 seconds</Text>
            </View>
            <Pressable style={styles.quickLogPlus} onPress={() => onNavigate('text-logging')}>
              <Plus size={20} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.quickLogActions}>
            {logActions.map((action) => {
              const Icon = action.icon;
              return (
                <Pressable key={action.label} style={styles.logActionButton} onPress={() => onStartLog(action.mode)}>
                  <View style={[styles.logActionIconWrapper, { backgroundColor: action.bg }]}>
                    <Icon size={23} color={action.color} />
                  </View>
                  <Text style={styles.logActionLabel}>{action.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Daily Nutrition */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Daily Nutrition</Text>
              <Text style={styles.sectionSubtitle}>Compact overview</Text>
            </View>
            <View style={styles.sectionIconBg}>
              <Sparkles size={20} color={green} />
            </View>
          </View>
          <View style={styles.nutritionGrid}>
            {nutrition.map((item) => {
              const parts = item.detail.split('/');
              const current = parts[0]?.trim();
              const total = parts[1]?.trim();
              return (
                <View key={item.label} style={styles.nutritionCard}>
                  <ProgressRing value={item.value} size={64} color={item.color} />
                  <Text style={styles.nutritionLabel}>{item.label}</Text>
                  <Text style={styles.nutritionCurrent}>{current}</Text>
                  {total && <Text style={styles.nutritionTotal}>/ {total}</Text>}
                </View>
              );
            })}
          </View>
        </View>

        {/* Water Intake */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Water Intake</Text>
              <Text style={styles.sectionSubtitle}>{Math.round(waterGlasses * 250)} ml logged today</Text>
            </View>
            <View style={styles.waterBadge}>
              <Droplets size={16} color={green} />
              <Text style={styles.waterBadgeText}>{waterGlasses}/12</Text>
            </View>
          </View>
          <View style={styles.waterTracker}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Pressable
                key={i}
                onPress={() => onLogWater(((i + 1) * 250) - waterLogged)}
                style={[{ flex: 1, borderRadius: 6, overflow: 'hidden' }, { opacity: i < waterGlasses ? 1 : 0.6 }]}
              >
                <View style={[
                  { flex: 1, backgroundColor: '#f1f5f9' },
                  i < waterGlasses && Platform.OS === 'web' && {
                    backgroundImage: 'linear-gradient(135deg, #34C759 0%, #00C4B0 100%)'
                  } as any
                ]}>
                  {i < waterGlasses && Platform.OS !== 'web' && (
                    <LinearGradient 
                      colors={['#34C759', '#00C4B0']} 
                      start={{ x: 0, y: 0 }} 
                      end={{ x: 1, y: 1 }} 
                      style={StyleSheet.absoluteFillObject} 
                    />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
          <View style={styles.waterActions}>
            <Pressable style={styles.waterBtnIcon} onPress={() => onLogWater(-250)}>
              <Minus size={20} color={muted} />
            </Pressable>
            <Pressable 
              style={[
                styles.waterBtnAdd, 
                { overflow: 'hidden', backgroundColor: '#34C759' },
                Platform.OS === 'web' && {
                  backgroundImage: 'linear-gradient(135deg, #34C759 0%, #00C4B0 100%)'
                } as any
              ]} 
              onPress={() => onLogWater(250)}
            >
              {Platform.OS !== 'web' && (
                <LinearGradient 
                  colors={['#34C759', '#00C4B0']} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 1 }} 
                  style={StyleSheet.absoluteFillObject}
                />
              )}
              <Droplets size={18} color="#fff" />
              <Text style={styles.waterBtnAddText}>Add 250 ml</Text>
            </Pressable>
            <Pressable style={styles.waterBtnIconActive} onPress={() => onLogWater(250)}>
              <Plus size={18} color={green} />
            </Pressable>
          </View>
        </View>

        {/* Today's Meals Timeline */}
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals Timeline</Text>
            <Pressable onPress={() => onNavigate('quick-log')}>
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          </View>
          <View style={styles.mealsList}>
            {meals.map((meal) => (
              <Pressable 
                key={meal.label} 
                style={[styles.mealCard, meal.active ? styles.mealCardActive : {}]}
                onPress={() => {
                  if (meal.active) {
                    setSelectedMealCategory(meal.label.toLowerCase());
                    setIsMealDrawerOpen(true);
                  }
                }}
              >
                <View style={[styles.mealIconWrapper, meal.active ? styles.mealIconWrapperActive : {}]}>
                  {meal.label === 'Breakfast' ? <Sunrise size={20} color={meal.active ? green : muted} /> :
                   meal.label === 'Lunch' ? <Sun size={20} color={meal.active ? green : muted} /> :
                   meal.label === 'Dinner' ? <Moon size={20} color={meal.active ? green : muted} /> :
                   <Coffee size={20} color={meal.active ? green : muted} />}
                </View>
                <View style={styles.mealInfo}>
                  <Text style={[styles.mealLabel, meal.active ? styles.textActive : styles.textInactive]}>{meal.label}</Text>
                  <Text style={[styles.mealStatus, meal.active ? styles.textActiveMuted : styles.textInactiveMuted]} numberOfLines={1}>{meal.status}</Text>
                </View>
                <View style={styles.mealTimeStats}>
                  <Text style={[styles.mealLabel, meal.active ? styles.textActive : styles.textInactive]}>{meal.calories}</Text>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <View style={styles.insightsHeader}>
            <View style={styles.insightsIconBg}>
              <Sparkles size={14} color={green} />
            </View>
            <Text style={styles.insightsTitle}>Liva's Active Analysis</Text>
          </View>
          <View style={styles.insightsList}>
            {insights.map((insight) => (
              <View key={insight.id} style={styles.insightCard}>
                <View style={styles.insightTopRow}>
                  <View style={[styles.insightIconWrapper, { backgroundColor: '#fff' }]}>
                    {insight.icon}
                  </View>
                  <View style={styles.insightTextWrapper}>
                    <Text style={[styles.insightCardTitle, { color: insight.color }]}>{insight.title}</Text>
                    <Text style={styles.insightCardText}>{insight.text}</Text>
                  </View>
                </View>
                {insight.actionText && insight.onClick && (
                  <Pressable style={styles.insightActionBtn} onPress={insight.onClick}>
                    <Text style={[styles.insightActionText, { color: insight.color }]}>{insight.actionText}</Text>
                    <ArrowRight size={12} color={insight.color} />
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        </View>
        
      </ScrollView>

      {/* Meal Details Drawer — inline overlay */}
      {isMealDrawerOpen && (
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsMealDrawerOpen(false)} />
          <View style={[styles.modalContent, { maxHeight: '85%' }]}>
            <Pressable style={styles.modalHandle} onPress={() => setIsMealDrawerOpen(false)} />
            <Text style={styles.modalTitle}>{selectedMealCategory} Details</Text>
            <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
            {todayMeals.filter((m: any) => m.mealType?.toLowerCase() === selectedMealCategory?.toLowerCase()).length === 0 ? (
                <Text style={styles.modalEmpty}>No meals logged for this category.</Text>
              ) : (
                todayMeals.filter((m: any) => m.mealType?.toLowerCase() === selectedMealCategory?.toLowerCase()).map((m: any) => (
                  <View key={m.id} style={styles.modalMealCard}>
                    <View>
                      <Text style={styles.modalMealName}>{m.name}</Text>
                      <Text style={styles.modalMealStats}>{m.calories} kcal • {m.protein}g protein</Text>
                      <Text style={styles.modalMealTime}>
                        {m.time ? new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : m.timestamp || ''}
                      </Text>
                    </View>
                    <Pressable onPress={() => {
                      onDeleteMeal(m.id);
                      if (todayMeals.filter((meal: any) => meal.mealType?.toLowerCase() === selectedMealCategory?.toLowerCase()).length <= 1) {
                        setIsMealDrawerOpen(false);
                      }
                    }} style={styles.deleteBtn}>
                      <Trash2 size={16} color="#ef4444" />
                    </Pressable>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      )}
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
    backgroundColor: '#F4FAF6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 32,
  },
  subGreetingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10201a',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  askLivaContainer: {
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  askLivaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  askLivaInputBox: {
    flex: 1,
  },
  askLivaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  askLivaInputWrapper: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(52,199,89,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.12)',
  },
  askLivaInput: {
    flex: 1,
    fontSize: 12,
    color: '#000',
    padding: 0,
  },
  quickLogContainer: {
    marginBottom: 16,
    borderRadius: 28,
    backgroundColor: '#10b981',
    padding: 16,
    overflow: 'hidden',
  },
  quickLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickLogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF8F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10201a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  quickLogSub: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.78)',
  },
  quickLogPlus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLogActions: {
    flexDirection: 'row',
    gap: 8,
  },
  logActionButton: {
    flex: 1,
    minHeight: 90,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  logActionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logActionLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 24,
    borderRadius: 32,
    backgroundColor: '#fff',
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  sectionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  nutritionCard: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  nutritionLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 6,
  },
  nutritionCurrent: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
  nutritionTotal: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  waterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(52,199,89,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.2)',
  },
  waterBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34C759',
  },
  waterTracker: {
    flexDirection: 'row',
    gap: 4,
    height: 32,
    marginBottom: 24,
  },
  waterTick: {
    flex: 1,
    borderRadius: 6,
  },
  waterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waterBtnIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  waterBtnIconActive: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(52,199,89,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterBtnAdd: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  waterBtnAddText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mealsSection: {
    marginBottom: 20,
  },
  addText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34C759',
  },
  mealsList: {
    gap: 12,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 24,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  mealCardActive: {
    backgroundColor: '#fff',
  },
  mealIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  mealIconWrapperActive: {
    borderColor: '#34C759',
  },
  mealInfo: {
    flex: 1,
  },
  mealLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textActive: { color: '#000' },
  textInactive: { color: '#64748b' },
  mealStatus: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  textActiveMuted: { color: '#64748b' },
  textInactiveMuted: { color: 'rgba(100,116,139,0.5)' },
  mealTimeStats: {
    alignItems: 'flex-end',
  },
  mealTime: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  insightsSection: {
    marginBottom: 32,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  insightsIconBg: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  insightsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  insightsList: {
    gap: 12,
  },
  insightCard: {
    borderRadius: 32,
    backgroundColor: 'rgba(52,199,89,0.05)',
    padding: 16,
  },
  insightTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  insightIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTextWrapper: {
    flex: 1,
    paddingTop: 2,
  },
  insightCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  insightCardText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  insightActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 52,
    marginTop: 8,
  },
  insightActionText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 48,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  modalHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'capitalize',
    marginBottom: 24,
  },
  modalBody: {
    gap: 16,
  },
  modalEmpty: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748b',
    paddingVertical: 16,
  },
  modalMealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  modalMealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  modalMealStats: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  modalMealTime: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

