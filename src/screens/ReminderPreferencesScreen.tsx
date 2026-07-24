import React, { useState } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";
import { CheckCircle2 } from "lucide-react";

export default function ReminderPreferencesScreen({ onBack }: { onBack: () => void }) {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [prefs, setPrefs] = useState({
    meals: true,
    water: true,
    protein: true,
    weekly: true,
    weight: true,
  });
  const [frequency, setFrequency] = useState<"Minimal" | "Balanced" | "Frequent">("Balanced");

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = [
    { key: "meals", label: "Meal Reminders", desc: "Adaptive meal timing logs" },
    { key: "water", label: "Water Hydration logs", desc: "Adaptive glass indicators" },
    { key: "protein", label: "Protein Targets", desc: "Alerts when macros fall behind" },
    { key: "weekly", label: "Weekly Reports", desc: "Weekly health summaries" },
    { key: "weight", label: "Weight Check-ins", desc: "Goal progression checkups" },
  ] as const;

  return (
    <ScreenShell
      title="Smart Reminders"
      subtitle="Reminders adapt dynamically based on your daily schedule."
      onBack={onBack}
      footer={
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {}}
            className="w-full flex items-center justify-center rounded-[18px] text-white text-[15px] font-semibold transition-all hover:opacity-90"
            style={{ background: "#34C759", minHeight: "56px", boxShadow: "0 8px 16px rgba(52,199,89,0.2)" }}
          >
            Preview Liva Reminders
          </button>
          <button 
            onClick={onBack}
            className="w-full flex items-center justify-center rounded-[18px] bg-white text-[15px] font-semibold transition-all hover:bg-slate-50"
            style={{ color: "#64748b", border: "1px solid #e2e8f0", minHeight: "56px" }}
          >
            Save Preferences
          </button>
        </div>
      }
    >
      <div className="space-y-6 pb-8">
        
        {/* Master AI Toggle */}
        <div className="rounded-[26px] bg-white p-5 border border-slate-100 flex items-center justify-between" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div>
            <span className="text-sm font-bold block" style={{ color: ink }}>Enable AI Reminders</span>
            <span className="text-[11px] block mt-0.5" style={{ color: "#8da396" }}>Allow Liva to optimize trigger timing</span>
          </div>
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            className="w-[50px] h-7 rounded-full p-0.5 transition-all flex items-center cursor-pointer"
            style={{
              background: aiEnabled ? green : "#cbd5e1",
              justifyContent: aiEnabled ? "flex-end" : "flex-start",
            }}
          >
            <span className="w-6 h-6 rounded-full bg-white shadow inline-block" />
          </button>
        </div>

        {/* Categories */}
        <div className="rounded-[26px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-[11px] font-extrabold uppercase tracking-wide mb-4" style={{ color: "#8da396" }}>
            Enabled Categories
          </h3>
          
          <div className="space-y-4">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat.key}>
                <button
                  onClick={() => togglePref(cat.key)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <div>
                    <span className="text-sm font-bold block" style={{ color: ink }}>{cat.label}</span>
                    <span className="text-[11px] block mt-0.5 transition-colors" style={{ color: "#8da396" }}>
                      {cat.desc}
                    </span>
                  </div>
                  <div className={`transition-transform duration-200 ${prefs[cat.key] ? 'scale-100' : 'scale-90 opacity-40'}`}>
                    {prefs[cat.key] ? (
                      <CheckCircle2 size={22} color="white" fill={green} strokeWidth={2} />
                    ) : (
                      <div className="w-[22px] h-[22px] rounded-full border-2 border-[#cbd5e1]" />
                    )}
                  </div>
                </button>
                {idx < categories.length - 1 && (
                  <div className="h-px w-full bg-slate-50" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div className="rounded-[26px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-[11px] font-extrabold uppercase tracking-wide mb-4" style={{ color: "#8da396" }}>
            Reminders Frequency
          </h3>
          
          <div className="flex bg-[#f4f9f6] p-1 rounded-2xl relative">
            <div 
              className="absolute top-1 bottom-1 w-1/3 bg-[#34C759] rounded-xl transition-transform duration-300 shadow-sm"
              style={{
                transform: `translateX(${frequency === 'Minimal' ? '0%' : frequency === 'Balanced' ? '100%' : '200%'})`,
              }}
            />
            {["Minimal", "Balanced", "Frequent"].map((opt) => (
              <button
                key={opt}
                onClick={() => setFrequency(opt as any)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl relative z-10 transition-colors duration-300 ${frequency === opt ? 'text-white' : 'text-[#6d8779]'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

      </div>
    </ScreenShell>
  );
}
