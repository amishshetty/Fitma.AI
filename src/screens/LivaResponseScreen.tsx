import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import PrimaryButton from "../components/ui/PrimaryButton";
import ProgressRing from "../components/ui/ProgressRing";
import ScreenShell from "./ScreenShell";
import { ink, muted } from "../constants";
import { Screen } from "../types";

export default function LivaResponseScreen({ onBack, onNavigate }: { onBack: () => void; onNavigate: (screen: Screen) => void }) {
  const [dinnerCals, setDinnerCals] = useState(600);

  // Dynamic forecast calculations based on the slider value
  const dailyTarget = 2450;
  const loggedSoFar = 980;
  const currentDeficit = dailyTarget - loggedSoFar;
  const finalCalorieBalance = loggedSoFar + dinnerCals;
  const isOverBudget = finalCalorieBalance > dailyTarget;
  const variance = Math.abs(finalCalorieBalance - dailyTarget);

  const forecastData = useMemo(() => {
    if (dinnerCals > 800) {
      return {
        mode: "Feast Mode",
        message: `Exceeding target by ${variance} kcal. High-carb storage threshold active.`,
        weightTrend: "+0.15 kg expected tomorrow",
        color: "#d4183d"
      };
    } else if (dinnerCals < 450) {
      return {
        mode: "Lean Budget",
        message: `Finishing ${variance} kcal under target. Ketosis conversion accelerated.`,
        weightTrend: "-0.22 kg expected tomorrow",
        color: "#00c4b0"
      };
    } else {
      return {
        mode: "Standard Balanced",
        message: `Steady energy zone. Balanced glycemic levels expected tonight.`,
        weightTrend: "Weight trajectory: Stable",
        color: "#34c759"
      };
    }
  }, [dinnerCals, variance]);

  return (
    <ScreenShell
      title="AI Calorie Forecaster"
      subtitle="Simulate dinner sizes to see weight and energy forecasts."
      onBack={onBack}
      footer={
        <PrimaryButton onClick={() => onNavigate("liva-recommendations")}>
          Generate Dinner Plan ({dinnerCals} kcal)
        </PrimaryButton>
      }
    >
      <div className="space-y-5">
        {/* Interactive Calorie Gauge Card */}
        <div className="rounded-[28px] bg-white p-5 border border-[#34C759]/12 text-center" style={{ boxShadow: "0 8px 24px rgba(16,32,26,0.05)" }}>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Simulated Intake</span>
          <span className="text-4xl font-extrabold" style={{ color: ink }}>
            {finalCalorieBalance} <span className="text-base text-slate-400 font-semibold">/ {dailyTarget} kcal</span>
          </span>

          <div className="mt-4 flex justify-center gap-6">
            <div>
              <ProgressRing value={Math.min(100, Math.round((finalCalorieBalance / dailyTarget) * 100))} size={72} color={forecastData.color} label="budget" />
            </div>
            <div className="text-left flex flex-col justify-center">
              <span className="text-sm font-bold block" style={{ color: forecastData.color }}>
                {forecastData.mode}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                {forecastData.weightTrend}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Range Slider Control */}
        <div className="rounded-[24px] bg-white p-5 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs font-bold" style={{ color: ink }}>Dinner Size Plan</span>
            <span className="text-sm font-extrabold text-[#34c759]">{dinnerCals} kcal</span>
          </div>
          <input
            type="range"
            min="300"
            max="1000"
            step="50"
            className="w-full h-1.5 bg-[#f0f9f4] rounded-lg appearance-none cursor-pointer accent-[#34c759]"
            value={dinnerCals}
            onChange={(e) => setDinnerCals(Number(e.target.value))}
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-2">
            <span>Light (300 kcal)</span>
            <span>Hearty (1000 kcal)</span>
          </div>
        </div>

        {/* Liva Forecast Commentary */}
        <div className="rounded-[24px] p-4.5 bg-[#f7fffe]" style={{ border: `1.5px dashed ${forecastData.color}30` }}>
          <div className="flex gap-3">
            <LivaAvatar size={38} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: forecastData.color }}>
                Forecast Analytics
              </p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: muted }}>
                {forecastData.message} Logging a dinner close to this budget helps maintain consistent leptin levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
