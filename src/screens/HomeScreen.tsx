import {
  Mic,
  Camera,
  Keyboard,
  Bell,
  MessageCircle,
  Send,
  Plus,
  Sparkles,
  Droplets,
  Minus,
  Sunrise,
  Sun,
  Moon,
  Coffee,
  Leaf,
  Trash2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import BottomNav from '../components/layout/BottomNav';
import LivaAvatar from '../components/layout/LivaAvatar';
import ProgressRing from '../components/ui/ProgressRing';
import { ink, green, muted, softGreen } from '../constants';
import { Screen, EntryMode } from '../types';
import { getGreeting } from '../utils';
import { GoalConfig, LoggedMeal } from '../types';

export default function HomeScreen({
  onNavigate,
  onStartLog,
  userName,
  caloriesLogged,
  proteinLogged,
  loggedMeals = [],
  waterLogged,
  completedHabits = {},
  goals,
  onLogWater,
  onDeleteMeal,
  onSetChatInitialMsg,
}: {
  onNavigate: (screen: Screen) => void;
  onStartLog: (mode: EntryMode) => void;
  userName: string;
  caloriesLogged: number;
  proteinLogged?: number;
  loggedMeals?: LoggedMeal[];
  waterLogged: number;
  completedHabits?: { [key: string]: boolean };
  goals: GoalConfig;
  onLogWater: (amount: number) => void;
  onDeleteMeal?: (mealId: string) => void;
  onSetChatInitialMsg?: (msg: string) => void;
}) {
  const [askLivaText, setAskLivaText] = useState('');
  const [isMealDrawerOpen, setIsMealDrawerOpen] = useState(false);
  const [selectedMealCategory, setSelectedMealCategory] = useState<
    string | null
  >(null);
  const waterGlasses = Math.min(12, Math.round(waterLogged / 250));

  const calPercent = Math.min(
    100,
    Math.round((caloriesLogged / (goals?.calories || 2000)) * 100)
  );
  const waterPercent = Math.min(
    100,
    Math.round((waterLogged / (goals?.water || 2500)) * 100)
  );

  const proteinPercent = Math.min(
    100,
    Math.round((proteinLogged / (goals?.protein || 100)) * 100)
  );

  const insights = useMemo(() => {
    const hour = new Date().getHours();
    const generated = [];

    const calTarget = goals?.calories || 2000;
    const protTarget = goals?.protein || 100;
    const calRemaining = Math.max(0, calTarget - caloriesLogged);
    const protRemaining = Math.max(0, protTarget - proteinLogged);

    // Check which meals are already logged
    const hasBreakfast = loggedMeals.some((m) => m.mealType === 'breakfast');
    const hasLunch = loggedMeals.some((m) => m.mealType === 'lunch');
    const hasDinner = loggedMeals.some((m) => m.mealType === 'dinner');

    // 1. Time-based Logic (Most immediate context)
    if (hour >= 17) {
      if (!hasDinner) {
        generated.push({
          id: 'time-dinner',
          icon: <Moon size={16} />,
          title: 'Evening Update',
          text:
            calRemaining > 800
              ? 'You have enough calories left. Enjoy a good dinner!'
              : 'Calories are low. Try a light dinner like soup or salad.',
          actionText: 'Log dinner',
          onClick: () => onStartLog('text'),
          color: '#00C4B0',
        });
      } else {
        generated.push({
          id: 'time-dinner-done',
          icon: <Moon size={16} />,
          title: 'Evening Update',
          text: 'Dinner is logged! Have a relaxing evening.',
          color: '#00C4B0',
        });
      }
    } else if (hour < 11) {
      if (!hasBreakfast) {
        generated.push({
          id: 'time-morning',
          icon: <Sunrise size={16} />,
          title: 'Morning Routine',
          text:
            waterGlasses < 3
              ? 'You need more water today. Drink a glass now!'
              : 'Start your day right with a healthy breakfast!',
          actionText: waterGlasses < 3 ? 'Add water' : 'Log breakfast',
          onClick:
            waterGlasses < 3 ? () => onLogWater(250) : () => onStartLog('text'),
          color: '#00C4B0',
        });
      } else {
        generated.push({
          id: 'time-morning-done',
          icon: <Sunrise size={16} />,
          title: 'Morning Routine',
          text:
            waterGlasses < 3
              ? 'You need more water today. Drink a glass now!'
              : 'Great start today! Keep up the good work.',
          actionText: waterGlasses < 3 ? 'Add water' : 'Log snack',
          onClick:
            waterGlasses < 3 ? () => onLogWater(250) : () => onStartLog('text'),
          color: '#00C4B0',
        });
      }
    } else {
      if (!hasLunch) {
        generated.push({
          id: 'time-lunch',
          icon: <Sun size={16} />,
          title: 'Mid-day Check',
          text:
            caloriesLogged < calTarget * 0.3
              ? "You've barely eaten today! Make sure to grab a nutritious lunch."
              : 'Time for lunch! Refuel your body.',
          actionText: 'Log lunch',
          onClick: () => onStartLog('text'),
          color: '#00C4B0',
        });
      } else {
        generated.push({
          id: 'time-lunch-done',
          icon: <Sun size={16} />,
          title: 'Mid-day Check',
          text: "You're doing great on your meals! A quick walk can give you a mid-day energy boost.",
          color: '#00C4B0',
        });
      }
    }

    // 2. Macro Logic
    if (proteinPercent < calPercent - 15) {
      generated.push({
        id: 'macro-protein',
        icon: <Sparkles size={16} />,
        title: 'Protein Check',
        text: `You need ${protRemaining}g more protein, but only have ${calRemaining} calories left. Try to eat lean meat.`,
        actionText: 'High-protein snacks',
        onClick: () => onNavigate('liva-home'),
        color: '#0EA5E9',
      });
    } else {
      generated.push({
        id: 'macro-track',
        icon: <Sparkles size={16} />,
        title: 'Macro Balance',
        text: 'Your protein and calories look great today. Keep it up! 💪',
        color: '#0EA5E9',
      });
    }

    // 3. Weekly Fat Trend Nudge
    generated.push({
      id: 'trend-fat',
      icon: <Zap size={16} />,
      title: 'Weekly Trend',
      text: 'You ate a lot of fats this week. Try eating more veggies today. 🌱',
      actionText: 'Get light recipes',
      onClick: () => onNavigate('liva-home'),
      color: '#34C759',
    });

    return generated.slice(0, 3);
  }, [
    caloriesLogged,
    proteinLogged,
    waterGlasses,
    goals,
    proteinPercent,
    calPercent,
    onNavigate,
    onStartLog,
    onLogWater,
  ]);

  const nutrition = [
    {
      label: 'Calories',
      value: calPercent,
      detail: `${(caloriesLogged || 0).toLocaleString()} / ${(goals?.calories || 2000).toLocaleString()}`,
      color: green,
    },
    {
      label: 'Protein',
      value: proteinPercent,
      detail: `${proteinLogged}g / ${goals?.protein || 100}g`,
      color: '#0EA5E9',
    },
    {
      label: 'Water',
      value: waterPercent,
      detail: `${(waterLogged / 1000).toFixed(1)} / ${(goals?.water / 1000 || 2.5).toFixed(1)}L`,
      color: '#00C4B0',
    },
  ];
  const logActions = [
    {
      label: 'Voice',
      icon: Mic,
      mode: 'voice' as EntryMode,
      color: '#86efac',
      bg: 'rgba(0,0,0,0.28)',
    },
    {
      label: 'Camera',
      icon: Camera,
      mode: 'camera' as EntryMode,
      color: '#7dd3fc',
      bg: 'rgba(0,0,0,0.28)',
    },
    {
      label: 'Text',
      icon: Keyboard,
      mode: 'text' as EntryMode,
      color: '#d8b4fe',
      bg: 'rgba(0,0,0,0.28)',
    },
  ];

  const getMealCategoryData = (
    category: string,
    defaultCal: string,
    defaultStatus: string
  ) => {
    const categoryMeals = loggedMeals.filter((m) => m.mealType === category);
    if (categoryMeals.length === 0) {
      return { calories: '0 kcal', status: 'Not logged yet', active: false };
    }
    const totalCal = categoryMeals.reduce((sum, m) => sum + m.calories, 0);
    const names = categoryMeals.map((m) => m.name).join(', ');
    return { calories: `${totalCal} kcal`, status: names, active: true };
  };

  const breakfastData = getMealCategoryData('breakfast', '360 kcal', 'Pending');
  const lunchData = getMealCategoryData('lunch', '620 kcal', 'Suggested');
  const dinnerData = getMealCategoryData('dinner', '720 kcal', 'Pending');
  const snackData = getMealCategoryData('snack', '180 kcal', 'Optional');

  const meals = [
    {
      label: 'Breakfast',
      time: '8:30 AM',
      calories: breakfastData.calories,
      status: breakfastData.status,
      active: breakfastData.active,
    },
    {
      label: 'Lunch',
      time: '1:00 PM',
      calories: lunchData.calories,
      status: lunchData.status,
      active: lunchData.active,
    },
    {
      label: 'Dinner',
      time: '8:00 PM',
      calories: dinnerData.calories,
      status: dinnerData.status,
      active: dinnerData.active,
    },
    {
      label: 'Snack',
      time: 'Anytime',
      calories: snackData.calories,
      status: snackData.status,
      active: snackData.active,
    },
  ];

  return (
    <div
      className="flex min-h-0 flex-1 flex-col bg-background transition-colors duration-200"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)',
      }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-5">
        <section className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-bold leading-tight text-foreground"
                
              >
                {getGreeting()}, {userName}
              </h1>
              <p
                className="mt-2 max-w-[250px] text-sm leading-relaxed text-muted-foreground"
                
              >
                Small wins today. Log meals quickly and let Liva keep the
                numbers tidy.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('reminder-center')}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-card-foreground border border-slate-100 dark:border-border/80"
                style={{
                  color: green,
                  boxShadow: '0 4px 14px rgba(16,32,26,0.06)',
                }}
                aria-label="Notifications"
              >
                <Bell size={20} />
              </button>
              <LivaAvatar size={48} />
            </div>
          </div>
        </section>

        <section
          className="mb-4 rounded-[24px] bg-card/40 text-card-foreground p-3.5 cursor-pointer hover:bg-card/60 transition-colors border border-slate-100 dark:border-border/50 shadow-sm backdrop-blur-xl"
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName !== 'INPUT') {
              if (askLivaText.trim()) {
                if (onSetChatInitialMsg) onSetChatInitialMsg(askLivaText);
                onNavigate('liva-home');
              }
            }
          }}
        >
          <div className="flex items-center gap-3">
            <LivaAvatar size={38} floating />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground" >
                Ask Liva
              </p>
              <div
                className="mt-2 flex items-center gap-2 rounded-2xl bg-[#f2faf5]/80 dark:bg-black/30 px-3 py-2.5"
                style={{
                  border: '1px solid rgba(52,199,89,0.15)',
                }}
              >
                <MessageCircle size={16} color={green} />
                <input
                  className="min-w-0 flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
                  placeholder="What did you eat today?"
                  value={askLivaText}
                  onChange={(e) => setAskLivaText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (askLivaText.trim()) {
                        if (onSetChatInitialMsg)
                          onSetChatInitialMsg(askLivaText);
                        onNavigate('liva-home');
                      }
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (askLivaText.trim()) {
                      if (onSetChatInitialMsg) onSetChatInitialMsg(askLivaText);
                      onNavigate('liva-home');
                    }
                  }}
                  className="p-1 hover:bg-[#34C759]/10 rounded-full transition-colors"
                >
                  <Send size={15} color={green} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mb-4 rounded-[28px] p-4"
          style={{
            background: 'linear-gradient(135deg, #34C759 0%, #00C4B0 100%)',
            boxShadow: '0 12px 30px rgba(52,199,89,0.24)',
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-white">Quick Log Meal</p>
              <p className="text-sm font-medium text-white/78">
                Under 15 seconds
              </p>
            </div>
            <button
              onClick={() => onNavigate('quick-log')}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ background: 'rgba(0,0,0,0.20)' }}
              aria-label="Open quick log"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {logActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onStartLog(action.mode)}
                  className="flex min-h-[90px] flex-col items-center justify-center gap-2 p-3 rounded-[20px] text-white text-sm font-bold backdrop-blur-sm transition-colors shadow-sm text-center"
                  style={{ background: 'rgba(0,0,0,0.20)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.30)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.20)')}
                >
                  <span
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden"
                    style={{ background: action.bg, color: action.color }}
                  >
                    <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                      <Icon size={23} />
                    </div>
                  </span>
                  <span className="w-full text-center leading-none">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section
          className="mb-6 rounded-[32px] bg-card text-card-foreground p-6 border border-slate-100 dark:border-border"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-black tracking-tight text-foreground">
                Daily Nutrition
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                Compact overview
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Sparkles size={20} className="text-primary" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {nutrition.map((item) => {
              const parts = item.detail.split('/');
              const current = parts[0]?.trim();
              const total = parts[1]?.trim();

              return (
                <div
                  key={item.label}
                  className="rounded-[24px] bg-slate-50 dark:bg-muted p-4 flex flex-col items-center justify-center border border-slate-100 dark:border-border relative overflow-hidden"
                >
                  <div className="flex justify-center mb-4 relative z-10">
                    <ProgressRing
                      value={item.value}
                      size={64}
                      color={item.color}
                    />
                  </div>

                  <div className="text-center relative z-10 flex flex-col items-center w-full">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      {item.label}
                    </p>
                    <p className="text-xs font-black text-foreground">
                      {current}
                    </p>
                    {total && (
                      <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                        / {total}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          className="mb-8 rounded-[32px] bg-card text-card-foreground p-6 border border-slate-100 dark:border-border"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">Water Intake</p>
              <p className="text-xs font-medium text-muted-foreground">
                {Math.round(waterGlasses * 250)} ml logged today
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 border border-primary/20">
              <Droplets size={16} className="text-primary" />
              <span className="text-sm font-bold text-primary">
                {waterGlasses}/12
              </span>
            </div>
          </div>

          <div className="mb-6 flex gap-1 justify-between h-8">
            {Array.from({ length: 12 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const targetVal = (index + 1) * 250;
                  onLogWater(targetVal - waterLogged);
                }}
                aria-label={`Set water intake to ${(index + 1) * 250} ml`}
                className={`flex-1 rounded-md transition-all duration-300 ${index < waterGlasses ? '' : 'bg-slate-50 dark:bg-muted'}`}
                style={{
                  opacity: index < waterGlasses ? 1 : 0.6,
                  background: index < waterGlasses ? 'linear-gradient(135deg, #34C759 0%, #00C4B0 100%)' : undefined
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onLogWater(-250)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-muted border border-slate-100 dark:border-border text-muted-foreground transition-colors active:bg-slate-50 dark:active:bg-muted"
              aria-label="Decrease water"
            >
              <Minus size={20} />
            </button>
            <button
              onClick={() => onLogWater(250)}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #34C759 0%, #00C4B0 100%)' }}
            >
              <Droplets size={18} />
              Add 250 ml
            </button>
            <button
              onClick={() => onLogWater(250)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
              aria-label="Increase water"
            >
              <Plus size={18} />
            </button>
          </div>
        </section>

        <section className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground" >
              Today's Meals Timeline
            </h2>
            <button
              onClick={() => onNavigate('quick-log')}
              className="text-xs font-bold text-primary"
            >
              Add
            </button>
          </div>
          <div className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.label}
                onClick={() => {
                  if (meal.active) {
                    setSelectedMealCategory(meal.label.toLowerCase());
                    setIsMealDrawerOpen(true);
                  }
                }}
                className={`flex items-center gap-4 rounded-[24px] p-4 border transition-all ${meal.active ? 'bg-card text-card-foreground border-slate-100 dark:border-border cursor-pointer active:scale-95' : 'bg-slate-50 dark:bg-muted border-slate-100 dark:border-border'}`}
              >
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-background border border-slate-100 dark:border-border ${meal.active ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {meal.label === 'Breakfast' ? (
                    <Sunrise size={20} />
                  ) : meal.label === 'Lunch' ? (
                    <Sun size={20} />
                  ) : meal.label === 'Dinner' ? (
                    <Moon size={20} />
                  ) : (
                    <Coffee size={20} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-bold ${meal.active ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {meal.label}
                  </p>
                  <p
                    className={`mt-0.5 text-xs font-medium line-clamp-1 ${meal.active ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}
                  >
                    {meal.status}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-sm font-bold ${meal.active ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {meal.calories}
                  </p>
                  <p
                    className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    
                  >
                    {meal.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 relative">
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="bg-card text-card-foreground rounded-full p-1.5 flex items-center justify-center border border-slate-100 dark:border-border">
              <Sparkles size={14} className="text-primary" />
            </div>
            <h2 className="text-[15px] font-bold text-foreground">
              Liva's Active Analysis
            </h2>
          </div>

          <div className="space-y-3 relative z-10">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-500/10 to-transparent dark:from-emerald-500/5 p-4 shadow-sm"
              >
                <div className="relative z-10 flex flex-col gap-2.5">
                  <div className="flex gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-card shadow-sm"
                      style={{ color: insight.color }}
                    >
                      {insight.icon}
                    </span>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p
                        className="text-[13px] font-bold mb-0.5"
                        style={{ color: insight.color }}
                      >
                        {insight.title}
                      </p>
                      <p className="text-[13px] leading-snug text-muted-foreground pr-2">
                        {insight.text}
                      </p>
                    </div>
                  </div>
                  {insight.actionText && insight.onClick && (
                    <button
                      onClick={insight.onClick}
                      className="self-start ml-[52px] flex items-center gap-1.5 text-[12px] font-bold transition-all px-4 py-1.5 rounded-full bg-white dark:bg-card shadow-sm hover:scale-95"
                      style={{ color: insight.color }}
                    >
                      {insight.actionText}
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <BottomNav active="home" onNavigate={onNavigate} />
      {/* Meal Details Drawer */}
      <AnimatePresence>
        {isMealDrawerOpen && selectedMealCategory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMealDrawerOpen(false)}
              className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 z-50 rounded-t-[32px] bg-card text-card-foreground p-6 pb-12 shadow-2xl"
            >
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-border" />
              <h2
                className="mb-6 text-2xl font-bold capitalize text-foreground"
                
              >
                {selectedMealCategory} Details
              </h2>

              <div className="space-y-4">
                {loggedMeals.filter((m) => m.mealType === selectedMealCategory)
                  .length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No meals logged for this category.
                  </p>
                ) : (
                  loggedMeals
                    .filter((m) => m.mealType === selectedMealCategory)
                    .map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-border bg-slate-50 dark:bg-muted"
                      >
                        <div>
                          <p
                            className="font-bold text-sm text-foreground"
                            
                          >
                            {m.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {m.calories} kcal • {m.protein}g protein
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {m.timestamp}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (onDeleteMeal) onDeleteMeal(m.id);
                            if (
                              loggedMeals.filter(
                                (meal) => meal.mealType === selectedMealCategory
                              ).length <= 1
                            ) {
                              setIsMealDrawerOpen(false);
                            }
                          }}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 active:scale-95 transition-transform"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
