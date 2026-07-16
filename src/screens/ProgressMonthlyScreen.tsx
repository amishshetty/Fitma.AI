import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink, green } from "../constants";
import { Screen } from "../types";

export default function ProgressMonthlyScreen({ onBack, onNavigate }: { onBack: () => void; onNavigate: (screen: Screen) => void }) {
  return (
    <ScreenShell
      title="Monthly Trends"
      subtitle="You've improved your consistency by 18% compared to last month."
      onBack={onBack}
    >
      <div className="space-y-5 pb-8">
        {/* Weight Trend Line Chart */}
        <div className="rounded-[28px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weight Journey Trend</h3>
            <span className="text-xs font-bold text-[#f43f5e]">-1.2 kg this month</span>
          </div>
          {/* SVG Weight Line representation */}
          <div className="relative h-28 w-full border-b border-slate-100">
            <svg className="w-full h-full" viewBox="0 0 200 80">
              <path
                d="M 10 70 L 40 66 L 80 62 L 120 58 L 160 55 L 190 52"
                fill="none"
                stroke={green}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {[70, 66, 62, 58, 55, 52].map((y, idx) => (
                <circle key={idx} cx={10 + idx * 36} cy={y} r="4.5" fill="white" stroke={green} strokeWidth="2.5" />
              ))}
            </svg>
            <div className="flex justify-between text-[8px] text-slate-400 mt-2 font-semibold">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 border border-slate-100" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">Average Calorie</span>
            <span className="text-base font-extrabold block mt-1" style={{ color: ink }}>2,190 kcal</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-slate-100" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">Protein Average</span>
            <span className="text-base font-extrabold block mt-1 text-[#0EA5E9]">84g / day</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-slate-100" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">Water Average</span>
            <span className="text-base font-extrabold block mt-1 text-[#00c4b0]">2.25 L / day</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-slate-100" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">Healthy Days</span>
            <span className="text-base font-extrabold block mt-1 text-[#34C759]">22 days</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-slate-100" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">Meal Consistency</span>
            <span className="text-base font-extrabold block mt-1" style={{ color: ink }}>86%</span>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-slate-100" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
            <span className="text-[10px] font-bold text-slate-400 block">Skipped Breakfasts</span>
            <span className="text-base font-extrabold block mt-1 text-[#f43f5e]">3 days</span>
          </div>
        </div>

        {/* Favorite Foods Card */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Favorite Foods</h3>
          <div className="space-y-2">
            {[
              { name: "Paneer Paratha", count: "12 times logged" },
              { name: "Organic Quinoa Bowl", count: "9 times logged" },
              { name: "Sautéed Broccoli", count: "7 times logged" },
            ].map((food, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                <span className="font-bold" style={{ color: ink }}>{food.name}</span>
                <span className="text-slate-400 font-semibold">{food.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
