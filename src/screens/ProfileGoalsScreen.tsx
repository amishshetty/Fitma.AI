import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";
import { GoalConfig } from "../types";

export default function ProfileGoalsScreen({
  onBack,
  goals,
  onUpdateGoals,
}: {
  onBack: () => void;
  goals: GoalConfig;
  onUpdateGoals: (goals: GoalConfig) => void;
}) {
  const [success, setSuccess] = useState(false);

  const applyRecommendation = () => {
    onUpdateGoals({ ...goals, protein: goals.protein + 10 });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  return (
    <ScreenShell
      title="Goals Manager"
      subtitle="Modify daily nutrition budgets and workout limits."
      onBack={onBack}
    >
      <div className="space-y-5 pb-8">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 bg-[#f2faf5] text-[#197a38] text-xs font-bold border border-[#34c759]/20"
          >
            ✓ Success: Liva protein recommendation applied (+10g).
          </motion.div>
        )}

        {/* Target inputs */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-4" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nutrition Targets</h3>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span style={{ color: ink }}>Weight Goal</span>
              <span className="text-[#a855f7]">{goals.weight} kg</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="0.5"
              className="w-full accent-[#a855f7]"
              value={goals.weight}
              onChange={(e) => onUpdateGoals({ ...goals, weight: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span style={{ color: ink }}>Calorie Budget</span>
              <span style={{ color: green }}>{goals.calories} kcal</span>
            </div>
            <input
              type="range"
              min="1500"
              max="3500"
              step="50"
              className="w-full accent-[#34c759]"
              value={goals.calories}
              onChange={(e) => onUpdateGoals({ ...goals, calories: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span style={{ color: ink }}>Protein Intake</span>
              <span className="text-[#0ea5e9]">{goals.protein} g</span>
            </div>
            <input
              type="range"
              min="60"
              max="200"
              step="5"
              className="w-full accent-[#0ea5e9]"
              value={goals.protein}
              onChange={(e) => onUpdateGoals({ ...goals, protein: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span style={{ color: ink }}>Water Target</span>
              <span className="text-[#00c4b0]">{goals.water} ml</span>
            </div>
            <input
              type="range"
              min="1500"
              max="4500"
              step="250"
              className="w-full accent-[#00c4b0]"
              value={goals.water}
              onChange={(e) => onUpdateGoals({ ...goals, water: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Liva Coach Recommendation */}
        <div className="rounded-[24px] p-4.5 bg-white border border-[#34c759]/16 space-y-3" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <div className="flex gap-3">
            <LivaAvatar size={38} floating />
            <div>
              <p className="text-xs font-bold text-[#197a38] uppercase tracking-wide">Liva Goal Audit</p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: muted }}>
                Based on your daily activity levels and moderate workouts, I recommend increasing protein to **{(goals.protein + 10)}g** to recover muscle fibers faster.
              </p>
            </div>
          </div>
          <button
            onClick={applyRecommendation}
            className="w-full bg-[#f2faf5] hover:bg-[#e4f4ea] text-xs font-bold text-[#197a38] py-2.5 rounded-xl transition-all"
          >
            Apply Goal Recommendation
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
