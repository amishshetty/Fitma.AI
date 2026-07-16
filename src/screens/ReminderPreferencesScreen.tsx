import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green } from "../constants";
import { Screen } from "../types";

export default function ReminderPreferencesScreen({ onBack }: { onBack: () => void }) {
  const [prefs, setPrefs] = useState({
    push: true,
    email: false,
    sound: true,
    vibrate: true,
    critical: true,
    suggestions: true,
    dailyDigest: false,
    weeklyReport: true,
    achievements: true,
  });

  const togglePref = (key: string) => {
    setPrefs((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScreenShell
      title="Notification Prefs"
      subtitle="Configure how and when Liva contacts you."
      onBack={onBack}
      footer={<PrimaryButton onClick={onBack}>Save Preferences</PrimaryButton>}
    >
      <div className="space-y-5 pb-8">
        {/* Toggle rows */}
        <div className="rounded-[26px] bg-white p-5 border border-slate-100 space-y-4.5" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          {[
            { key: "push", label: "Push Notifications", desc: "Show immediate coach alerts on screen" },
            { key: "email", label: "Email Digests", desc: "Receive weekly health summaries via email" },
            { key: "sound", label: "Sound alerts", desc: "Play custom tone reminders" },
            { key: "vibrate", label: "Vibration alerts", desc: "Vibrate on notifications receipt" },
            { key: "critical", label: "Critical Warnings", desc: "Override quiet hours for extreme targets" },
            { key: "suggestions", label: "AI suggestions alerts", desc: "Log prompts optimized by Liva" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => togglePref(item.key)}
              className="w-full flex items-center justify-between text-left pb-2 border-b border-slate-50 last:border-b-0"
            >
              <div>
                <span className="text-xs font-bold block" style={{ color: ink }}>{item.label}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">{item.desc}</span>
              </div>
              <button
                className="w-10 h-5.5 rounded-full p-0.5 transition-all flex items-center justify-start cursor-pointer"
                style={{
                  background: (prefs as any)[item.key] ? green : "#cbd5e1",
                  justifyContent: (prefs as any)[item.key] ? "flex-end" : "flex-start",
                }}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow inline-block" />
              </button>
            </button>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
