import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import { Screen } from "../types";

export default function ReminderCelebrationScreen({ 
  onBack, 
  onNavigate,
  userName
}: { 
  onBack: () => void; 
  onNavigate: (screen: Screen) => void;
  userName: string;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col p-6 justify-between select-none" style={{ background: "linear-gradient(135deg, #10201a 0%, #19382c 100%)" }}>
      {/* Decorative floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute h-4 w-4 bg-[#34c759] rounded-full top-12 left-10 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="absolute h-3 w-3 bg-[#0ea5e9] rotate-45 top-28 right-12 animate-bounce" style={{ animationDelay: "200ms" }} />
        <div className="absolute h-5.5 w-3 bg-amber-400 rounded-lg top-1/2 left-20 animate-bounce" style={{ animationDelay: "400ms" }} />
        <div className="absolute h-4 w-4 bg-rose-500 rounded-full bottom-20 right-20 animate-bounce" style={{ animationDelay: "150ms" }} />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#6d8779]">Goal Unlocked</span>
        <button onClick={onBack} className="text-xs font-bold text-[#f43f5e]">Dismiss</button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-[280px] mx-auto space-y-6">
        <span className="text-6xl">🏆</span>
        <div>
          <h1 className="text-3xl font-black tracking-wide text-white">7-Day Streak!</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-[#9bb2a5]">
            Amazing dedication, {userName || "User"}! You've logged your nutrition targets consistently for a whole week.
          </p>
        </div>

        <div className="w-full bg-white/06 border border-white/10 rounded-2xl p-4 text-left">
          <span className="text-[9px] uppercase text-white/50 block font-bold tracking-wider">Achievement Metrics</span>
          <span className="text-xs text-white/80 mt-1 block">Consistency rating is up by **24%**. Health rating stabilized.</span>
        </div>
      </div>

      <div className="space-y-3">
        <PrimaryButton onClick={() => onNavigate("progress-dashboard")}>
          View Progress Board
        </PrimaryButton>
        <button
          onClick={onBack}
          className="w-full text-center text-xs font-bold uppercase tracking-wider text-white/60 py-2.5"
        >
          Share Achievement
        </button>
      </div>
    </div>
  );
}
