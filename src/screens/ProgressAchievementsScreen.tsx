import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink, green } from "../constants";
import { Screen } from "../types";

export default function ProgressAchievementsScreen({ onBack }: { onBack: () => void }) {
  const achievements = [
    { title: "First Meal Logged", criteria: "Log your first meal using voice, camera, or text", count: 100, unlocked: true, icon: "🍳", color: "bg-[#ecfbf1] text-[#34C759]" },
    { title: "7-Day Streak", criteria: "Consistently log food for 7 consecutive days", count: 70, unlocked: false, icon: "🔥", color: "bg-[#fff8eb] text-[#fb923c]" },
    { title: "Protein Hero", criteria: "Hit your daily protein target of 120g", count: 100, unlocked: true, icon: "🥚", color: "bg-[#e9f7ff] text-[#0ea5e9]" },
    { title: "Hydration Master", criteria: "Complete water targets for 6 days straight", count: 83, unlocked: false, icon: "💧", color: "bg-[#e9fbf7] text-[#00C4B0]" },
    { title: "Goal Crusher", criteria: "Lose your first 3 kilograms", count: 40, unlocked: false, icon: "🎯", color: "bg-[#fff0f3] text-[#f43f5e]" },
    { title: "Healthy Week", criteria: "Maintain a health score above 80 for 7 days", count: 100, unlocked: true, icon: "🥗", color: "bg-slate-100 text-[#10201a]" },
  ];

  return (
    <ScreenShell
      title="Achievements"
      subtitle="Gamified milestones unlocked on Fitma.ai."
      onBack={onBack}
    >
      <div className="grid grid-cols-2 gap-3 pb-8">
        {achievements.map((ach, idx) => (
          <div
            key={idx}
            className={`rounded-[24px] bg-white p-4.5 border flex flex-col justify-between text-left ${ach.unlocked ? "border-[#34C759]/24" : "border-slate-100"}`}
            style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}
          >
            <div>
              <span className={`h-11 w-11 flex items-center justify-center rounded-2xl text-xl font-bold ${ach.color} ${!ach.unlocked && "grayscale opacity-50"}`}>
                {ach.icon}
              </span>
              <h4 className="text-xs font-black mt-3" style={{ color: ach.unlocked ? ink : "#94a3b8" }}>
                {ach.title}
              </h4>
              <p className="text-[9px] text-slate-400 leading-relaxed mt-1">{ach.criteria}</p>
            </div>

            <div className="mt-4.5">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-1.5">
                <div className="h-full rounded-full" style={{ width: `${ach.count}%`, background: ach.unlocked ? green : "#cbd5e1" }} />
              </div>
              <span className="text-[8px] font-bold text-slate-400">{ach.unlocked ? "Unlocked 🎉" : `${ach.count}% unlocked`}</span>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}
