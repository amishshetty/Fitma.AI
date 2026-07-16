import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import PrimaryButton from "../components/ui/PrimaryButton";
import ProgressDots from "../components/ui/ProgressDots";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function MeetLivaScreen({ onNext }: { onNext: () => void }) {
  return (
    <ScreenShell
      footer={
        <div className="space-y-4">
          <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
          <ProgressDots total={5} current={2} />
        </div>
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-8">
        <LivaAvatar size={144} floating />
        <div className="relative w-full rounded-[28px] bg-white p-6 text-center" style={{ boxShadow: "0 8px 28px rgba(16,32,26,0.08)" }}>
          <p className="text-lg font-bold" style={{ color: ink }}>
            Hi, I'm Liva.
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: muted }}>
            I help you log meals quickly, estimate nutrition, and make small choices that add up.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide" style={{ color: muted }}>
          <span className="h-2 w-2 rounded-full" style={{ background: green }} />
          Your AI companion
        </div>
      </div>
    </ScreenShell>
  );
}
