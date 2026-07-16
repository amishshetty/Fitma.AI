import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { green, muted } from "../constants";
import { Screen } from "../types";

export default function ReminderWeeklySummaryScreen({ onBack }: { onBack: () => void }) {
  const weeklyData = [
    { label: "Calories Target", value: "6 / 7 Days met", color: green },
    { label: "Protein Consumption", value: "78% consistency", color: "#0ea5e9" },
    { label: "Hydration Streak", value: "5 / 7 Days met", color: "#00C4B0" },
    { label: "Consistency rating", value: "+18% vs last week", color: "#fb923c" },
  ];

  return (
    <ScreenShell
      title="Weekly Health Summary"
      subtitle="Report generated on Sunday, July 7, 2026."
      onBack={onBack}
      footer={<PrimaryButton onClick={onBack}>View Full Report</PrimaryButton>}
    >
      <div className="space-y-5 pb-8">
        {/* Report Card Grid */}
        <div className="grid grid-cols-2 gap-3">
          {weeklyData.map((data, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white p-4 border border-slate-100"
              style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}
            >
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">{data.label}</span>
              <span className="text-sm font-black block mt-2" style={{ color: data.color }}>{data.value}</span>
            </div>
          ))}
        </div>

        {/* Liva summary coach panel */}
        <div className="rounded-[24px] p-4.5 bg-white border border-[#34C759]/16 flex gap-3" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <LivaAvatar size={38} floating />
          <div>
            <p className="text-xs font-bold text-[#197a38] uppercase tracking-wide">Coach Weekly Review</p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: muted }}>
              You stayed within your calorie goal on 6 of 7 days. Fantastic consistency! Try adding one more serving of vegetables during lunch.
            </p>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
