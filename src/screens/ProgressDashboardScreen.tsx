import {
  TrendingUp,
  Leaf,
  Calendar,
  MessageCircle,
  Award,
  Target,
  Activity,
  Flame,
} from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import BottomNav from '../components/layout/BottomNav';
import LivaAvatar from '../components/layout/LivaAvatar';
import ProgressRing from '../components/ui/ProgressRing';
import { ink, green, muted } from '../constants';
import { Screen } from '../types';
import { getHealthScore } from '../utils';
import { GoalConfig } from '../types';

export default function ProgressDashboardScreen({
  onNavigate,
  userWeight,
  waterLogged,
  completedHabits,
  goals,
  caloriesLogged,
  proteinLogged,
  loggedMealsCount,
  history,
  todaysLoggedMeals,
}: {
  onNavigate: (screen: Screen) => void;
  userWeight: number;
  waterLogged: number;
  completedHabits: { [key: string]: boolean };
  goals: GoalConfig;
  caloriesLogged: number;
  proteinLogged?: number;
  loggedMealsCount: number;
  history?: Record<string, any>;
  todaysLoggedMeals?: any[];
}) {
  const habitCompletionRate = useMemo(() => {
    const total = 5;
    const completed = Object.values(completedHabits).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }, [completedHabits]);

  const [activeChartTab, setActiveChartTab] = useState('Today');
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(
    null
  );
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);

  const handleBarTap = (index: number) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    if (activeTooltipIndex === index) {
      setActiveTooltipIndex(null);
    } else {
      setActiveTooltipIndex(index);
      tooltipTimeoutRef.current = setTimeout(() => {
        setActiveTooltipIndex(null);
      }, 4000);
    }
  };

  const chartData = useMemo(() => {
    const data = [];
    let maxKcal = 500;

    if (activeChartTab === 'Week') {
      const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0];
        const dayData = history?.[dateStr] || {};
        const p = dayData.protein || 0;
        const c = dayData.carbs || 0;
        const f = dayData.fat || 0;
        const kcal = dayData.calories || 0;

        if (kcal > maxKcal) maxKcal = kcal;
        data.push({ day: days[d.getDay()], p, c, f, kcal });
      }
    } else if (activeChartTab === 'Month') {
      const labels = ['W1', 'W2', 'W3', 'W4'];
      for (let w = 3; w >= 0; w--) {
        let p = 0,
          c = 0,
          f = 0,
          kcal = 0;
        for (let i = 0; i < 7; i++) {
          const daysAgo = w * 7 + i;
          const d = new Date(Date.now() - daysAgo * 86400000);
          const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];
          const dayData = history?.[dateStr] || {};
          p += dayData.protein || 0;
          c += dayData.carbs || 0;
          f += dayData.fat || 0;
          kcal += dayData.calories || 0;
        }
        p = Math.round(p / 7);
        c = Math.round(c / 7);
        f = Math.round(f / 7);
        kcal = Math.round(kcal / 7);

        if (kcal > maxKcal) maxKcal = kcal;
        data.push({ day: labels[3 - w], p, c, f, kcal });
      }
    } else if (activeChartTab === 'Today') {
      const mealTypes = [
        { key: 'breakfast', label: 'B' },
        { key: 'lunch', label: 'L' },
        { key: 'snack', label: 'S' },
        { key: 'dinner', label: 'D' },
      ];

      mealTypes.forEach(({ key, label }) => {
        let p = 0,
          c = 0,
          f = 0,
          kcal = 0;
        if (todaysLoggedMeals) {
          todaysLoggedMeals.forEach((m) => {
            if (m.mealType === key) {
              p += m.protein || 0;
              c += m.carbs || 0;
              f += m.fat || 0;
              kcal += m.calories || 0;
            }
          });
        }

        if (kcal > maxKcal) maxKcal = kcal;
        data.push({ day: label, p, c, f, kcal });
      });
    }

    // Add 35% vertical buffer so the tallest bar never hits the top, leaving room for the tooltip
    maxKcal = Math.ceil((maxKcal * 1.35) / 100) * 100;
    if (maxKcal < 500) maxKcal = 500;

    const yAxisLabels = [
      maxKcal,
      Math.round(maxKcal * 0.75),
      Math.round(maxKcal * 0.5),
      Math.round(maxKcal * 0.25),
      0,
    ];

    let displayMetric = 0;
    if (activeChartTab === 'Week' || activeChartTab === 'Today') {
      displayMetric = caloriesLogged;
    } else if (activeChartTab === 'Month') {
      displayMetric = Math.round(
        data.reduce((acc, curr) => acc + curr.kcal, 0) / 4
      );
    }

    return { data, maxKcal, yAxisLabels, displayMetric };
  }, [history, todaysLoggedMeals, activeChartTab, caloriesLogged]);

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col bg-background"
      style={{ 
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)'
      }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-24 space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-extrabold text-foreground" >
            Your Progress
          </h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground" >
            Great work! You're building healthy habits.
          </p>
        </div>

        {/* Health Score Circular Indicator Card */}
        <div
          className="rounded-[28px] bg-card text-card-foreground p-4 sm:p-5 border border-slate-100 dark:border-border flex items-center justify-between gap-2 overflow-hidden"
          style={{ boxShadow: '0 8px 24px rgba(16,32,26,0.04)' }}
        >
          <div className="flex-1 space-y-2 min-w-[90px]">
            <span
              className="text-[10px] font-bold uppercase tracking-wider block truncate"
              style={{ color: '#94a3b8' }}
            >
              Health Score
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[38px] leading-none font-black text-foreground tracking-tight">
                {getHealthScore(
                  caloriesLogged,
                  waterLogged,
                  goals,
                  completedHabits
                )}
              </span>
              <span
                className="text-base font-bold"
                style={{ color: '#94a3b8' }}
              >
                /100
              </span>
            </div>

            {(() => {
              const score = getHealthScore(
                caloriesLogged,
                waterLogged,
                goals,
                completedHabits
              );
              let bgClass = 'bg-[#e6f4fe] dark:bg-[#e6f4fe]/10';
              let textClass = 'text-[#2563eb] dark:text-[#60a5fa]';
              let dot = '#3b82f6';
              let label1 = 'Good';
              let label2 = 'Progress';

              if (score >= 76) {
                bgClass = 'bg-[#f2faf5] dark:bg-primary/10';
                textClass = 'text-[#197a38] dark:text-primary';
                dot = '#22c55e';
                label1 = 'Excellent';
              } else if (score < 51) {
                bgClass = 'bg-[#fff7ed] dark:bg-[#ea580c]/10';
                textClass = 'text-[#ea580c] dark:text-[#fb923c]';
                dot = '#f97316';
                label1 = 'Needs';
                label2 = 'Attention';
              }

              return (
                <div
                  className={`inline-flex items-center gap-1.5 rounded-2xl px-2.5 py-1 ${bgClass}`}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: dot, boxShadow: `0 1px 3px ${dot}80` }}
                  />
                  <span
                    className={`text-[10px] font-bold leading-tight ${textClass}`}
                  >
                    {label1}
                    <br />
                    {label2}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Core Nutrient Rings Row */}
          <div className="flex gap-1.5 shrink-0 ml-1">
            <ProgressRing
              value={Math.round(
                (caloriesLogged / (goals.calories || 2000)) * 100
              )}
              size={56}
              color={green}
              label="cal"
            />
            <ProgressRing
              value={Math.min(
                100,
                Math.round(
                  ((proteinLogged || 0) / (goals.protein || 100)) * 100
                )
              )}
              size={56}
              color="#0EA5E9"
              label="protein"
            />
            <ProgressRing
              value={Math.round((waterLogged / (goals.water || 2500)) * 100)}
              size={56}
              color="#00C4B0"
              label="water"
            />
          </div>
        </div>

        {/* AI Insight Card from Liva */}
        <div
          className="rounded-[24px] p-4 bg-card text-card-foreground border border-[#e4f4ea] dark:border-primary/20 flex gap-3.5"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.02)' }}
        >
          <div
            className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center bg-[#f2faf5] dark:bg-primary/10"
          >
            <LivaAvatar size={26} floating />
          </div>
          <div className="pt-0.5">
            <p
              className="text-[11px] font-bold uppercase tracking-wider text-[#059669] dark:text-primary"
            >
              Liva Insight
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
              You usually skip breakfast on Tuesdays. Eating a protein-rich
              breakfast may help maintain your energy levels throughout the day.
            </p>
          </div>
        </div>

        {/* Nutrition Analytics Chart Card */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border"
          style={{ boxShadow: '0 8px 24px rgba(16,32,26,0.04)' }}
        >
          <h2 className="font-extrabold text-[18px] text-foreground mb-4 tracking-tight">
            Nutrition Analytics
          </h2>

          {/* Segment Control */}
          <div className="flex bg-slate-50 dark:bg-muted p-1 rounded-[14px] mb-6">
            {['Today', 'Week', 'Month'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveChartTab(tab)}
                className={`flex-1 py-2 text-[10px] font-extrabold rounded-[10px] transition-all ${activeChartTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Metric */}
          <div className="flex items-center gap-2 mb-8">
            <Flame size={20} strokeWidth={2.5} className="text-[#059669]" />
            <span className="font-extrabold text-[22px] text-foreground tracking-tight">
              {chartData.displayMetric} kcal
            </span>
          </div>

          {/* Chart */}
          <div className="relative h-48 w-full mb-2 mt-4">
            {/* Y-axis labels and grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-6">
              {chartData.yAxisLabels.map((val) => (
                <div key={val} className="flex items-center w-full">
                  <span className="text-[9px] font-bold text-muted-foreground w-7 text-left">
                    {val}
                  </span>
                  <div className="flex-1 border-t border-dashed border-slate-100 dark:border-border/80 ml-2" />
                </div>
              ))}
            </div>

            {/* Bars container */}
            <div className="absolute inset-0 pl-9 flex items-end justify-between px-2 pb-6">
              {chartData.data.map((data, i) => {
                const totalMacroKcal =
                  data.p * 4 + data.c * 4 + data.f * 9 || 1; // avoid division by zero
                const pPct = ((data.p * 4) / totalMacroKcal) * 100;
                const cPct = ((data.c * 4) / totalMacroKcal) * 100;
                const fPct = ((data.f * 9) / totalMacroKcal) * 100;
                const barHeight = Math.min(
                  (data.kcal / chartData.maxKcal) * 100,
                  100
                );

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center h-full justify-end relative w-4 group"
                    onClick={() => handleBarTap(i)}
                  >
                    {data.kcal > 0 && (
                      <div
                        className="w-full rounded-t-[4px] overflow-hidden flex flex-col justify-start absolute bottom-0 cursor-pointer"
                        style={{ height: `${barHeight}%` }}
                      >
                        <div
                          className="w-full bg-[#10b981] hover:brightness-110 transition-all"
                          style={{ height: `${fPct}%` }}
                        />
                        <div
                          className="w-full bg-[#f59e0b] hover:brightness-110 transition-all"
                          style={{ height: `${cPct}%` }}
                        />
                        <div
                          className="w-full bg-[#0ea5e9] hover:brightness-110 transition-all"
                          style={{ height: `${pPct}%` }}
                        />
                      </div>
                    )}

                    {/* Hover Tooltip */}
                    {data.kcal > 0 && (
                      <div
                        className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card/95 text-card-foreground backdrop-blur-xl border border-slate-100 dark:border-border text-foreground p-3 rounded-[16px] transition-all duration-200 pointer-events-none z-50 w-[110px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] origin-bottom ${activeTooltipIndex === i ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}
                      >
                        <div className="font-extrabold text-[13px] mb-2 text-center text-foreground border-b border-slate-100 dark:border-border pb-2">
                          {data.kcal}{' '}
                          <span className="text-[10px] font-bold text-muted-foreground">
                            kcal
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>
                            <span className="text-muted-foreground font-bold">
                              Protein
                            </span>
                          </div>
                          <span className="font-extrabold text-foreground">
                            {data.p}g
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                            <span className="text-muted-foreground font-bold">
                              Carbs
                            </span>
                          </div>
                          <span className="font-extrabold text-foreground">
                            {data.c}g
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                            <span className="text-muted-foreground font-bold">
                              Fat
                            </span>
                          </div>
                          <span className="font-extrabold text-foreground">
                            {data.f}g
                          </span>
                        </div>
                        {/* Triangle indicator */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-9 right-2 flex justify-between px-2">
              {chartData.data.map((data, i) => (
                <span
                  key={i}
                  className="text-[9px] font-bold text-muted-foreground w-4 text-center"
                >
                  {data.day}
                </span>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 pt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-[3px] bg-[#10b981]" />
              <span className="text-[10px] font-bold text-muted-foreground">Fat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-[3px] bg-[#f59e0b]" />
              <span className="text-[10px] font-bold text-muted-foreground">
                Carbs
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-[3px] bg-[#0ea5e9]" />
              <span className="text-[10px] font-bold text-muted-foreground">
                Protein
              </span>
            </div>
          </div>
        </div>

        {/* Today's Summary Metrics Grid */}
        <div>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Today's Summary
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <span className="text-[11px] font-bold text-muted-foreground block mb-1">
                Meals Logged
              </span>
              <span
                className="text-xl font-bold block text-foreground"
              >
                {loggedMealsCount} meal{loggedMealsCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div
              className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <span className="text-[11px] font-bold text-muted-foreground block mb-1">
                Calories Consumed
              </span>
              <span
                className="text-xl font-bold block"
                style={{ color: '#10b981' }}
              >
                {caloriesLogged} kcal
              </span>
            </div>
            <div
              className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <span className="text-[11px] font-bold text-muted-foreground block mb-1">
                Water Intake
              </span>
              <span
                className="text-xl font-bold block"
                style={{ color: '#06b6d4' }}
              >
                {waterLogged} ml
              </span>
            </div>
            <div
              className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <span className="text-[11px] font-bold text-muted-foreground block mb-1">
                Habit Streaks
              </span>
              <span
                className="text-xl font-bold block text-foreground"
              >
                {habitCompletionRate}% done
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Analytics Modules
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onNavigate('progress-weekly')}
              className="flex items-center gap-3 rounded-2xl bg-card text-card-foreground p-4 text-left border border-slate-100 dark:border-border hover:bg-[#f2faf5] dark:hover:bg-primary/10 transition-colors"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <Activity size={18} className="text-[#34C759]" />
              <span className="text-xs font-bold text-foreground" >
                Weekly Report
              </span>
            </button>
            <button
              onClick={() => onNavigate('progress-monthly')}
              className="flex items-center gap-3 rounded-2xl bg-card text-card-foreground p-4 text-left border border-slate-100 dark:border-border hover:bg-[#f2faf5] dark:hover:bg-primary/10 transition-colors"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <TrendingUp size={18} className="text-[#0ea5e9]" />
              <span className="text-xs font-bold text-foreground" >
                Monthly Trend
              </span>
            </button>
            <button
              onClick={() => onNavigate('progress-nutrition')}
              className="flex items-center gap-3 rounded-2xl bg-card text-card-foreground p-4 text-left border border-slate-100 dark:border-border hover:bg-[#f2faf5] dark:hover:bg-primary/10 transition-colors"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <Leaf size={18} className="text-[#fb923c]" />
              <span className="text-xs font-bold text-foreground" >
                Nutrition
              </span>
            </button>
            <button
              onClick={() => onNavigate('progress-weight')}
              className="flex items-center gap-3 rounded-2xl bg-card text-card-foreground p-4 text-left border border-slate-100 dark:border-border hover:bg-[#f2faf5] dark:hover:bg-primary/10 transition-colors"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <TrendingUp size={18} className="text-[#a855f7]" />
              <span className="text-xs font-bold text-foreground" >
                Weight Log ({userWeight} kg)
              </span>
            </button>
            <button
              onClick={() => onNavigate('progress-habits')}
              className="flex items-center gap-3 rounded-2xl bg-card text-card-foreground p-4 text-left border border-slate-100 dark:border-border hover:bg-[#f2faf5] dark:hover:bg-primary/10 transition-colors"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <Calendar size={18} className="text-[#e11d48]" />
              <span className="text-xs font-bold text-foreground" >
                Habits Heatmap
              </span>
            </button>
            <button
              onClick={() => onNavigate('progress-insights')}
              className="flex items-center gap-3 rounded-2xl bg-card text-card-foreground p-4 text-left border border-slate-100 dark:border-border hover:bg-[#f2faf5] dark:hover:bg-primary/10 transition-colors"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <MessageCircle size={18} className="text-amber-500" />
              <span className="text-xs font-bold text-foreground" >
                AI Insights feed
              </span>
            </button>
            <button
              onClick={() => onNavigate('progress-achievements')}
              className="flex items-center gap-3 rounded-2xl bg-card text-card-foreground p-4 text-left border border-slate-100 dark:border-border hover:bg-[#f2faf5] dark:hover:bg-primary/10 transition-colors"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <Award size={18} className="text-indigo-500" />
              <span className="text-xs font-bold text-foreground" >
                Achievements
              </span>
            </button>
            <button
              onClick={() => onNavigate('progress-goals')}
              className="flex items-center gap-3 rounded-2xl bg-card text-card-foreground p-4 text-left border border-slate-100 dark:border-border hover:bg-[#f2faf5] dark:hover:bg-primary/10 transition-colors"
              style={{ boxShadow: '0 4px 12px rgba(16,32,26,0.02)' }}
            >
              <Target size={18} className="text-rose-500" />
              <span className="text-xs font-bold text-foreground" >
                Goals Setup
              </span>
            </button>
          </div>
        </div>
      </div>
      <BottomNav active="progress" onNavigate={onNavigate} />
    </div>
  );
}
