import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink } from "../constants";
import { Screen } from "../types";
import { GoalConfig } from "../types";

export default function ProgressGoalsScreen({
  onBack,
  goals,
  onUpdateGoals,
}: {
  onBack: () => void;
  goals: GoalConfig;
  onUpdateGoals: (g: GoalConfig) => void;
}) {
  return (
    <ScreenShell
      title="Goals & Targets"
      subtitle="Modify your fitness limits. Liva adjusts forecasting instantly."
      onBack={onBack}
    >
      <div className="space-y-5 pb-8">
        {/* Calories Goal setting */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold" style={{ color: ink }}>Daily Calories Goal</span>
            <span className="text-sm font-black text-[#34c759]">{goals.calories} kcal</span>
          </div>
          <input
            type="range"
            min="1500"
            max="3500"
            step="100"
            className="w-full h-1.5 bg-[#f0f9f4] rounded-lg appearance-none cursor-pointer accent-[#34c759]"
            value={goals.calories}
            onChange={(e) => onUpdateGoals({ ...goals, calories: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-semibold">
            <span>1500 kcal</span>
            <span>3500 kcal</span>
          </div>
        </div>

        {/* Protein Target setting */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold" style={{ color: ink }}>Protein Target</span>
            <span className="text-sm font-black text-[#0ea5e9]">{goals.protein} g</span>
          </div>
          <input
            type="range"
            min="60"
            max="200"
            step="5"
            className="w-full h-1.5 bg-[#e9f7ff] rounded-lg appearance-none cursor-pointer accent-[#0ea5e9]"
            value={goals.protein}
            onChange={(e) => onUpdateGoals({ ...goals, protein: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-semibold">
            <span>60g</span>
            <span>200g</span>
          </div>
        </div>

        {/* Hydration Goal setting */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold" style={{ color: ink }}>Water Intake Goal</span>
            <span className="text-sm font-black text-[#00C4B0]">{(goals.water / 1000).toFixed(2)} L</span>
          </div>
          <input
            type="range"
            min="1500"
            max="4500"
            step="250"
            className="w-full h-1.5 bg-[#e9fbf7] rounded-lg appearance-none cursor-pointer accent-[#00c4b0]"
            value={goals.water}
            onChange={(e) => onUpdateGoals({ ...goals, water: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-semibold">
            <span>1.5 L</span>
            <span>4.5 L</span>
          </div>
        </div>

        {/* Target Weight Goal setting */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold" style={{ color: ink }}>Target Weight</span>
            <span className="text-sm font-black text-[#a855f7]">{goals.weight} kg</span>
          </div>
          <input
            type="range"
            min="55"
            max="95"
            step="0.5"
            className="w-full h-1.5 bg-[#f5f0ff] rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
            value={goals.weight}
            onChange={(e) => onUpdateGoals({ ...goals, weight: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-semibold">
            <span>55 kg</span>
            <span>95 kg</span>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
