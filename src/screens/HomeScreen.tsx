import { Mic, Camera, Keyboard, Bell, MessageCircle, Send, Plus, Sparkles, Droplets, Minus, Sunrise, Sun, Moon, Coffee, Leaf, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import BottomNav from "../components/layout/BottomNav";
import LivaAvatar from "../components/layout/LivaAvatar";
import ProgressRing from "../components/ui/ProgressRing";
import { ink, green, muted, softGreen } from "../constants";
import { Screen, EntryMode } from "../types";
import { getGreeting } from "../utils";
import { GoalConfig, LoggedMeal } from "../types";

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
}: {
  onNavigate: (screen: Screen) => void;
  onStartLog: (mode: EntryMode) => void;
  userName: string;
  caloriesLogged: number;
  proteinLogged: number;
  loggedMeals: LoggedMeal[];
  waterLogged: number;
  completedHabits: { [key: string]: boolean };
  goals: GoalConfig;
  onLogWater: (amount: number) => void;
  onDeleteMeal?: (mealId: string) => void;
}) {
  const [isMealDrawerOpen, setIsMealDrawerOpen] = useState(false);
  const [selectedMealCategory, setSelectedMealCategory] = useState<string | null>(null);
  const waterGlasses = Math.min(12, Math.round(waterLogged / 250));

  const calPercent = Math.min(100, Math.round((caloriesLogged / (goals?.calories || 2000)) * 100));
  const waterPercent = Math.min(100, Math.round((waterLogged / (goals?.water || 2500)) * 100));
  
  const proteinPercent = Math.min(100, Math.round((proteinLogged / (goals?.protein || 100)) * 100));

  const nutrition = [
    { 
      label: "Calories", 
      value: calPercent, 
      detail: `${(caloriesLogged || 0).toLocaleString()} / ${(goals?.calories || 2000).toLocaleString()}`, 
      color: green 
    },
    { 
      label: "Protein", 
      value: proteinPercent, 
      detail: `${proteinLogged}g / ${(goals?.protein || 100)}g`, 
      color: "#0EA5E9" 
    },
    { 
      label: "Water", 
      value: waterPercent, 
      detail: `${(waterLogged / 1000).toFixed(1)} / ${(goals?.water / 1000 || 2.5).toFixed(1)}L`, 
      color: "#00C4B0" 
    },
  ];
  const logActions = [
    { label: "Voice", icon: Mic, mode: "voice" as EntryMode, color: green, bg: "#ecfbf1" },
    { label: "Camera", icon: Camera, mode: "camera" as EntryMode, color: "#0EA5E9", bg: "#e9f7ff" },
    { label: "Text", icon: Keyboard, mode: "text" as EntryMode, color: "#7C3AED", bg: "#f3edff" },
  ];

  const getMealCategoryData = (category: string, defaultCal: string, defaultStatus: string) => {
    const categoryMeals = loggedMeals.filter(m => m.mealType === category);
    if (categoryMeals.length === 0) {
      return { calories: "0 kcal", status: "Not logged yet", active: false };
    }
    const totalCal = categoryMeals.reduce((sum, m) => sum + m.calories, 0);
    const names = categoryMeals.map(m => m.name).join(", ");
    return { calories: `${totalCal} kcal`, status: names, active: true };
  };

  const breakfastData = getMealCategoryData("breakfast", "360 kcal", "Pending");
  const lunchData = getMealCategoryData("lunch", "620 kcal", "Suggested");
  const dinnerData = getMealCategoryData("dinner", "720 kcal", "Pending");
  const snackData = getMealCategoryData("snack", "180 kcal", "Optional");

  const meals = [
    { label: "Breakfast", time: "8:30 AM", calories: breakfastData.calories, status: breakfastData.status, active: breakfastData.active },
    { label: "Lunch", time: "1:00 PM", calories: lunchData.calories, status: lunchData.status, active: lunchData.active },
    { label: "Dinner", time: "8:00 PM", calories: dinnerData.calories, status: dinnerData.status, active: dinnerData.active },
    { label: "Snack", time: "Anytime", calories: snackData.calories, status: snackData.status, active: snackData.active },
  ];
  const suggestions = ["You're low on protein.", "You usually eat lunch around 1 PM.", "Need dinner ideas?"];

  return (
    <div className="flex min-h-0 flex-1 flex-col" style={{ background: "linear-gradient(180deg, #e5fbf2 0%, #f7fffe 100%)" }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-5 pt-11">
        <section className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold leading-tight" style={{ color: ink }}>
                {getGreeting()}, {userName}
              </h1>
              <p className="mt-2 max-w-[250px] text-sm leading-relaxed" style={{ color: muted }}>
                Small wins today. Log meals quickly and let Liva keep the numbers tidy.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate("reminder-center")}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-slate-100/80"
                style={{ color: green, boxShadow: "0 4px 14px rgba(16,32,26,0.06)" }}
                aria-label="Notifications"
              >
                <Bell size={20} />
              </button>
              <LivaAvatar size={48} />
            </div>
          </div>
        </section>

        <section
          className="mb-4 rounded-[24px] bg-white/40 p-3.5"
          style={{
            boxShadow: "0 6px 20px rgba(16,32,26,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
          }}
        >
          <div className="flex items-center gap-3">
            <LivaAvatar size={38} floating />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold" style={{ color: ink }}>
                Ask Liva
              </p>
              <div
                className="mt-2 flex items-center gap-2 rounded-2xl bg-[#f2faf5]/50 px-3 py-2.5"
                style={{
                  border: "1px solid rgba(52,199,89,0.1)",
                }}
              >
                <MessageCircle size={16} color={green} />
                <input className="min-w-0 flex-1 bg-transparent text-xs outline-none" placeholder="What did you eat today?" />
                <Send size={15} color={green} />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-4 rounded-[28px] p-4" style={{ background: "linear-gradient(135deg, #34C759 0%, #00C4B0 100%)", boxShadow: "0 12px 30px rgba(52,199,89,0.24)" }}>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-white">Quick Log Meal</p>
              <p className="text-sm font-medium text-white/78">Under 15 seconds</p>
            </div>
            <button
              onClick={() => onNavigate("quick-log")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white"
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
                  className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-[20px] bg-white text-sm font-bold"
                  style={{ color: ink }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: action.bg, color: action.color }}>
                    <Icon size={23} />
                  </span>
                  {action.label}
                </motion.button>
              );
            })}
          </div>
        </section>

        <section className="mb-6 rounded-[32px] bg-white p-6" style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.04)" }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-black tracking-tight text-slate-800">
                Daily Nutrition
              </p>
              <p className="text-xs font-semibold text-slate-400">
                Compact overview
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100/60 shadow-sm">
              <Sparkles size={20} className="text-[#00C4B0]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {nutrition.map((item) => {
              const parts = item.detail.split('/');
              const current = parts[0]?.trim();
              const total = parts[1]?.trim();
              
              return (
                <div key={item.label} className="rounded-[24px] bg-slate-50/70 p-4 flex flex-col items-center justify-center border border-slate-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/60 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
                  
                  <div className="flex justify-center mb-4 relative z-10">
                    <ProgressRing value={item.value} size={64} color={item.color} />
                  </div>
                  
                  <div className="text-center relative z-10 flex flex-col items-center w-full">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      {item.label}
                    </p>
                    <p className="text-xs font-black text-slate-800">
                      {current}
                    </p>
                    {total && (
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                        / {total}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-8 rounded-[32px] bg-white p-6" style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.04)" }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-slate-800">
                Water Intake
              </p>
              <p className="text-xs font-medium text-slate-400">
                {Math.round(waterGlasses * 250)} ml logged today
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-[#f2faf5] px-3 py-1.5 border border-[#e9fbf7]">
              <Droplets size={16} className="text-[#00C4B0]" />
              <span className="text-sm font-bold text-[#00C4B0]">{waterGlasses}/12</span>
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
                className="flex-1 rounded-sm transition-all duration-300"
                style={{ 
                  background: index < waterGlasses ? "linear-gradient(180deg, #34C759, #00C4B0)" : "#f1f5f9",
                  opacity: index < waterGlasses ? 1 : 0.6
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onLogWater(-250)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 transition-colors active:bg-slate-100"
              aria-label="Decrease water"
            >
              <Minus size={20} />
            </button>
            <button
              onClick={() => onLogWater(250)}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all"
              style={{ background: "linear-gradient(135deg, #00C4B0, #34C759)", boxShadow: "0 8px 16px rgba(0, 196, 176, 0.2)" }}
            >
              <Droplets size={18} />
              Add 250 ml
            </button>
            <button
              onClick={() => onLogWater(250)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9fbf7]"
              aria-label="Increase water"
              style={{ color: "#009c8b" }}
            >
              <Plus size={18} />
            </button>
          </div>
        </section>

        <section className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold" style={{ color: ink }}>
              Today's Meals Timeline
            </h2>
            <button onClick={() => onNavigate("quick-log")} className="text-xs font-bold" style={{ color: green }}>
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
                className={`flex items-center gap-4 rounded-[24px] p-4 border transition-all ${meal.active ? 'bg-white border-transparent cursor-pointer active:scale-95' : 'bg-slate-50/50 border-slate-100'}`} 
                style={{ boxShadow: meal.active ? "0 8px 24px rgba(0,0,0,0.04)" : "none" }}
              >
                <div 
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-100 shadow-sm" 
                  style={{ color: meal.active ? green : muted }}
                >
                  {meal.label === 'Breakfast' ? <Sunrise size={20} /> : 
                   meal.label === 'Lunch' ? <Sun size={20} /> : 
                   meal.label === 'Dinner' ? <Moon size={20} /> : 
                   <Coffee size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold" style={{ color: meal.active ? ink : '#64748b' }}>
                    {meal.label}
                  </p>
                  <p className="mt-0.5 text-xs font-medium line-clamp-1" style={{ color: meal.active ? '#64748b' : '#94a3b8' }}>
                    {meal.status}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: meal.active ? ink : '#64748b' }}>
                    {meal.calories}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: muted }}>
                    {meal.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h2 className="mb-3 text-sm font-bold" style={{ color: ink }}>
            AI Suggestions
          </h2>
          <div className="space-y-2.5">
            {suggestions.map((suggestion) => (
              <div key={suggestion} className="flex items-center gap-3 rounded-2xl bg-white p-3" style={{ border: "1px solid rgba(52,199,89,0.12)" }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: softGreen, color: green }}>
                  <Sparkles size={15} />
                </span>
                <p className="text-xs font-semibold" style={{ color: ink }}>
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[26px] p-4" style={{ background: "linear-gradient(135deg, #e9faef, #ffffff)", border: "1px solid rgba(52,199,89,0.18)" }}>
          <div className="flex gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white" style={{ color: green }}>
              <Leaf size={21} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: ink }}>
                Daily Tip
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: muted }}>
                Pair carbs with protein at lunch to keep energy steady through the afternoon.
              </p>
            </div>
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
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 z-50 rounded-t-[32px] bg-white p-6 pb-12 shadow-2xl"
            >
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-200" />
              <h2 className="mb-6 text-2xl font-bold capitalize" style={{ color: ink }}>
                {selectedMealCategory} Details
              </h2>
              
              <div className="space-y-4">
                {loggedMeals.filter(m => m.mealType === selectedMealCategory).length === 0 ? (
                  <p className="text-center text-sm text-slate-500 py-4">No meals logged for this category.</p>
                ) : (
                  loggedMeals.filter(m => m.mealType === selectedMealCategory).map(m => (
                    <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                      <div>
                        <p className="font-bold text-sm" style={{ color: ink }}>{m.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{m.calories} kcal • {m.protein}g protein</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{m.timestamp}</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (onDeleteMeal) onDeleteMeal(m.id);
                          if (loggedMeals.filter(meal => meal.mealType === selectedMealCategory).length <= 1) {
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
