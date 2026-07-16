import { Droplets } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink } from "../constants";
import { Screen } from "../types";
import { GoalConfig } from "../types";

export default function LivaWaterScreen({
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
  const glassPercent = Math.min(100, Math.round((waterLogged / waterGoal) * 100));

  return (
    <ScreenShell
      title="Water visualizer"
      subtitle="Interactive hydration tracker."
      onBack={onBack}
      footer={<PrimaryButton onClick={onBack}>Close Tracker</PrimaryButton>}
    >
      <div className="space-y-6 flex flex-col justify-center">
        {/* Fill Glass Card */}
        <div className="rounded-[28px] bg-white p-6 border border-[#34C759]/12 flex justify-around items-center" style={{ boxShadow: "0 8px 24px rgba(16,32,26,0.05)" }}>
          {/* Visual Glass Container */}
          <div className="relative h-44 w-24 border-4 border-slate-200 rounded-b-3xl rounded-t-lg overflow-hidden flex flex-col justify-end bg-slate-50">
            {/* Water levels inside */}
            <motion.div
              animate={{ height: `${glassPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full bg-[#00c4b0]/80 relative"
              style={{ height: "0%" }}
            >
              {/* Dynamic bubble/wave effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#00c4b0] opacity-80" />
            </motion.div>
            
            {/* Glass metrics display */}
            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-sm" style={{ color: glassPercent > 50 ? "white" : ink }}>
              {glassPercent}%
            </div>
          </div>

          <div className="text-left space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logged Today</span>
            <span className="text-2xl font-extrabold block" style={{ color: ink }}>
              {(waterLogged / 1000).toFixed(2)} L
            </span>
            <span className="text-xs text-slate-400 font-semibold block">Target: {(waterGoal / 1000).toFixed(2)} L</span>
            <button
              onClick={() => onLogWater(-waterLogged)}
              className="text-[10px] font-bold uppercase tracking-wider text-[#f43f5e] mt-2 block"
            >
              Reset Log
            </button>
          </div>
        </div>

        {/* Quick Log Buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => onLogWater(250)}
            className="rounded-2xl bg-white p-4.5 text-center border border-[#00c4b0]/16 hover:bg-[#e9fbf7] transition-all"
            style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}
          >
            <Droplets className="mx-auto text-[#00c4b0]" size={20} />
            <span className="block text-xs font-bold mt-2" style={{ color: ink }}>+250ml</span>
            <span className="text-[9px] text-slate-400">Cup</span>
          </button>
          <button
            onClick={() => onLogWater(500)}
            className="rounded-2xl bg-white p-4.5 text-center border border-[#00c4b0]/16 hover:bg-[#e9fbf7] transition-all"
            style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}
          >
            <Droplets className="mx-auto text-[#00c4b0]" size={20} />
            <span className="block text-xs font-bold mt-2" style={{ color: ink }}>+500ml</span>
            <span className="text-[9px] text-slate-400">Bottle</span>
          </button>
          <button
            onClick={() => onLogWater(1000)}
            className="rounded-2xl bg-white p-4.5 text-center border border-[#00c4b0]/16 hover:bg-[#e9fbf7] transition-all"
            style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.03)" }}
          >
            <Droplets className="mx-auto text-[#00c4b0]" size={20} />
            <span className="block text-xs font-bold mt-2" style={{ color: ink }}>+1000ml</span>
            <span className="text-[9px] text-slate-400">Flask</span>
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
