import React, { useState, useEffect, useRef, useMemo } from 'react';
import ScreenShell from './ScreenShell';
import { ink, green } from '../constants';
import { Screen, LoggedMeal } from '../types';

export default function ProgressMonthlyScreen({
  onBack,
  onNavigate,
  loggedMeals = [],
  goals = { calories: 1800, protein: 100 },
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  loggedMeals?: LoggedMeal[];
  goals?: any;
}) {
  const stats = useMemo(() => {
    const now = new Date();
    // Start of the month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let sumCalories = 0;
    let sumProtein = 0;
    let daysWithFood = new Set();

    // Food frequencies
    const foodCounts: Record<string, number> = {};

    loggedMeals.forEach((meal) => {
      const mealDate = new Date(parseInt(meal.id));
      if (mealDate >= startOfMonth) {
        sumCalories += meal.calories || 0;
        sumProtein += meal.protein || 0;
        daysWithFood.add(mealDate.toDateString());

        if (meal.foodName) {
          foodCounts[meal.foodName] = (foodCounts[meal.foodName] || 0) + 1;
        }
      }
    });

    const daysLogged = daysWithFood.size;
    const avgCalories =
      daysLogged > 0 ? Math.round(sumCalories / daysLogged) : 0;
    const avgProtein = daysLogged > 0 ? Math.round(sumProtein / daysLogged) : 0;

    // Top foods
    const topFoods = Object.entries(foodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count: `${count} times logged` }));

    // If no data, use some fallback
    if (topFoods.length === 0) {
      topFoods.push({ name: 'No foods logged yet', count: '-' });
    }

    return {
      avgCalories,
      avgProtein,
      healthyDays: daysLogged,
      topFoods,
    };
  }, [loggedMeals]);
  return (
    <ScreenShell
      title="Monthly Trends"
      subtitle="You've improved your consistency by 18% compared to last month."
      onBack={onBack}
    >
      <div className="space-y-5 pb-8">
        {/* Weight Trend Line Chart */}
        <div
          className="rounded-[28px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Weight Journey Trend
            </h3>
            <span className="text-xs font-bold text-[#f43f5e]">
              -1.2 kg this month
            </span>
          </div>
          {/* SVG Weight Line representation */}
          <div className="relative h-28 w-full border-b border-slate-100 dark:border-border">
            <svg className="w-full h-full" viewBox="0 0 200 80">
              <path
                d="M 10 70 L 40 66 L 80 62 L 120 58 L 160 55 L 190 52"
                fill="none"
                stroke={green}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {[70, 66, 62, 58, 55, 52].map((y, idx) => (
                <circle
                  key={idx}
                  cx={10 + idx * 36}
                  cy={y}
                  r="4.5"
                  fill="white"
                  stroke={green}
                  strokeWidth="2.5"
                />
              ))}
            </svg>
            <div className="flex justify-between text-[8px] text-muted-foreground mt-2 font-semibold">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border"
            style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
          >
            <span className="text-[10px] font-bold text-muted-foreground block">
              Average Calorie
            </span>
            <span
              className="text-base font-extrabold block mt-1 text-foreground"
              
            >
              {stats.avgCalories.toLocaleString()} kcal
            </span>
          </div>
          <div
            className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border"
            style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
          >
            <span className="text-[10px] font-bold text-muted-foreground block">
              Protein Average
            </span>
            <span className="text-base font-extrabold block mt-1 text-[#0EA5E9]">
              {stats.avgProtein}g / day
            </span>
          </div>
          <div
            className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border"
            style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
          >
            <span className="text-[10px] font-bold text-muted-foreground block">
              Water Average
            </span>
            <span className="text-base font-extrabold block mt-1 text-[#00c4b0]">
              1.2 L / day
            </span>
          </div>
          <div
            className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border"
            style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
          >
            <span className="text-[10px] font-bold text-muted-foreground block">
              Logged Days
            </span>
            <span className="text-base font-extrabold block mt-1 text-[#34C759]">
              {stats.healthyDays} days
            </span>
          </div>
          <div
            className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border"
            style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
          >
            <span className="text-[10px] font-bold text-muted-foreground block">
              Meal Consistency
            </span>
            <span
              className="text-base font-extrabold block mt-1 text-foreground"
              
            >
              86%
            </span>
          </div>
          <div
            className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border"
            style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
          >
            <span className="text-[10px] font-bold text-muted-foreground block">
              Skipped Breakfasts
            </span>
            <span className="text-base font-extrabold block mt-1 text-[#f43f5e]">
              3 days
            </span>
          </div>
        </div>

        {/* Favorite Foods Card */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Favorite Foods
          </h3>
          <div className="space-y-2">
            {stats.topFoods.map((food, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-border/50 pb-2"
              >
                <span className="font-bold text-foreground" >
                  {food.name}
                </span>
                <span className="text-muted-foreground font-semibold">
                  {food.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
