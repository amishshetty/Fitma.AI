import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen, LoggedMeal } from "../types";

export default function ProgressNutritionScreen({ 
  onBack,
  loggedMeals = [],
  goals = { calories: 1800, protein: 100 }
}: { 
  onBack: () => void;
  loggedMeals?: LoggedMeal[];
  goals?: any;
}) {
  const { macros, nutrientBars, alerts } = useMemo(() => {
    let todayCarbs = 0;
    let todayProtein = 0;
    let todayFat = 0;
    let todayCalories = 0;
    let todayFiber = 0; // Not tracked in current meals exactly, but we can simulate or set 0
    let todaySodium = 0;

    const todayStart = new Date().setHours(0,0,0,0);
    const todayEnd = new Date().setHours(23,59,59,999);
    
    loggedMeals.forEach(m => {
      const time = parseInt(m.id);
      if (time >= todayStart && time <= todayEnd) {
        todayCalories += m.calories || 0;
        todayProtein += m.protein || 0;
        todayCarbs += m.carbs || 0;
        todayFat += m.fat || 0;
        // Mock fiber/sodium as we don't have them in LoggedMeal currently
        todayFiber += Math.round((m.carbs || 0) * 0.15); 
        todaySodium += Math.round((m.calories || 0) * 0.8);
      }
    });

    const totalMacros = todayCarbs + todayProtein + todayFat;
    const carbPercent = totalMacros > 0 ? Math.round((todayCarbs / totalMacros) * 100) : 0;
    const proteinPercent = totalMacros > 0 ? Math.round((todayProtein / totalMacros) * 100) : 0;
    const fatPercent = totalMacros > 0 ? 100 - carbPercent - proteinPercent : 0;

    const macrosData = [
      { label: "Carbs", value: `${todayCarbs}g`, percent: carbPercent, color: "#fb923c" },
      { label: "Protein", value: `${todayProtein}g`, percent: proteinPercent, color: "#0EA5E9" },
      { label: "Fat", value: `${todayFat}g`, percent: fatPercent, color: "#f59e0b" },
    ];

    const barsData = [
      { label: "Calories", current: todayCalories, target: goals.calories || 2000, color: green, unit: "kcal" },
      { label: "Protein", current: todayProtein, target: goals.protein || 100, color: "#0ea5e9", unit: "g" },
      { label: "Fiber", current: todayFiber, target: 30, color: "#a855f7", unit: "g" },
      { label: "Sodium", current: todaySodium, target: 2000, color: "#fb923c", unit: "mg" },
    ];

    const dynamicAlerts = [];
    if (todayFiber < 15 && todayCalories > 500) {
      dynamicAlerts.push(`⚠️ **Low Fiber**: You've logged only ${todayFiber}g of fiber (target: 30g). Try adding more veggies.`);
    }
    if (todaySodium > 2000) {
      dynamicAlerts.push(`⚠️ **High Sodium**: Sodium consumption is already at ${todaySodium}mg, exceeding your daily recommended limit.`);
    }
    if (dynamicAlerts.length === 0) {
      dynamicAlerts.push(`✅ **On Track**: Your nutrient balance looks great so far today!`);
    }

    return { macros: macrosData, nutrientBars: barsData, alerts: dynamicAlerts, carbPercent, proteinPercent, fatPercent };
  }, [loggedMeals, goals]);

  return (
    <ScreenShell
      title="Nutrition Analytics"
      subtitle="Detailed breakdown of macro and micro goals."
      onBack={onBack}
    >
      <div className="space-y-5 pb-8">
        {/* Macro Donut SVG Card */}
        <div className="rounded-[28px] bg-white p-5 border border-slate-100 flex items-center justify-around" style={{ boxShadow: "0 8px 24px rgba(16,32,26,0.04)" }}>
          <div className="relative h-28 w-28">
            <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              {/* Carbs Arc */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#fb923c" strokeWidth="3.5" strokeDasharray={`${macros[0].percent} ${100 - macros[0].percent}`} strokeDashoffset="0" />
              {/* Protein Arc */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#0ea5e9" strokeWidth="3.5" strokeDasharray={`${macros[1].percent} ${100 - macros[1].percent}`} strokeDashoffset={`-${macros[0].percent}`} />
              {/* Fat Arc */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray={`${macros[2].percent} ${100 - macros[2].percent}`} strokeDashoffset={`-${macros[0].percent + macros[1].percent}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-black" style={{ color: ink }}>Macros</span>
              <span className="text-[8px] text-slate-400 uppercase font-bold">Split</span>
            </div>
          </div>

          <div className="space-y-2">
            {macros.map((mac) => (
              <div key={mac.label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: mac.color }} />
                <span className="text-xs font-bold" style={{ color: ink }}>
                  {mac.label}: {mac.value} ({mac.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrient Gaps alerts */}
        <div className="rounded-[24px] p-4.5 bg-[#fff8eb] border border-[#fb923c]/20 space-y-2">
          <h4 className="text-xs font-bold text-[#c2410c] uppercase tracking-wider">Nutrient Alerts</h4>
          {alerts.map((alertText, idx) => (
            <p key={idx} className="text-xs leading-relaxed" style={{ color: muted }}>
              {alertText}
            </p>
          ))}
        </div>

        {/* Daily Nutrient progress bars */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-4" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nutrient Targets</h3>
          <div className="space-y-3">
            {nutrientBars.map((nut) => {
              const percent = Math.min(100, Math.round((nut.current / nut.target) * 100));
              return (
                <div key={nut.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold" style={{ color: ink }}>
                    <span>{nut.label}</span>
                    <span>{nut.current} / {nut.target} {nut.unit}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${percent}%`, background: nut.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
