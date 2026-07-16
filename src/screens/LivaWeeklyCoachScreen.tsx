import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function LivaWeeklyCoachScreen({ 
  onBack, 
  onFinish,
  userName
}: { 
  onBack: () => void; 
  onFinish: () => void;
  userName: string;
}) {
  const metrics = [
    { label: "Calories Target", value: "92%", color: green },
    { label: "Protein Consistency", value: "78%", color: "#0EA5E9" },
    { label: "Hydration Streak", value: "6/7 days", color: "#00C4B0" },
    { label: "Active Minutes", value: "180 min", color: "#fb923c" }
  ];

  const [coachResponse, setCoachResponse] = useState<string | null>(null);

  const handleAskCoach = (question: string) => {
    setCoachResponse(null);
    setTimeout(() => {
      if (question.includes("wednesday")) {
        setCoachResponse("Liva Coach: On Wednesday, you had a late lunch at 3:15 PM, which caused you to skip your afternoon hydration slot and overeat 420 kcal of processed snacks at 7:30 PM.");
      } else {
        setCoachResponse("Liva Coach: Next week, to hit your 120g protein target, prepare breakfast quinoa bowls ahead of time. This guarantees 30g of protein within an hour of waking up.");
      }
    }, 800);
  };

  return (
    <ScreenShell
      title="Weekly Coach Audit"
      subtitle="Insights and explanations about your past week parameters."
      onBack={onBack}
      footer={<PrimaryButton onClick={onFinish}>Finish Weekly Checkin</PrimaryButton>}
    >
      <div className="space-y-4">
        {/* Progress chart illustration */}
        <div className="rounded-[28px] bg-white p-5 border border-[#34C759]/10 text-center" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.04)" }}>
          <div className="flex h-36 items-end justify-between px-4 pb-2">
            {[45, 60, 75, 55, 90, 80, 70].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 w-7">
                <div className="w-full rounded-full transition-all bg-[#e4f4ea] relative h-28">
                  <div className="absolute bottom-0 left-0 right-0 rounded-full" style={{ height: `${h}%`, background: green }} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coach Voice Text Card */}
        <div className="rounded-[24px] p-4.5 bg-white border border-[#34C759]/10" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.04)" }}>
          <div className="flex gap-3">
            <LivaAvatar size={42} floating />
            <div>
              <p className="text-sm font-bold" style={{ color: ink }}>Liva Coach Insights</p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: muted }}>
                {userName || "User"}, you stayed within your calorie goal on <span className="text-[#34C759] font-bold">5 of the last 7 days</span>. Let's analyze your off-target slots below.
              </p>
            </div>
          </div>
        </div>

        {/* Ask Liva Coach Interactive Section */}
        <div className="rounded-[24px] bg-white p-5 border border-[#34C759]/06 space-y-3" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
          <span className="text-xs font-bold block" style={{ color: ink }}>Analyze Week Anomalies</span>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleAskCoach("wednesday")}
              className="text-left bg-[#f2faf5] hover:bg-[#e4f4ea] p-2.5 rounded-xl text-xs font-semibold"
              style={{ color: ink }}
            >
              ❓ Why did I peak calorie-wise on Wednesday?
            </button>
            <button
              onClick={() => handleAskCoach("protein")}
              className="text-left bg-[#f2faf5] hover:bg-[#e4f4ea] p-2.5 rounded-xl text-xs font-semibold"
              style={{ color: ink }}
            >
              ❓ How can I hit protein targets next week?
            </button>
          </div>

          {coachResponse && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-white border border-[#34C759]/16 rounded-2xl text-xs leading-relaxed"
              style={{ color: muted }}
            >
              {coachResponse}
            </motion.div>
          )}
        </div>

        {/* Stat metrics cards */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m, idx) => (
            <div key={idx} className="rounded-2xl bg-white p-4 border border-[#34C759]/06" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}>
              <span className="text-[10px] font-bold text-slate-400 block">{m.label}</span>
              <span className="text-base font-extrabold block mt-1.5" style={{ color: ink }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
