import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function ProgressWeeklyScreen({ onBack, onNavigate }: { onBack: () => void; onNavigate: (screen: Screen) => void }) {
  const caloriesTrend = [1980, 2450, 2100, 2600, 2350, 1850, 2200];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <ScreenShell
      title="This Week"
      subtitle="Excellent week! You met your calorie goal on 6 out of 7 days."
      onBack={onBack}
      footer={<PrimaryButton onClick={() => onNavigate("progress-monthly")}>View Monthly Insights</PrimaryButton>}
    >
      <div className="space-y-5 pb-8">
        {/* Calorie Trend Bar Graph */}
        <div className="rounded-[28px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Daily Calorie Consumption</h3>
          <div className="flex h-36 items-end justify-between px-2 pt-2">
            {caloriesTrend.map((kcal, index) => {
              const maxKcal = 2800;
              const percent = Math.round((kcal / maxKcal) * 100);
              return (
                <div key={index} className="flex flex-col items-center gap-2 w-8 text-center">
                  <span className="text-[8px] font-bold text-slate-400">{kcal}</span>
                  <div className="w-full bg-[#f2faf5] rounded-full h-24 relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full"
                      style={{ height: `${percent}%`, background: kcal > 2450 ? "#fb923c" : green }}
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
            <span className="text-lg font-black block mt-1.5" style={{ color: ink }}>7 Days</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">🥗 Healthiest Day</span>
            <span className="text-lg font-black block mt-1.5 text-[#34C759]">Thursday</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">🔥 Average Calories</span>
            <span className="text-lg font-black block mt-1.5" style={{ color: ink }}>2,218 kcal</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">💪 Protein Goal Met</span>
            <span className="text-lg font-black block mt-1.5 text-[#0EA5E9]">5 / 7 Days</span>
          </div>
        </div>

        {/* Liva Coaching Summary */}
        <div className="rounded-[24px] p-4.5 bg-white border border-[#34C759]/16 flex gap-3" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <LivaAvatar size={38} floating />
          <div>
            <p className="text-xs font-bold text-[#197a38] uppercase tracking-wide">Liva Weekly Summary</p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: muted }}>
              You stayed within your calorie goal on 6 of the last 7 days. Great consistency! The biggest opportunity is increasing water intake on weekdays.
            </p>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
