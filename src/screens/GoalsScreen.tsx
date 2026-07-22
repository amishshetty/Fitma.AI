import { Flame, Target, Leaf, Wheat, Sparkles, Search } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ProgressDots from "../components/ui/ProgressDots";
import SecondaryButton from "../components/ui/SecondaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green } from "../constants";
import { Screen } from "../types";

export default function GoalsScreen({ onNext, onSkip }: { onNext: (goal: string) => void; onSkip: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const goals = [
    { label: "Lose Weight", icon: Flame, color: "#fb923c" },
    { label: "Gain Muscle", icon: Target, color: "#6366f1" },
    { label: "Eat Healthier", icon: Leaf, color: green },
    { label: "Maintain Weight", icon: Wheat, color: "#06b6d4" },
    { label: "Improve Energy", icon: Sparkles, color: "#f59e0b" },
    { label: "Just Exploring", icon: Search, color: "#94a3b8" },
  ];

  return (
    <ScreenShell
      title="What would you like to achieve?"
      subtitle="Liva will personalize your experience based on your goal."
      footer={
        <div className="space-y-3">
          <PrimaryButton onClick={() => selected !== null && onNext(goals[selected].label)} disabled={selected === null}>
            Continue
          </PrimaryButton>
          <SecondaryButton onClick={onSkip}>Skip for now</SecondaryButton>
          <ProgressDots total={5} current={3} />
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          const active = selected === index;
          return (
            <button
              key={goal.label}
              onClick={() => setSelected(index)}
              className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-[24px] bg-white p-4 text-center"
              style={{
                border: active ? `2px solid ${goal.color}` : "2px solid rgba(16,32,26,0.06)",
                boxShadow: active ? `0 8px 20px ${goal.color}24` : "0 4px 14px rgba(16,32,26,0.05)",
              }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${goal.color}18`, color: goal.color }}>
                <Icon size={23} />
              </span>
              <span className="text-sm font-bold" style={{ color: active ? goal.color : ink }}>
                {goal.label}
              </span>
            </button>
          );
        })}
      </div>
    </ScreenShell>
  );
}
