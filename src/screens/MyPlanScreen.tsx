import { ChevronLeft, ChevronDown, ChevronRight, Sunrise, Sun, Moon, Coffee, Check, Flame, Droplets, Target, Zap, Activity } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import BottomNav from "../components/layout/BottomNav";
import { ink, muted } from "../constants";
import { Screen } from "../types";
import { quickOptions } from "../constants";
import { GoalConfig, LoggedMeal } from "../types";

export default function MyPlanScreen({
  onNavigate,
  loggedMeals = [],
  goals,
  history = {},
  syncDailyData
}: {
  onNavigate: (screen: Screen) => void;
  loggedMeals: LoggedMeal[];
  goals: GoalConfig;
  history?: Record<string, any>;
  syncDailyData?: (dateStr: string, updater: any) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMealDrawerOpen, setIsMealDrawerOpen] = useState(false);
  const [isWaterDrawerOpen, setIsWaterDrawerOpen] = useState(false);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0]);
  };

  const generatedDates = Array.from({length: 15}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 7 + i);
    return d;
  });

  const isToday = selectedDate === new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const selectedData = history[selectedDate] || {};
  const displayWater = selectedData.water || 0;
  
  const dailyGoalCal = goals?.calories || 2000;
  const dailyGoalWater = goals?.water || 2500;

  const dateObj = new Date(selectedDate + "T00:00:00");
  const targetStart = dateObj.getTime();
  const targetEnd = targetStart + 24 * 60 * 60 * 1000 - 1;

  const selectedDateMeals = loggedMeals.filter(m => {
    const time = parseInt(m.id);
    return time >= targetStart && time <= targetEnd;
  });

  let breakfastCalories = 0, breakfastProtein = 0;
  let lunchCalories = 0, lunchProtein = 0;
  let dinnerCalories = 0, dinnerProtein = 0;
  let snacksCalories = 0, snacksProtein = 0;

  selectedDateMeals.forEach(m => {
    const cal = m.calories || 0;
    const pro = m.protein || 0;
    if (m.mealType === 'breakfast') { breakfastCalories += cal; breakfastProtein += pro; }
    else if (m.mealType === 'lunch') { lunchCalories += cal; lunchProtein += pro; }
    else if (m.mealType === 'dinner') { dinnerCalories += cal; dinnerProtein += pro; }
    else if (m.mealType === 'snacks' || m.mealType === 'snack') { snacksCalories += cal; snacksProtein += pro; }
  });

  const displayCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col" style={{ background: "#f8f9fa" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <h1 className="text-[28px] font-bold" style={{ color: ink }}>My Plan</h1>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center justify-center gap-2 pb-6">
        <button onClick={() => changeDate(-1)} className="p-2 active:scale-90 transition-transform" style={{ color: muted }}><ChevronLeft size={18} /></button>
        <button onClick={() => setIsCalendarOpen(true)} className="flex items-center gap-1 active:opacity-70 transition-opacity">
          <span className="text-base font-bold" style={{ color: ink }}>
            {isToday ? "Today" : new Date(selectedDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
          <ChevronDown size={16} color={ink} />
        </button>
        <button onClick={() => changeDate(1)} disabled={isToday} className={`p-2 transition-transform ${isToday ? "opacity-30 cursor-not-allowed" : "active:scale-90"}`} style={{ color: muted }}><ChevronRight size={18} /></button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {/* Futuristic Daily Summary (Light Theme) */}
        <div 
          className="relative overflow-hidden rounded-[32px] p-6 mb-8 bg-white"
          style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.04)" }}
        >
          <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Breakfast', cal: breakfastCalories, pro: breakfastProtein, icon: <Sunrise size={18} className="text-[#FF8B6B]" /> },
              { label: 'Lunch', cal: lunchCalories, pro: lunchProtein, icon: <Sun size={18} className="text-[#FFD166]" /> },
              { label: 'Dinner', cal: dinnerCalories, pro: dinnerProtein, icon: <Moon size={18} className="text-[#118AB2]" /> },
              { label: 'Snacks', cal: snacksCalories, pro: snacksProtein, icon: <Coffee size={18} className="text-[#06D6A0]" /> }
            ].map((meal, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-[20px] bg-slate-50/50 p-3 border border-slate-100 shadow-sm backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50">
                  {meal.icon}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{meal.label}</p>
                  <p className="text-sm font-black text-slate-800 truncate">{meal.cal} <span className="text-[10px] font-medium text-slate-400">kcal</span></p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Intake</h2>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-3xl font-black leading-none text-slate-800">{displayCalories}</span>
                <span className="text-sm font-medium text-slate-400 mb-0.5">/ {dailyGoalCal} kcal</span>
              </div>
            </div>
            {/* Circular Progress Ring */}
            <div className="relative flex h-14 w-14 items-center justify-center">
              <svg className="h-full w-full -rotate-90 overflow-visible" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" className="stroke-slate-100" strokeWidth="4" />
                <circle 
                  cx="20" 
                  cy="20" 
                  r="16" 
                  fill="none" 
                  className="stroke-[#34C759]" 
                  strokeWidth="4" 
                  strokeDasharray="100.53" 
                  strokeDashoffset={100.53 - Math.min(100.53, (displayCalories / dailyGoalCal) * 100.53)} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity size={18} className="text-[#34C759]" />
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            {selectedDateMeals.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 p-4 text-center bg-slate-50/50">
                <p className="text-sm font-medium text-slate-400">No meals logged yet.</p>
              </div>
            ) : (
              selectedDateMeals.map(meal => (
                <div key={meal.id} className="rounded-2xl border border-slate-100 p-4 flex items-center justify-between bg-white transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                      {meal.mealType === 'breakfast' ? <Sunrise size={18} className="text-[#FF8B6B]" /> : 
                       meal.mealType === 'lunch' ? <Sun size={18} className="text-[#FFD166]" /> : 
                       meal.mealType === 'dinner' ? <Moon size={18} className="text-[#118AB2]" /> : 
                       <Coffee size={18} className="text-[#06D6A0]" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700 capitalize text-sm">{meal.mealType}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[120px]">{meal.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-700 text-sm">{meal.calories} kcal</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{meal.protein}g protein</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold" style={{ color: ink }}>Daily Goals</h2>
          <span className="text-xs font-bold" style={{ color: muted }}>
            0 / 5 <Check size={12} className="inline ml-0.5" />
          </span>
        </div>

        <div className="space-y-4">
          {/* Log Food Card */}
          <button 
            onClick={() => setIsMealDrawerOpen(true)}
            className="relative flex w-full items-center overflow-hidden rounded-[24px] bg-white text-left transition-transform active:scale-95" 
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
          >
            <div className="flex-1 p-5 pr-0">
              <div className="mb-2 h-6 w-6 rounded-full border-[2px] border-slate-100" />
              <h3 className="text-base font-bold text-slate-800">Log Your Food</h3>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Flame size={12} /> <span className="text-slate-800">{displayCalories}</span> /{dailyGoalCal} cal
              </p>
            </div>
            <div className="relative h-28 w-[140px]">
              <div className="absolute inset-0 rounded-l-[40px] bg-[#f9ebd6]" />
              <img src="/images/my_plan_food.jpg" alt="Food" className="absolute -left-4 top-1/2 w-28 -translate-y-1/2 rounded-full mix-blend-multiply" />
            </div>
          </button>

          {/* Log Water Card */}
          <button 
            onClick={() => setIsWaterDrawerOpen(true)}
            className="relative flex w-full items-center overflow-hidden rounded-[24px] bg-white text-left transition-transform active:scale-95" 
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
          >
            <div className="flex-1 p-5 pr-0">
              <div className="mb-2 h-6 w-6 rounded-full border-[2px] border-slate-100" />
              <h3 className="text-base font-bold text-slate-800">Log Water</h3>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Droplets size={12} /> <span className="text-slate-800">{displayWater}</span> /{dailyGoalWater}ml
              </p>
            </div>
            <div className="relative h-28 w-[140px]">
              <div className="absolute inset-0 rounded-l-[40px] bg-[#dcf2fe]" />
              <img src="/images/my_plan_water.jpg" alt="Water" className="absolute -left-4 top-1/2 w-28 -translate-y-1/2 rounded-full mix-blend-multiply" />
            </div>
          </button>

          {/* Log Weight Card */}
          <button 
            className="relative flex w-full items-center overflow-hidden rounded-[24px] bg-white text-left transition-transform active:scale-95" 
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
          >
            <div className="flex-1 p-5 pr-0">
              <div className="mb-2 h-6 w-6 rounded-full border-[2px] border-slate-100" />
              <h3 className="text-base font-bold text-slate-800">Log Weight</h3>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Target size={12} /> <span className="text-slate-800">0</span> kg
              </p>
            </div>
            <div className="relative h-28 w-[140px]">
              <div className="absolute inset-0 rounded-l-[40px] bg-[#f1f5f9]" />
              <img src="/images/my_plan_weight.jpg" alt="Weight" className="absolute -left-4 top-1/2 w-28 -translate-y-1/2 rounded-full mix-blend-multiply" />
            </div>
          </button>

          {/* Log Activities Card */}
          <div 
            className="relative flex w-full items-center overflow-hidden rounded-[24px] bg-slate-50 text-left opacity-90" 
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}
          >
            <div className="flex-1 p-5 pr-0">
              <div className="mb-2 h-6 w-6 rounded-full border-[2px] border-slate-200 bg-slate-100" />
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-700">Log Activities</h3>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">Coming Soon</span>
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Zap size={12} /> <span className="text-slate-500">Future Scope</span>
              </p>
            </div>
            <div className="relative h-28 w-[140px]">
              <div className="absolute inset-0 rounded-l-[40px] bg-[#fde9eb] opacity-60" />
              <img src="/images/my_plan_activities.jpg" alt="Activity" className="absolute -left-4 top-1/2 w-28 -translate-y-1/2 rounded-full mix-blend-multiply opacity-50 grayscale-[50%]" />
            </div>
          </div>
        </div>

      </div>
      <BottomNav active="log" onNavigate={onNavigate} />

      {/* Log Meal Drawer */}
      {isMealDrawerOpen && (
        <div 
          className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm transition-opacity overflow-hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setIsMealDrawerOpen(false); }}
        >
          <div className="animate-in slide-in-from-bottom-full flex w-full flex-col rounded-t-[32px] bg-white p-6 shadow-2xl pb-10">
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-200" />
            <h3 className="mb-2 text-center text-xl font-bold text-slate-900">Log Your Meal</h3>
            <p className="mb-6 text-center text-sm font-semibold text-slate-500">Choose how you want to track your food</p>
            
            <div className="space-y-3">
              {quickOptions.map((option, i) => {
                const Icon = option.icon;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setIsMealDrawerOpen(false);
                      if (option.title === "Ask Liva AI") {
                        onNavigate("liva-home");
                      } else if (option.title === "Voice Logging") {
                        onNavigate("voice-log");
                      } else if (option.title === "Camera Logging") {
                        onNavigate("camera-log");
                      } else if (option.title === "Search Food") {
                        onNavigate("text-log");
                      } else if (option.title === "Scan Barcode") {
                        onNavigate("camera-log");
                      }
                    }}
                    className="flex w-full items-center gap-4 rounded-[20px] border-[1.5px] border-slate-100 bg-white p-4 transition-transform active:scale-95 active:bg-slate-50"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${option.color}15`, color: option.color }}>
                      <Icon size={24} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-base font-bold text-slate-800">{option.title}</h4>
                      <p className="text-xs font-semibold text-slate-500">{option.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => setIsMealDrawerOpen(false)}
              className="mt-6 w-full rounded-[16px] bg-slate-100 py-4 font-bold text-slate-600 active:scale-95 transition-transform"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Log Water Drawer */}
      {isWaterDrawerOpen && (
        <div 
          className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm transition-opacity overflow-hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setIsWaterDrawerOpen(false); }}
        >
          <div className="animate-in slide-in-from-bottom-full flex w-full flex-col rounded-t-[32px] bg-white p-6 shadow-2xl pb-10">
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-200" />
            <h3 className="mb-2 text-center text-xl font-bold text-slate-900">Log Water</h3>
            <p className="mb-6 text-center text-sm font-semibold text-slate-500">Quickly add water to your daily goal</p>
            
            <div className="grid grid-cols-2 gap-3">
              {[250, 500, 750, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    if (syncDailyData) {
                      syncDailyData(selectedDate, (curr: any) => ({
                        water: Math.max(0, (curr.water || 0) + amount)
                      }));
                    }
                    setIsWaterDrawerOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-[20px] border-[1.5px] border-[#dcf2fe] bg-[#dcf2fe]/30 py-5 text-[#0ea5e9] transition-transform active:scale-95"
                >
                  <Droplets size={18} />
                  <span className="text-lg font-bold">{amount}ml</span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setIsWaterDrawerOpen(false)}
              className="mt-6 w-full rounded-[16px] bg-slate-100 py-4 font-bold text-slate-600 active:scale-95 transition-transform"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Futuristic Date Drawer */}
      {isCalendarOpen && (
        <div 
          className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm transition-opacity overflow-hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setIsCalendarOpen(false); }}
        >
          <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="animate-in slide-in-from-bottom-full flex h-[85%] w-full flex-col rounded-t-[32px] bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-200" />
            <h3 className="mb-6 text-center text-lg font-bold text-slate-900">Pick a Date</h3>
            
            {/* Days of week header */}
            <div className="grid grid-cols-7 mb-4 border-b border-slate-100 pb-3">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-slate-600">{day}</div>
              ))}
            </div>
            
            <div className="hide-scroll flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
              ].map((monthDate, mIndex) => {
                const year = monthDate.getFullYear();
                const month = monthDate.getMonth();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const firstDay = new Date(year, month, 1).getDay();
                
                const days = [];
                for (let i = 0; i < firstDay; i++) days.push(null);
                for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
                
                const monthName = monthDate.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
                
                return (
                  <div key={mIndex} className="mb-8">
                    <div className="text-center text-xs font-bold text-[#34C759] mb-4">{monthName}</div>
                    <div className="grid grid-cols-7 gap-y-4">
                      {days.map((d, i) => {
                        if (!d) return <div key={i} />;
                        
                        const y = d.getFullYear();
                        const mStr = String(d.getMonth() + 1).padStart(2, '0');
                        const dayStr = String(d.getDate()).padStart(2, '0');
                        const dateStr = `${y}-${mStr}-${dayStr}`;
                        
                        const today = new Date();
                        const tY = today.getFullYear();
                        const tM = String(today.getMonth() + 1).padStart(2, '0');
                        const tD = String(today.getDate()).padStart(2, '0');
                        const todayStr = `${tY}-${tM}-${tD}`;
                        
                        const isSelected = dateStr === selectedDate;
                        const isTodayDate = dateStr === todayStr;
                        
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(dateStr)}
                            className="flex justify-center items-center h-8"
                          >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${isSelected ? 'border-[1.5px] border-slate-900 text-slate-900 font-bold' : isTodayDate ? 'bg-[#34C759] text-white font-bold' : 'text-slate-500'}`}>
                              {d.getDate()}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setIsCalendarOpen(false)}
              className="mt-2 w-full rounded-[16px] bg-[#111] py-4 font-bold text-white active:scale-95 transition-transform"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
