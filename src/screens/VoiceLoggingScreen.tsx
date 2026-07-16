import { Mic } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import SecondaryButton from "../components/ui/SecondaryButton";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function VoiceLoggingScreen({ onCancel, onDone }: { onCancel: () => void; onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2600);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <ScreenShell
      footer={<SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>}
      onBack={onCancel}
    >
      <div className="flex h-full flex-col items-center justify-center text-center">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="mb-10 flex h-36 w-36 items-center justify-center rounded-full text-white"
          style={{ background: "linear-gradient(135deg, #34C759, #00C4B0)", boxShadow: "0 20px 48px rgba(52,199,89,0.35)" }}
        >
          <Mic size={62} />
        </motion.div>
        <h1 className="text-3xl font-bold" style={{ color: ink }}>
          Listening...
        </h1>
        <p className="mt-4 max-w-[260px] text-base leading-relaxed" style={{ color: muted }}>
          Try saying: "I had two rotis, dal and rice."
        </p>
        <div className="mt-10 flex h-14 items-end gap-2">
          {[24, 42, 30, 52, 36, 46, 26].map((height, index) => (
            <motion.div
              key={index}
              animate={{ height: [16, height, 18] }}
              transition={{ duration: 0.9, delay: index * 0.08, repeat: Infinity }}
              className="w-2 rounded-full"
              style={{ background: index % 2 ? "#00C4B0" : green }}
            />
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
