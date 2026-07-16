import { Check } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function ReminderSettingsScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [frequency, setFrequency] = useState<"minimal" | "balanced" | "frequent">("balanced");
  const [silentStart, setSilentStart] = useState("22:00");
  const [silentEnd, setSilentEnd] = useState("07:00");
  const [travelMode, setTravelMode] = useState(false);
  const [categories, setCategories] = useState({
    meals: true,
    water: true,
    protein: true,
    weekly: true,
    weight: true,
    habits: true,
  });

  return (
    <ScreenShell
      title="Smart Reminders"
      subtitle="Reminders adapt dynamically based on your daily schedule."
      onBack={onBack}
      footer={
        <div className="space-y-3">
          <PrimaryButton onClick={() => onNavigate("reminder-preview")}>Preview Liva Reminders</PrimaryButton>
          <SecondaryButton onClick={onBack}>Save Preferences</SecondaryButton>
        </div>
      }
    >
      <div className="space-y-5 pb-8">
        {/* Master AI Toggle Switch */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 flex items-center justify-between" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div>
            <span className="text-sm font-bold block" style={{ color: ink }}>Enable AI Reminders</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Allow Liva to optimize trigger timing</span>
          </div>
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            className="w-12 h-6.5 rounded-full p-1 transition-all flex items-center justify-start cursor-pointer"
            style={{
              background: aiEnabled ? green : "#e2e8f0",
              justifyContent: aiEnabled ? "flex-end" : "flex-start",
            }}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md inline-block" />
          </button>
        </div>

        {aiEnabled && (
          <>
            {/* Reminder Category checkboxes */}
            <div className="rounded-[26px] bg-white p-5 border border-slate-100 space-y-3" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Enabled Categories</h3>
              {[
                { key: "meals", label: "Meal Reminders", desc: "Adaptive meal timing logs" },
                { key: "water", label: "Water Hydration logs", desc: "Adaptive glass indicators" },
                { key: "protein", label: "Protein Targets", desc: "Alerts when macros fall behind" },
                { key: "weekly", label: "Weekly Reports", desc: "Weekly health summaries" },
                { key: "weight", label: "Weight Check-ins", desc: "Goal progression checkups" },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategories((prev: any) => ({ ...prev, [cat.key]: !prev[cat.key] }))}
                  className="w-full flex items-center justify-between text-left pb-2 border-b border-slate-50 last:border-b-0"
                >
                  <div>
                    <span className="text-xs font-bold block" style={{ color: ink }}>{cat.label}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{cat.desc}</span>
                  </div>
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-200"
                    style={{ background: (categories as any)[cat.key] ? green : "transparent", color: "white" }}
                  >
                    {(categories as any)[cat.key] && <Check size={12} />}
                  </span>
                </button>
              ))}
            </div>

            {/* Frequency selector pill boxes */}
            <div className="rounded-[24px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5">Reminders Frequency</h3>
              <div className="flex bg-slate-50 p-1 rounded-2xl">
                {[
                  { key: "minimal", label: "Minimal" },
                  { key: "balanced", label: "Balanced" },
                  { key: "frequent", label: "Frequent" },
                ].map((freq) => (
                  <button
                    key={freq.key}
                    onClick={() => setFrequency(freq.key as any)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
                    style={{
                      background: frequency === freq.key ? green : "transparent",
                      color: frequency === freq.key ? "white" : muted,
                    }}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Silent hours setting inputs */}
            <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-3" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quiet Hours</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Quiet Start</span>
                  <input
                    type="time"
                    className="w-full bg-slate-50 p-2.5 rounded-xl border-none outline-none font-bold text-slate-600"
                    value={silentStart}
                    onChange={(e) => setSilentStart(e.target.value)}
                  />
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Quiet End</span>
                  <input
                    type="time"
                    className="w-full bg-slate-50 p-2.5 rounded-xl border-none outline-none font-bold text-slate-600"
                    value={silentEnd}
                    onChange={(e) => setSilentEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Travel Mode Toggle */}
            <div className="rounded-[24px] bg-white p-5 border border-slate-100 flex items-center justify-between" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
              <div>
                <span className="text-sm font-bold block" style={{ color: ink }}>Travel Mode</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Reduces frequency & adjusts time zone sugerences</span>
              </div>
              <button
                onClick={() => setTravelMode(!travelMode)}
                className="w-12 h-6.5 rounded-full p-1 transition-all flex items-center justify-start cursor-pointer"
                style={{
                  background: travelMode ? green : "#e2e8f0",
                  justifyContent: travelMode ? "flex-end" : "flex-start",
                }}
              >
                <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md inline-block" />
              </button>
            </div>
          </>
        )}
      </div>
    </ScreenShell>
  );
}
