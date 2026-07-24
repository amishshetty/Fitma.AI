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
  proteinLogged,
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
        <div className="rounded-[28px] bg-white p-4 sm:p-5 border border-slate-100 flex items-center justify-between gap-2 overflow-hidden" style={{ boxShadow: "0 8px 24px rgba(16,32,26,0.04)" }}>
          <div className="flex-1 space-y-2 min-w-[90px]">
            <span className="text-[10px] font-bold uppercase tracking-wider block truncate" style={{ color: "#94a3b8" }}>Health Score</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[38px] leading-none font-black text-slate-900 tracking-tight">
                {getHealthScore(caloriesLogged, waterLogged, goals, completedHabits)}
              </span>
              <span className="text-base font-bold" style={{ color: "#94a3b8" }}>/100</span>
            </div>
            
            {(() => {
              const score = getHealthScore(caloriesLogged, waterLogged, goals, completedHabits);
              let bg = "#e6f4fe";
              let text = "#2563eb";
              let dot = "#3b82f6";
              let label1 = "Good";
              let label2 = "Progress";
              
              if (score >= 76) {
                bg = "#f2faf5";
                text = "#197a38";
                dot = "#22c55e";
                label1 = "Excellent";
              } else if (score < 51) {
                bg = "#fff7ed";
                text = "#ea580c";
                dot = "#f97316";
                label1 = "Needs";
                label2 = "Attention";
              }

              return (
                <div 
                  className="inline-flex items-center gap-1.5 rounded-2xl px-2.5 py-1"
                  style={{ background: bg }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot, boxShadow: `0 1px 3px ${dot}80` }} />
                  <span className="text-[10px] font-bold leading-tight" style={{ color: text }}>
                    {label1}<br/>{label2}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Core Nutrient Rings Row */}
          <div className="flex gap-1.5 shrink-0 ml-1">
            <ProgressRing value={Math.round((caloriesLogged / (goals.calories || 2000)) * 100)} size={56} color={green} label="cal" />
            <ProgressRing value={Math.min(100, Math.round(((proteinLogged || 0) / (goals.protein || 100)) * 100))} size={56} color="#0EA5E9" label="protein" />
            <ProgressRing value={Math.round((waterLogged / (goals.water || 2500)) * 100)} size={56} color="#00C4B0" label="water" />
          </div>
        </div>

        {/* AI Insight Card from Liva */}
        <div className="rounded-[24px] p-4 bg-white border border-[#e4f4ea] flex gap-3.5" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.02)" }}>
          <div className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "radial-gradient(circle at top left, #f2faf5, #e4f4ea)" }}>
            <LivaAvatar size={26} floating />
          </div>
          <div className="pt-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#059669" }}>Liva Insight</p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
              You usually skip breakfast on Tuesdays. Eating a protein-rich breakfast may help maintain your energy levels throughout the day.
            </p>
          </div>
        </div>

        {/* Today's Summary Metrics Grid */}
        <div>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Today's Summary
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4 border border-slate-100" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Meals Logged</span>
              <span className="text-xl font-bold block" style={{ color: "#0f172a" }}>{loggedMealsCount} meal{loggedMealsCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-100" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Calories Consumed</span>
              <span className="text-xl font-bold block" style={{ color: "#10b981" }}>{caloriesLogged} kcal</span>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-100" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Water Intake</span>
              <span className="text-xl font-bold block" style={{ color: "#06b6d4" }}>{waterLogged} ml</span>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-100" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Habit Streaks</span>
              <span className="text-xl font-bold block" style={{ color: "#0f172a" }}>{habitCompletionRate}% done</span>
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
