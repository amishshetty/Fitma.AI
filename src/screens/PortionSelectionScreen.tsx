import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import QuantityStepper from "../components/ui/QuantityStepper";
import ScreenShell from "./ScreenShell";
import { ink, green, muted, mealItems } from "../constants";
import { Screen } from "../types";

export default function PortionSelectionScreen({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [quantities, setQuantities] = useState([2, 1, 1]);
  const calories = mealItems.reduce((sum, item, index) => sum + item.calories * quantities[index], 0);

  return (
    <ScreenShell
      title="Portion Selection"
      subtitle="Fine tune portions before saving."
      onBack={onBack}
      footer={
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
            <span className="text-sm font-semibold" style={{ color: muted }}>
              Live calories
            </span>
            <span className="text-xl font-bold" style={{ color: green }}>
              {calories} kcal
            </span>
          </div>
          <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
        </div>
      }
    >
      <div className="space-y-3">
        {mealItems.map((item, index) => (
          <div key={item.name} className="rounded-[24px] bg-white p-4" style={{ boxShadow: "0 5px 18px rgba(16,32,26,0.06)" }}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-base font-bold" style={{ color: ink }}>
                  {item.name}
                </p>
                <p className="text-xs" style={{ color: muted }}>
                  {item.calories * quantities[index]} kcal
                </p>
              </div>
              <QuantityStepper
                value={quantities[index]}
                onChange={(value) =>
                  setQuantities((previous) => {
                    const next = [...previous];
                    next[index] = value;
                    return next;
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-2xl bg-[#f2faf5] px-3 py-3 text-left text-xs font-bold" style={{ color: ink }}>
                Portion size
                <span className="mt-1 block font-semibold" style={{ color: muted }}>
                  Medium
                </span>
              </button>
              <button className="rounded-2xl bg-[#f2faf5] px-3 py-3 text-left text-xs font-bold" style={{ color: ink }}>
                Weight
                <span className="mt-1 block font-semibold" style={{ color: muted }}>
                  120 g
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}
