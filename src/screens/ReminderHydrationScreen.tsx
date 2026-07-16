import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink } from "../constants";
import { Screen } from "../types";
import { GoalConfig } from "../types";

export default function ReminderHydrationScreen({
  onBack,
  waterLogged,
  goals,
  onLogWater,
}: {
  onBack: () => void;
  waterLogged: number;
  goals: GoalConfig;
  onLogWater: (amount: number) => void;
}) {
  const waterGoal = goals.water;
  const cylinderPercent = Math.min(100, Math.round((waterLogged / waterGoal) * 100));

  return (
    <ScreenShell
      title="Hydration Check"
      subtitle="You're only halfway to today's water goal."
      onBack={onBack}
      footer={<PrimaryButton onClick={() => onLogWater(500)}>Log 500ml Bottle</PrimaryButton>}
    >
      <div className="space-y-6 flex flex-col justify-center items-center text-center">
        {/* Animated Water Cylinder */}
        <div className="relative h-48 w-32 border-4 border-slate-200 rounded-[32px] overflow-hidden flex flex-col justify-end bg-slate-50">
          <motion.div
            animate={{ height: `${cylinderPercent}%` }}
            transition={{ duration: 0.6 }}
            className="w-full bg-[#00c4b0]/80 relative"
            style={{ height: "0%" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#00c4b0]" />
          </motion.div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center font-extrabold text-sm" style={{ color: cylinderPercent > 40 ? "white" : ink }}>
            <span>{cylinderPercent}%</span>
            <span className="text-[10px] opacity-80 mt-0.5">Hydrated</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logged Today</span>
          <span className="text-2xl font-black block" style={{ color: ink }}>{(waterLogged / 1000).toFixed(2)} L</span>
          <span className="text-xs text-slate-400 font-semibold block">Goal Target: {(waterGoal / 1000).toFixed(2)} L</span>
        </div>

        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2"
        >
          Remind Me Later
        </button>
      </div>
    </ScreenShell>
  );
}
