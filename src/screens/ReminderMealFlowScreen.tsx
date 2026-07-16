import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import ScreenShell from "./ScreenShell";
import { ink } from "../constants";
import { Screen } from "../types";

export default function ReminderMealFlowScreen({
  onBack,
  onLogCalories,
  userName,
}: {
  onBack: () => void;
  onLogCalories: (kcal: number) => void;
  userName: string;
}) {
  const [response, setResponse] = useState<string | null>(null);

  const handleSelection = (choice: "yes" | "not_yet" | "skip") => {
    if (choice === "yes") {
      onLogCalories(610); // Log average lunch calories
      setResponse("Liva Coach: Awesome! I've logged your average lunch (610 kcal) onto your calories dashboard. Total calorie deficit is updated.");
    } else if (choice === "not_yet") {
      setResponse("Liva Coach: Understood! Take your time. I will remind you again in 45 minutes to keep digestion targets stable.");
    } else {
      setResponse("Liva Coach: Alright! Skip day recorded. Try adjusting dinner protein limits to balance today's macro splits.");
    }
  };

  return (
    <ScreenShell
      title="Adaptive Meal Check"
      subtitle="Context detection shows you haven't logged lunch yet."
      onBack={onBack}
    >
      <div className="space-y-6 flex flex-col justify-center py-6 text-center max-w-[320px] mx-auto">
        <LivaAvatar size={120} floating />
        
        <div>
          <h2 className="text-2xl font-black" style={{ color: ink }}>Have you had lunch?</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400 font-semibold">
            Hi {userName || "User"} 👋 You usually have lunch around 1 PM, but I haven't seen a meal today.
          </p>
        </div>

        {response ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[#f2faf5] border border-[#34c759]/16 text-xs text-[#197a38] text-left leading-relaxed"
          >
            {response}
          </motion.div>
        ) : (
          <div className="space-y-3 pt-4">
            <PrimaryButton onClick={() => handleSelection("yes")}>
              Yes, Log Standard Meal (610 kcal)
            </PrimaryButton>
            <SecondaryButton onClick={() => handleSelection("not_yet")}>
              Not Yet (Remind me in 45 mins)
            </SecondaryButton>
            <button
              onClick={() => handleSelection("skip")}
              className="text-xs font-bold text-slate-400 uppercase tracking-wider block mx-auto py-2"
            >
              Skip Today's Lunch
            </button>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
