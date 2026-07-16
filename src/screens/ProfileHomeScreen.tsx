import { ChevronRight } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import BottomNav from "../components/layout/BottomNav";
import { ink, muted } from "../constants";
import { Screen } from "../types";
import { getGreeting, getHealthScore } from "../utils";
import { GoalConfig } from "../types";

export default function ProfileHomeScreen({
  onNavigate,
  userWeight,
  goals,
  userName,
  caloriesLogged,
  waterLogged,
  completedHabits,
}: {
  onNavigate: (screen: Screen) => void;
  userWeight: number;
  goals: GoalConfig;
  userName: string;
  caloriesLogged: number;
  waterLogged: number;
  completedHabits: { [key: string]: boolean };
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col" style={{ background: "#f8fdfb" }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-24 pt-11 space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#34C759] to-[#00C4B0] flex items-center justify-center text-white text-2xl font-black shadow-md border-2 border-white uppercase">
            {userName ? userName.charAt(0) : "U"}
          </div>
          <div>
            <h1 className="text-2xl font-black leading-tight" style={{ color: ink }}>
              {getGreeting()}, {userName || "User"} 👋
            </h1>
            <p className="text-xs font-semibold" style={{ color: muted }}>
              Your health journey is improving every day.
            </p>
          </div>
        </div>

        {/* Health Score Card */}
        <div className="rounded-[28px] bg-white p-5 border border-[#34C759]/12 flex items-center justify-between" style={{ boxShadow: "0 8px 24px rgba(16,32,26,0.04)" }}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Health Score</span>
            <span className="text-3xl font-black block" style={{ color: ink }}>
              {getHealthScore(caloriesLogged, waterLogged, goals, completedHabits)}
              <span className="text-base text-slate-400 font-semibold"> / 100</span>
            </span>
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block"
              style={{
                background: getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 76 ? "#f2faf5" : getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 51 ? "#e0f2fe" : "#fff7ed",
                color: getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 76 ? "#197a38" : getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 51 ? "#0EA5E9" : "#ea580c"
              }}
            >
              {getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 76 ? "Excellent Progress" : getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 51 ? "Good Progress" : "Needs Attention"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-[#34C759] block">
              {getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 76 ? "↑ +4 this week" : getHealthScore(caloriesLogged, waterLogged, goals, completedHabits) >= 51 ? "→ stable" : "↓ lower"}
            </span>
            <span className="text-[9px] text-slate-400 font-medium mt-0.5 block">Vs last 14 days</span>
          </div>
        </div>

        {/* Stats Passport Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl bg-white p-3 border border-slate-100/60" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Weight</span>
            <span className="text-xs font-black block mt-2 text-slate-700">{userWeight} kg</span>
            <span className="text-[8px] text-slate-400 block mt-0.5">Target: {goals.weight}kg</span>
          </div>
          <div className="rounded-2xl bg-white p-3 border border-slate-100/60" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Calories</span>
            <span className="text-xs font-black block mt-2 text-slate-700">{goals.calories} kcal</span>
            <span className="text-[8px] text-slate-400 block mt-0.5">Active limit</span>
          </div>
          <div className="rounded-2xl bg-white p-3 border border-slate-100/60" style={{ boxShadow: "0 4px 12px rgba(16,32,26,0.02)" }}>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Protein</span>
            <span className="text-xs font-black block mt-2 text-slate-700">{goals.protein}g</span>
            <span className="text-[8px] text-slate-400 block mt-0.5">Macro target</span>
          </div>
        </div>

        {/* Achievements badging display */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Badges</h3>
          <div className="flex gap-2">
            {["🏆", "🥗", "💪", "⚡"].map((badge, idx) => (
              <span key={idx} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-slate-100 text-lg shadow-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Menu Actions */}
        <div className="rounded-[28px] bg-white p-5 border border-slate-100/80 space-y-3" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Passport Submenus</h3>
          {[
            { label: "Personal Information", screen: "profile-personal" as Screen, desc: "Edit name, email, phone" },
            { label: "Health Profile", screen: "profile-health" as Screen, desc: "Lifestyle, allergies, dietary constraints" },
            { label: "Goals Manager", screen: "profile-goals" as Screen, desc: "Configure nutrition and targets" },
            { label: "AI Personalization (Liva)", screen: "profile-liva" as Screen, desc: "What Liva knows & memory timeline" },
            { label: "Connected Devices", screen: "profile-devices" as Screen, desc: "Sync Apple Watch & Garmin logs" },
            { label: "Premium Upgrade", screen: "profile-premium" as Screen, desc: "View plan details and benefits" },
            { label: "Privacy & Security", screen: "profile-privacy" as Screen, desc: "Biometrics and data memory control" },
            { label: "Help & Support FAQs", screen: "profile-help" as Screen, desc: "Contact support and rate app" },
            { label: "General Settings", screen: "profile-settings" as Screen, desc: "Accessibility text, theme, units" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className="w-full flex items-center justify-between text-left pb-2 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 rounded-lg p-1 transition-all"
            >
              <div>
                <span className="text-xs font-bold block" style={{ color: ink }}>{item.label}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">{item.desc}</span>
              </div>
              <ChevronRight size={16} color="#9bb2a5" />
            </button>
          ))}
        </div>
      </div>
      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
