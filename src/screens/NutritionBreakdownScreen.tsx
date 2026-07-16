import { Egg, Wheat, Droplets, Leaf } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import NutritionCard from "../components/ui/NutritionCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import ProgressRing from "../components/ui/ProgressRing";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function NutritionBreakdownScreen({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <ScreenShell
      title="Nutrition Breakdown"
      subtitle="A clean summary before you save."
      onBack={onBack}
      footer={<PrimaryButton onClick={onContinue}>Continue</PrimaryButton>}
    >
      <div className="space-y-5">
        <div className="rounded-[28px] bg-white p-5 text-center" style={{ boxShadow: "0 8px 26px rgba(16,32,26,0.07)" }}>
          <ProgressRing value={40} size={132} label="today" />
          <p className="mt-4 text-4xl font-bold" style={{ color: ink }}>
            610
          </p>
          <p className="text-sm font-semibold" style={{ color: muted }}>
            calories in this meal
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NutritionCard icon={<Egg size={20} />} label="Protein" value="22g" color="#6366f1" />
          <NutritionCard icon={<Wheat size={20} />} label="Carbs" value="115g" color="#fb923c" />
          <NutritionCard icon={<Droplets size={20} />} label="Fat" value="8g" color="#f59e0b" />
          <NutritionCard icon={<Leaf size={20} />} label="Fiber" value="11g" color={green} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 text-center">
            <ProgressRing value={76} size={86} color="#0EA5E9" label="water" />
            <p className="mt-2 text-xs font-semibold" style={{ color: muted }}>
              Water balance
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center">
            <ProgressRing value={84} size={86} color={green} label="score" />
            <p className="mt-2 text-xs font-semibold" style={{ color: muted }}>
              Healthy score
            </p>
          </div>
        </div>
        <div className="rounded-[24px] p-4" style={{ background: "linear-gradient(135deg, #e9faef, #ffffff)", border: "1px solid rgba(52,199,89,0.18)" }}>
          <div className="flex gap-3">
            <LivaAvatar size={42} />
            <div>
              <p className="text-sm font-bold" style={{ color: ink }}>
                AI Insight
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: muted }}>
                Great protein intake. You may need more vegetables to balance this meal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
