import { TrendingUp, Leaf, Calendar, MessageCircle, Award, Target , Activity} from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import BottomNav from "../components/layout/BottomNav";
import LivaAvatar from "../components/layout/LivaAvatar";
import ProgressRing from "../components/ui/ProgressRing";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";
import { getHealthScore } from "../utils";
import { GoalConfig } from "../types";

export default function ProgressDashboardScreen({
  onNavigate,
  userWeight,
  waterLogged,
  completedHabits,
  goals,
  caloriesLogged,
  loggedMealsCount,
}: {
  onNavigate: (screen: Screen) => void;
  userWeight: number;
  waterLogged: number;
  completedHabits: { [key: string]: boolean };
  goals: GoalConfig;
  caloriesLogged: number;
  proteinLogged?: number;
  loggedMealsCount: number;
}) {
  const habitCompletionRate = useMemo(() => {
    const total = 5;
    const completed = Object.values(completedHabits).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }, [completedHabits]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col" style={{ background: "#f7fffe" }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-24 pt-11 space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: ink }}>
            Your Progress
          </h1>
          <p className="mt-1 text-sm font-semibold" style={{ color: muted }}>
            Great work! You're building healthy habits.
          </p>
        </div>

        {/* Health Score Circular Indicator Card */}
        <div className="rounded-[28px] bg-white p-5 border border-[#34C759]/12 flex items-center justify-around" style={{ boxShadow: "0 8px 24px rgba(16,32,26,0.04)" }}>
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Health Score</span>
            <span className="text-4xl font-black block" style={{ color: ink }}>
              {getHealthScore(caloriesLogged, waterLogged, goals, completedHabits)}
              <span className="text-lg text-slate-400">/100</span>
            </span>
            <span 
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold inline-block"
              style={{
                background: getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 76 ? "#f2faf5" : getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 51 ? "#e0f2fe" : "#fff7ed",
                color: getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 76 ? "#197a38" : getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 51 ? "#0EA5E9" : "#ea580c"
              }}
            >
              {getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 76 ? "🟢 Excellent Progress" : getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 51 ? "🔵 Good Progress" : "🟠 Needs Attention"}
            </span>
          </div>

          {/* Core Nutrient Rings Row */}
          <div className="flex gap-2">
            <ProgressRing value={Math.round((caloriesLogged / (goals.calories || 2000)) * 100)} size={66} color={green} label="cal" />
            <ProgressRing value={Math.min(100, Math.round(((proteinLogged || 0) / (goals.protein || 100)) * 100))} size={66} color="#0EA5E9" label="protein" />
            <ProgressRing value={Math.round((waterLogged / (goals.water || 2500)) * 100)} size={66} color="#00C4B0" label="water" />
          </div>
        </div>

        {/* AI Insight Card from Liva */}
        <div className="rounded-[24px] p-4.5 bg-white border border-[#34C759]/14 flex gap-3" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <LivaAvatar size={38} floating />
          <div>
            <p className="text-xs font-extrabold text-[#197a38] uppercase tracking-wide">Liva Insight</p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: muted }}>
              You usually skip breakfast on Tuesdays. Eating a protein-rich breakfast may help maintain your energy levels throughout the day.
            </p>
          </div>
        </div>

        {/* Today's Summary Metrics Grid */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Today's Summary
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
              <span className="text-[10px] font-bold text-slate-400 block">Meals Logged</span>
              <span className="text-lg font-bold block mt-1" style={{ color: ink }}>{loggedMealsCount} meal{loggedMealsCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
              <span className="text-[10px] font-bold text-slate-400 block">Calories Consumed</span>
              <span className="text-lg font-bold block mt-1" style={{ color: green }}>{caloriesLogged} kcal</span>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
              <span className="text-[10px] font-bold text-slate-400 block">Water Intake</span>
              <span className="text-lg font-bold block mt-1" style={{ color: "#00c4b0" }}>{waterLogged} ml</span>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
              <span className="text-[10px] font-bold text-slate-400 block">Habit Streaks</span>
              <span className="text-lg font-bold block mt-1" style={{ color: ink }}>{habitCompletionRate}% done</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Analytics Modules
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onNavigate("progress-weekly")}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left border border-slate-100 hover:bg-[#f2faf5] transition-colors"
              style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}
            >
              <Activity size={18} className="text-[#34C759]" />
              <span className="text-xs font-bold" style={{ color: ink }}>Weekly Report</span>
            </button>
            <button
              onClick={() => onNavigate("progress-monthly")}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left border border-slate-100 hover:bg-[#f2faf5] transition-colors"
              style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}
            >
              <TrendingUp size={18} className="text-[#0ea5e9]" />
              <span className="text-xs font-bold" style={{ color: ink }}>Monthly Trend</span>
            </button>
            <button
              onClick={() => onNavigate("progress-nutrition")}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left border border-slate-100 hover:bg-[#f2faf5] transition-colors"
              style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}
            >
              <Leaf size={18} className="text-[#fb923c]" />
              <span className="text-xs font-bold" style={{ color: ink }}>Nutrition</span>
            </button>
            <button
              onClick={() => onNavigate("progress-weight")}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left border border-slate-100 hover:bg-[#f2faf5] transition-colors"
              style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}
            >
              <TrendingUp size={18} className="text-[#a855f7]" />
              <span className="text-xs font-bold" style={{ color: ink }}>Weight Log ({userWeight} kg)</span>
            </button>
            <button
              onClick={() => onNavigate("progress-habits")}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left border border-slate-100 hover:bg-[#f2faf5] transition-colors"
              style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}
            >
              <Calendar size={18} className="text-[#e11d48]" />
              <span className="text-xs font-bold" style={{ color: ink }}>Habits Heatmap</span>
            </button>
            <button
              onClick={() => onNavigate("progress-insights")}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left border border-slate-100 hover:bg-[#f2faf5] transition-colors"
              style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}
            >
              <MessageCircle size={18} className="text-amber-500" />
              <span className="text-xs font-bold" style={{ color: ink }}>AI Insights feed</span>
            </button>
            <button
              onClick={() => onNavigate("progress-achievements")}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left border border-slate-100 hover:bg-[#f2faf5] transition-colors"
              style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}
            >
              <Award size={18} className="text-indigo-500" />
              <span className="text-xs font-bold" style={{ color: ink }}>Achievements</span>
            </button>
            <button
              onClick={() => onNavigate("progress-goals")}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left border border-slate-100 hover:bg-[#f2faf5] transition-colors"
              style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}
            >
              <Target size={18} className="text-rose-500" />
              <span className="text-xs font-bold" style={{ color: ink }}>Goals Setup</span>
            </button>
          </div>
        </div>
      </div>
      <BottomNav active="progress" onNavigate={onNavigate} />
    </div>
  );
}
