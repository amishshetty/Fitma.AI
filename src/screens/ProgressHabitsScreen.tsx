import { Check } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink, green } from "../constants";
import { Screen } from "../types";

export default function ProgressHabitsScreen({
  onBack,
  habits,
  onToggleHabit,
}: {
  onBack: () => void;
  habits: { [key: string]: boolean };
  onToggleHabit: (key: string) => void;
}) {
  const currentStreak = 5;
  const longestStreak = 12;
  const habitsList = [
    { key: "breakfast", label: "🍳 Breakfast Logged", desc: "Log meal before 10 AM" },
    { key: "water", label: "💧 Water Goal met", desc: "Drink 3.0 Liters or more" },
    { key: "protein", label: "🥚 Protein Goal met", desc: "Eat 120g of protein" },
    { key: "exercise", label: "🏃 Exercise Done", desc: "Minimum 30 minutes active" },
    { key: "sleep", label: "😴 Sleep Goal met", desc: "Get 7.5 hours or more rest" },
  ];

  return (
    <ScreenShell
      title="Habit Tracker"
      subtitle="Consistent habits build lasting weight trajectories."
      onBack={onBack}
    >
      <div className="space-y-5 pb-8">
        {/* Calendar Heatmap card */}
        <div className="rounded-[28px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 8px 24px rgba(16,32,26,0.04)" }}>
          <div className="flex justify-between items-center mb-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consistency Heatmap</h3>
            <span className="text-[10px] font-bold text-[#34C759] bg-[#f2faf5] px-2 py-0.5 rounded-full">July 2026</span>
          </div>

          {/* Heatmap Grid (30 blocks) */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, index) => {
              // Simulated consistency: green shades for consistent days
              const statusColors = ["#e4f4ea", "#a8dfb5", "#34c759"];
              const randomShade = index % 4 === 0 ? 0 : index % 3 === 0 ? 1 : 2;
              return (
                <div
                  key={index}
                  className="aspect-square rounded-[8px] transition-all hover:scale-105"
                  style={{ background: index > 21 ? "#f3f6f4" : statusColors[randomShade] }}
                  title={`Day ${index + 1}`}
                />
              );
            })}
          </div>
          
          <div className="flex justify-between text-[8px] text-slate-400 mt-3 font-semibold">
            <span>Streak: {currentStreak} days</span>
            <span>Record: {longestStreak} days</span>
          </div>
        </div>

        {/* Habit Toggles checklist */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Habits</h3>
          {habitsList.map((hab) => {
            const active = habits[hab.key];
            return (
              <button
                key={hab.key}
                onClick={() => onToggleHabit(hab.key)}
                className="w-full flex items-center justify-between rounded-[22px] bg-white p-4 text-left border border-slate-100 hover:border-[#34c759]/30 transition-colors"
                style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}
              >
                <div>
                  <span className="text-sm font-bold block" style={{ color: active ? green : ink }}>
                    {hab.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{hab.desc}</span>
                </div>
                <span
                  className="flex h-6.5 w-6.5 items-center justify-center rounded-full transition-colors"
                  style={{ background: active ? green : "#eef4f0", color: "white" }}
                >
                  {active && <Check size={14} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
