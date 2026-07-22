import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen, LoggedMeal } from "../types";

export default function ProgressWeeklyScreen({ 
  onBack, 
  onNavigate,
  loggedMeals = [],
  goals = { calories: 1800, protein: 100 }
}: { 
  onBack: () => void; 
  onNavigate: (screen: Screen) => void;
  loggedMeals?: LoggedMeal[];
  goals?: any;
}) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  
  const stats = useMemo(() => {
    const dailyTotals = [0, 0, 0, 0, 0, 0, 0];
    const dailyProtein = [0, 0, 0, 0, 0, 0, 0];
    
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0,0,0,0);

    loggedMeals.forEach(meal => {
      const mealDate = new Date(parseInt(meal.id));
      if (mealDate >= monday) {
        const dayIdx = (mealDate.getDay() + 6) % 7;
        dailyTotals[dayIdx] += meal.calories || 0;
        dailyProtein[dayIdx] += meal.protein || 0;
      }
    });

    let goalsMet = 0;
    let proteinMet = 0;
    let sumCalories = 0;
    let healthiestIdx = 0;
    let closestToGoalDiff = 99999;
    let currentStreak = 0;
    let daysWithFood = 0;

    for (let i = 0; i <= dayOfWeek; i++) {
      if (dailyTotals[i] > 0) {
        sumCalories += dailyTotals[i];
        daysWithFood++;
      }
      
      const metGoal = dailyTotals[i] > 0 && dailyTotals[i] <= goals.calories + 100 && dailyTotals[i] >= goals.calories - 400;
      if (metGoal) {
        goalsMet++;
        currentStreak++;
      } else {
        currentStreak = 0;
      }

      if (dailyProtein[i] >= (goals.protein || 100)) {
        proteinMet++;
      }

      const diff = Math.abs(dailyTotals[i] - goals.calories);
      if (dailyTotals[i] > 0 && diff < closestToGoalDiff) {
        closestToGoalDiff = diff;
        healthiestIdx = i;
      }
    }

    const avgCalories = daysWithFood > 0 ? Math.round(sumCalories / daysWithFood) : 0;
    const dayNamesFull = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return {
      trend: dailyTotals,
      goalsMet,
      streak: currentStreak,
      avgCalories,
      proteinMet,
      healthiestDay: sumCalories > 0 ? dayNamesFull[healthiestIdx] : "N/A"
    };
  }, [loggedMeals, goals]);

  return (
    <ScreenShell
      title="This Week"
      subtitle={`Excellent week! You met your calorie goal on ${stats.goalsMet} out of 7 days.`}
      onBack={onBack}
      footer={<PrimaryButton onClick={() => onNavigate("progress-monthly")}>View Monthly Insights</PrimaryButton>}
    >
      <div className="space-y-5 pb-8">
        {/* Calorie Trend Bar Graph */}
        <div className="rounded-[28px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Daily Calorie Consumption</h3>
          <div className="flex h-36 items-end justify-between px-2 pt-2">
            {stats.trend.map((kcal, index) => {
              const maxKcal = Math.max(2800, goals.calories * 1.2);
              const percent = Math.min(100, Math.round((kcal / maxKcal) * 100));
              const isOverGoal = kcal > goals.calories + 100;
              return (
                <div key={index} className="flex flex-col items-center gap-2 w-8 text-center">
                  <span className="text-[8px] font-bold text-slate-400">{kcal > 0 ? kcal : ""}</span>
                  <div className="w-full bg-[#f2faf5] rounded-full h-24 relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500 ease-out"
                      style={{ height: `${percent}%`, background: isOverGoal ? "#fb923c" : green }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{days[index]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlights Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">🏆 Longest Streak</span>
            <span className="text-lg font-black block mt-1.5" style={{ color: ink }}>{stats.streak} Days</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">🥗 Healthiest Day</span>
            <span className="text-lg font-black block mt-1.5 text-[#34C759]">{stats.healthiestDay}</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">🔥 Average Calories</span>
            <span className="text-lg font-black block mt-1.5" style={{ color: ink }}>{stats.avgCalories.toLocaleString()} kcal</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">💪 Protein Goal Met</span>
            <span className="text-lg font-black block mt-1.5 text-[#0EA5E9]">{stats.proteinMet} / 7 Days</span>
          </div>
        </div>

        {/* Liva Coaching Summary */}
        <div className="rounded-[24px] p-4.5 bg-white border border-[#34C759]/16 flex gap-3" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <LivaAvatar size={38} floating />
          <div>
            <p className="text-xs font-bold text-[#197a38] uppercase tracking-wide">Liva Weekly Summary</p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: muted }}>
              {stats.goalsMet > 4 
                ? `You stayed within your calorie goal on ${stats.goalsMet} of the last 7 days. Great consistency! Keep up the good work and maintain this momentum.`
                : stats.goalsMet > 0 
                ? `You hit your calorie goals on ${stats.goalsMet} days this week. Focus on making small sustainable choices for the remaining days.`
                : `You haven't hit your calorie goals this week yet. Start fresh tomorrow by planning your meals ahead!`}
            </p>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
