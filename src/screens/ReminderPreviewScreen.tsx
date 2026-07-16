import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink } from "../constants";
import { Screen } from "../types";

export default function ReminderPreviewScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  const previews = [
    { reason: "Working Late", actionLabel: "Skip / Eat Dinner", text: "Looks like you're working late today. Don't forget dinner.", screen: "reminder-meal-flow" as Screen },
    { reason: "Missed Routine", actionLabel: "Log Breakfast", text: "You've skipped breakfast twice this week.", screen: "quick-log" as Screen },
    { reason: "Hydration Check", actionLabel: "Log Water Intake", text: "Yesterday you drank only 1.3L of water.", screen: "reminder-hydration" as Screen },
    { reason: "Metric Reached", actionLabel: "See Achievements", text: "You reached your protein goal today. Great job!", screen: "reminder-celebration" as Screen },
  ];

  return (
    <ScreenShell
      title="How Liva Reminds You"
      subtitle="Contextual suggestions designed to support, not annoy."
      onBack={onBack}
    >
      <div className="space-y-4 pb-8">
        {previews.map((pre, idx) => (
          <div
            key={idx}
            className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-3"
            style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}
          >
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <span>Liva Alert</span>
              <span className="rounded-full bg-[#f2faf5] px-2 py-0.5 text-[#197a38]">{pre.reason}</span>
            </div>
            
            <p className="text-xs leading-relaxed" style={{ color: ink }}>
              "{pre.text}"
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {}}
                className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full hover:bg-slate-100"
              >
                Dismiss
              </button>
              <button
                onClick={() => onNavigate(pre.screen)}
                className="text-[10px] font-bold text-white bg-[#34C759] px-3 py-1.5 rounded-full hover:bg-[#25ad48]"
              >
                {pre.actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}
