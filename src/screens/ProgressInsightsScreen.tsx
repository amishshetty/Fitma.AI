import { Flame, Target, Droplets } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { green, muted } from "../constants";
import { Screen } from "../types";

export default function ProgressInsightsScreen({ onBack, onNavigate }: { onBack: () => void; onNavigate: (screen: Screen) => void }) {
  const insightsList = [
    {
      title: "Late Snacking Alert",
      text: "You tend to eat most of your calories after 8 PM on weekdays. This is linked to morning low hunger levels.",
      action: "Set snacks reminders",
      icon: Flame,
      color: "#fb923c",
      screen: "home" as Screen,
    },
    {
      title: "Protein Progress",
      text: "Outstanding consistency! Your protein intake improved by 22% this month compared to June.",
      action: "View goals target",
      icon: Target,
      color: "#0ea5e9",
      screen: "progress-goals" as Screen,
    },
    {
      title: "Weekend Hydration Drop",
      text: "Your average water intake drops significantly (from 3.2L to 1.4L) during weekends. Keep a flask close!",
      action: "Log water now",
      icon: Droplets,
      color: "#00c4b0",
      screen: "liva-water" as Screen,
    },
  ];

  return (
    <ScreenShell
      title="Liva Coach Feed"
      subtitle="AI explanations derived from your logged routines."
      onBack={onBack}
    >
      <div className="space-y-4 pb-8">
        {insightsList.map((ins, idx) => {
          const Icon = ins.icon;
          return (
            <div
              key={idx}
              className="rounded-[24px] bg-white p-5 border border-slate-100 flex gap-4"
              style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl flex-shrink-0" style={{ background: `${ins.color}14`, color: ins.color }}>
                <Icon size={20} />
              </span>
              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">{ins.title}</span>
                <p className="text-xs leading-relaxed" style={{ color: muted }}>
                  {ins.text}
                </p>
                <button
                  onClick={() => onNavigate(ins.screen)}
                  className="text-xs font-bold hover:underline block pt-1.5"
                  style={{ color: green }}
                >
                  {ins.action} →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ScreenShell>
  );
}
