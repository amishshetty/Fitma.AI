import { Check, Trash2, Plus } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import ConfidenceBadge from "../components/ui/ConfidenceBadge";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted, mealItems } from "../constants";
import { Screen } from "../types";

export default function MealConfirmationScreen({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <ScreenShell
      title="Did I get this right?"
      subtitle="Review the foods Liva detected."
      onBack={onBack}
      footer={
        <PrimaryButton onClick={onContinue}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-3">
        {mealItems.map((item) => (
          <div key={item.name} className="rounded-[24px] bg-white p-4" style={{ boxShadow: "0 5px 18px rgba(16,32,26,0.06)" }}>
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full text-white" style={{ background: green }}>
                <Check size={16} />
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-bold" style={{ color: ink }}>
                      {item.name}
                    </p>
                    <p className="text-xs" style={{ color: muted }}>
                      {item.serving} - {item.calories} kcal
                    </p>
                  </div>
                  <ConfidenceBadge value={item.confidence} />
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-full bg-[#f2faf5] px-4 py-2 text-xs font-bold" style={{ color: ink }}>
                    Edit
                  </button>
                  <button className="flex items-center gap-1 rounded-full bg-[#fff1f2] px-4 py-2 text-xs font-bold text-[#e11d48]">
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-bold" style={{ color: green, border: "1.5px dashed rgba(52,199,89,0.35)" }}>
          <Plus size={18} />
          Add another food
        </button>
      </div>
    </ScreenShell>
  );
}
