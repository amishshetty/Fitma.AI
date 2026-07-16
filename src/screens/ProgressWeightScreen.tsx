import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink } from "../constants";
import { Screen } from "../types";

export default function ProgressWeightScreen({
  onBack,
  userWeight,
  onLogWeight,
}: {
  onBack: () => void;
  userWeight: number;
  onLogWeight: (w: number) => void;
}) {
  const goalWeight = 70.0;
  const startWeight = 75.4;
  const progressPercent = Math.min(100, Math.round(((startWeight - userWeight) / (startWeight - goalWeight)) * 100));

  return (
    <ScreenShell
      title="Weight Journey"
      subtitle="Estimated Goal Date: September 20, 2026."
      onBack={onBack}
    >
      <div className="space-y-5 pb-8">
        {/* Weight timeline progress card */}
        <div className="rounded-[28px] bg-white p-5 border border-slate-100 text-center" style={{ boxShadow: "0 8px 24px rgba(16,32,26,0.04)" }}>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">Current Weight</span>
              <span className="text-xl font-black text-[#a855f7] block mt-1">{userWeight} kg</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">Goal Weight</span>
              <span className="text-xl font-black text-[#34c759] block mt-1">{goalWeight} kg</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">Total Loss</span>
              <span className="text-xl font-black text-[#0ea5e9] block mt-1">{(startWeight - userWeight).toFixed(1)} kg</span>
            </div>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-[#a855f7] to-[#34c759] rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">{progressPercent}% of goal completed</span>
        </div>

        {/* Interactive Update Slider */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold" style={{ color: ink }}>Log New Weight</span>
            <span className="text-sm font-black text-[#a855f7]">{userWeight} kg</span>
          </div>
          <input
            type="range"
            min="68"
            max="78"
            step="0.1"
            className="w-full h-1.5 bg-[#f5f0ff] rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
            value={userWeight}
            onChange={(e) => onLogWeight(Number(e.target.value))}
          />
          <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-semibold">
            <span>68 kg</span>
            <span>78 kg</span>
          </div>
        </div>

        {/* Weight Milestones Timeline */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-4.5" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Milestones reached</h3>
          <div className="space-y-4 pl-4 border-l-2 border-[#a855f7]/20 relative">
            {[
              { title: "First weight logged", detail: "75.4 kg on June 15", active: true },
              { title: "Halfway there!", detail: "72.7 kg target passed", active: userWeight <= 72.7 },
              { title: "Under 71kg club", detail: "Goal unlocked", active: userWeight < 71.0 },
            ].map((milestone, idx) => (
              <div key={idx} className="relative">
                <span
                  className="absolute left-[-23px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white text-[8px] text-white"
                  style={{ background: milestone.active ? "#a855f7" : "#e2e8f0" }}
                >
                  {milestone.active && "✓"}
                </span>
                <div>
                  <h4 className="text-xs font-bold" style={{ color: milestone.active ? ink : "#94a3b8" }}>
                    {milestone.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{milestone.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
