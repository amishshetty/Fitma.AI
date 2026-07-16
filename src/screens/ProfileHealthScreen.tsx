import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function ProfileHealthScreen({
  onBack,
  activity: initialActivity,
  preferences: initialPreferences,
  allergies: initialAllergies,
  onUpdateHealth,
}: {
  onBack: () => void;
  activity: "sedentary" | "light" | "moderate" | "athlete";
  preferences: any;
  allergies: any;
  onUpdateHealth: (activity: any, preferences: any, allergies: any) => void;
}) {
  const [activity, setActivity] = useState(initialActivity);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [allergies, setAllergies] = useState(initialAllergies);
  const [bloodReportUploaded, setBloodReportUploaded] = useState(false);
  const [success, setSuccess] = useState(false);

  const togglePref = (key: string) => {
    setPreferences((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllergy = (key: string) => {
    setAllergies((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpload = () => {
    setBloodReportUploaded(true);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  const handleSave = () => {
    onUpdateHealth(activity, preferences, allergies);
    onBack();
  };

  return (
    <ScreenShell
      title="Health Profile"
      subtitle="Medical markers and activity details used by Liva."
      onBack={onBack}
      footer={<PrimaryButton onClick={handleSave}>Save preferences</PrimaryButton>}
    >
      <div className="space-y-5 pb-8">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 bg-[#f2faf5] text-[#197a38] text-xs font-bold border border-[#34c759]/20"
          >
            ✓ Success: Blood report uploaded and synchronized.
          </motion.div>
        )}

        {/* Activity Level pills */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lifestyle Activity</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "sedentary", label: "Sedentary", desc: "Desk job, low movement" },
              { key: "light", label: "Lightly Active", desc: "Occasional walking" },
              { key: "moderate", label: "Moderately Active", desc: "Daily workouts" },
              { key: "athlete", label: "Athlete Mode", desc: "Extreme sports focus" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActivity(item.key as any)}
                className="rounded-2xl p-3.5 text-left border transition-all text-xs font-bold"
                style={{
                  borderColor: activity === item.key ? green : "rgba(16,32,26,0.06)",
                  background: activity === item.key ? "#f2faf5" : "white",
                  color: activity === item.key ? green : ink,
                }}
              >
                <span className="block">{item.label}</span>
                <span className="text-[9px] text-slate-400 font-medium block mt-0.5">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Food Preferences tags */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5">Dietary Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "veg", label: "Vegetarian" },
              { key: "egg", label: "Eggetarian" },
              { key: "nonveg", label: "Non-Vegetarian" },
              { key: "vegan", label: "Vegan" },
              { key: "jain", label: "Jain Food" },
            ].map((diet) => {
              const active = (preferences as any)[diet.key];
              return (
                <button
                  key={diet.key}
                  onClick={() => togglePref(diet.key)}
                  className="rounded-full px-4 py-2 text-xs font-bold transition-all"
                  style={{
                    background: active ? green : "#f8fdfb",
                    color: active ? "white" : muted,
                    border: active ? `1px solid ${green}` : "1px solid rgba(16,32,26,0.08)",
                  }}
                >
                  {diet.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Allergies */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5">Allergies</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "peanuts", label: "🥜 Peanuts" },
              { key: "gluten", label: "🌾 Gluten" },
              { key: "dairy", label: "🥛 Dairy Lactose" },
              { key: "shellfish", label: "🦐 Shellfish" },
            ].map((allergy) => {
              const active = (allergies as any)[allergy.key];
              return (
                <button
                  key={allergy.key}
                  onClick={() => toggleAllergy(allergy.key)}
                  className="rounded-full px-4 py-2 text-xs font-bold transition-all"
                  style={{
                    background: active ? "#f43f5e" : "#fbf8f9",
                    color: active ? "white" : muted,
                    border: active ? "1px solid #f43f5e" : "1px solid rgba(16,32,26,0.08)",
                  }}
                >
                  {allergy.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blood report upload */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 text-center" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left mb-3">Report Synchronizer</h3>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col justify-center items-center gap-3">
            <span className="text-3xl">📄</span>
            {bloodReportUploaded ? (
              <span className="text-xs font-bold text-[#197a38]">Report_July_2026.pdf synced</span>
            ) : (
              <>
                <div>
                  <span className="text-xs font-bold block text-slate-600">Upload Blood Report</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Let Liva adjust micronutrient goals automatically</span>
                </div>
                <button
                  onClick={handleUpload}
                  className="rounded-full bg-white px-4 py-1.5 text-[10px] font-bold border border-[#34c759] text-[#34c759]"
                >
                  Upload File
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
