import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function ProgressNutritionScreen({ onBack }: { onBack: () => void }) {
  const macros = [
    { label: "Carbs", value: "115g", percent: 45, color: "#fb923c" },
    { label: "Protein", value: "74g", percent: 32, color: "#0EA5E9" },
    { label: "Fat", value: "32g", percent: 23, color: "#f59e0b" },
  ];

  const nutrientBars = [
    { label: "Calories", current: 980, target: 2450, color: green, unit: "kcal" },
    { label: "Protein", current: 74, target: 120, color: "#0ea5e9", unit: "g" },
    { label: "Fiber", current: 11, target: 30, color: "#a855f7", unit: "g" },
    { label: "Sugar", current: 24, target: 50, color: "#e11d48", unit: "g" },
    { label: "Sodium", current: 2400, target: 2000, color: "#fb923c", unit: "mg" },
  ];

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
              {/* Carbs Arc (45%) */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#fb923c" strokeWidth="3.5" strokeDasharray="45 55" strokeDashoffset="0" />
              {/* Protein Arc (32%) */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#0ea5e9" strokeWidth="3.5" strokeDasharray="32 68" strokeDashoffset="-45" />
              {/* Fat Arc (23%) */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="23 77" strokeDashoffset="-77" />
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
          <p className="text-xs" style={{ color: muted }}>
            ⚠️ **Low Fiber**: You've logged only 11g of fiber (target: 30g). Try adding avocado or beans to dinner.
          </p>
          <p className="text-xs" style={{ color: muted }}>
            ⚠️ **High Sodium**: Sodium consumption is already at 2,400mg, exceeding your daily recommended limit.
          </p>
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
