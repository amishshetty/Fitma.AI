import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import BottomNav from "../components/layout/BottomNav";
import ScreenShell from "./ScreenShell";
import { ink, muted } from "../constants";
import { Screen, EntryMode } from "../types";
import { quickOptions } from "../constants";

export default function QuickLogScreen({
  onSelect,
  onBack,
  onNavigate,
}: {
  onSelect: (mode: EntryMode) => void;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <ScreenShell title="Log Your Meal" subtitle="Choose the easiest way." onBack={onBack}>
        <div className="space-y-4">
          {quickOptions.map((option) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.title}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(option.mode)}
                className="flex w-full items-center gap-5 rounded-[28px] bg-white p-5 text-left"
                style={{ boxShadow: "0 8px 24px rgba(16,32,26,0.07)" }}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-[22px]" style={{ background: option.bg, color: option.tint }}>
                  <Icon size={30} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold" style={{ color: ink }}>
                    {option.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed" style={{ color: muted }}>
                    {option.description}
                  </span>
                </span>
                <ChevronRight size={20} color="#9bb2a5" />
              </motion.button>
            );
          })}
          <div className="pt-4">
            <h2 className="mb-3 text-sm font-bold" style={{ color: ink }}>
              Recent Meals
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {["Paneer Paratha", "Chicken Biryani", "Dal Rice", "Oats Breakfast"].map((meal) => (
                <button key={meal} className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold" style={{ color: ink, border: "1px solid rgba(52,199,89,0.14)" }}>
                  {meal}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScreenShell>
      <BottomNav active="log" onNavigate={onNavigate} />
    </div>
  );
}
