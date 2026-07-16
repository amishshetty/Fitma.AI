import { ChevronRight, Check } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function OnboardingSuccessScreen({ onFinish }: { onFinish: () => void }) {
  return (
    <ScreenShell
      footer={
        <PrimaryButton onClick={onFinish} icon={<ChevronRight size={19} />}>
          Go to Home
        </PrimaryButton>
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-8 text-center">
        <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="flex h-32 w-32 items-center justify-center rounded-full text-white" style={{ background: green }}>
          <Check size={62} />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: ink }}>
            You're all set.
          </h1>
          <p className="mt-3 text-base leading-relaxed" style={{ color: muted }}>
            Liva is ready to help you log your first meal in under 15 seconds.
          </p>
        </div>
      </div>
    </ScreenShell>
  );
}
