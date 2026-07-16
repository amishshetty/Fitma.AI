import { Clock3 } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function SaveMealScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [mealType, setMealType] = useState("Lunch");
  return (
    <ScreenShell
      title="Save Meal"
      subtitle="One last check before your dashboard updates."
      onBack={onBack}
      footer={<PrimaryButton onClick={onSave}>Save Meal</PrimaryButton>}
    >
      <div className="space-y-5">
        <div className="rounded-[28px] bg-white p-5" style={{ boxShadow: "0 8px 26px rgba(16,32,26,0.07)" }}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-bold" style={{ color: ink }}>
              Roti, Dal and Rice
            </p>
            <p className="text-lg font-bold" style={{ color: green }}>
              610
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {["22g Protein", "115g Carbs", "8g Fat"].map((item) => (
              <div key={item} className="rounded-2xl bg-[#f2faf5] px-2 py-3 text-xs font-bold" style={{ color: ink }}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <section>
          <h2 className="mb-3 text-sm font-bold" style={{ color: ink }}>
            Meal Type
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {["Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className="rounded-2xl px-2 py-3 text-xs font-bold"
                style={{ background: mealType === type ? green : "white", color: mealType === type ? "white" : muted }}
              >
                {type}
              </button>
            ))}
          </div>
        </section>
        <section className="space-y-3">
          <label className="block text-sm font-bold" style={{ color: ink }}>
            Time
          </label>
          <button className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-4 text-left text-sm font-semibold" style={{ color: ink }}>
            <Clock3 size={19} color={green} />
            Today, 1:20 PM
          </button>
        </section>
        <section className="space-y-3">
          <label className="block text-sm font-bold" style={{ color: ink }}>
            Notes
          </label>
          <textarea className="min-h-24 w-full resize-none rounded-2xl bg-white p-4 text-sm outline-none" placeholder="Add notes..." />
        </section>
      </div>
    </ScreenShell>
  );
}
