import { Apple } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import PrimaryButton from "../components/ui/PrimaryButton";
import ProgressDots from "../components/ui/ProgressDots";
import SecondaryButton from "../components/ui/SecondaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted, softGreen } from "../constants";
import { Screen } from "../types";

export default function WelcomeScreen({ onNext, onLogin }: { onNext: () => void; onLogin: () => void }) {
  return (
    <ScreenShell
      compact
      footer={
        <div className="space-y-4">
          <PrimaryButton onClick={onNext}>Get Started</PrimaryButton>
          <SecondaryButton onClick={onLogin}>Already have an account? Sign In</SecondaryButton>
          <ProgressDots total={5} current={0} />
        </div>
      }
    >
      <div className="flex h-full flex-col justify-center gap-8">
        <div className="relative flex justify-center">
          <div className="absolute top-10 h-56 w-56 rounded-full bg-[#34C759]/10" />
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="relative">
            <div className="flex h-52 w-52 items-center justify-center rounded-full bg-white" style={{ boxShadow: "0 18px 50px rgba(16,32,26,0.08)" }}>
              <div className="flex h-28 w-28 items-center justify-center rounded-full" style={{ background: softGreen }}>
                <Apple size={64} color={green} />
              </div>
            </div>
            <div className="absolute -right-2 top-8">
              <LivaAvatar floating />
            </div>
          </motion.div>
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-tight" style={{ color: ink }}>
            Healthy eating should be effortless.
          </h1>
          <p className="mt-4 text-base leading-relaxed" style={{ color: muted }}>
            Meet Liva, your AI companion that helps you log meals in seconds and understand your nutrition calmly.
          </p>
        </div>
      </div>
    </ScreenShell>
  );
}
