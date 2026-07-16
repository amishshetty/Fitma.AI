import { Check } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ProgressRing from "../components/ui/ProgressRing";
import SecondaryButton from "../components/ui/SecondaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function MealSuccessScreen({ onDashboard, onLogAnother }: { onDashboard: () => void; onLogAnother: () => void }) {
  return (
    <ScreenShell
      footer={
        <div className="space-y-3">
          <PrimaryButton onClick={onDashboard}>View Dashboard</PrimaryButton>
          <SecondaryButton onClick={onLogAnother}>Log Another Meal</SecondaryButton>
        </div>
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-7 text-center">
        <div className="relative">
          <ProgressRing value={40} size={154} label="closer" />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.35 }} className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full text-white" style={{ background: green }}>
              <Check size={42} />
            </div>
          </motion.div>
        </div>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: ink }}>
            Meal Logged
          </h1>
          <p className="mt-3 text-base leading-relaxed" style={{ color: muted }}>
            Great job! You're 40% closer to today's nutrition goal.
          </p>
        </div>
      </div>
    </ScreenShell>
  );
}
