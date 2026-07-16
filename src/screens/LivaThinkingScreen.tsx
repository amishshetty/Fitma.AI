import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function LivaThinkingScreen({ onDone }: { onDone: () => void }) {
  const [factIndex, setFactIndex] = useState(0);
  const rotatingHelper = ["Checking your nutrition...", "Reviewing today's meals...", "Calculating remaining calories..."];

  useEffect(() => {
    const factTimer = setInterval(() => setFactIndex((idx) => (idx + 1) % rotatingHelper.length), 1000);
    const doneTimer = setTimeout(onDone, 3000);
    return () => {
      clearInterval(factTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <ScreenShell>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="relative mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] rounded-full border-2 border-dashed border-[#34C759]/40"
          />
          <LivaAvatar size={132} floating />
        </div>

        <h1 className="text-3xl font-extrabold" style={{ color: ink }}>
          Thinking...
        </h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            className="mt-4.5 text-base font-bold text-slate-500"
            style={{ color: muted }}
          >
            {rotatingHelper[factIndex]}
          </motion.p>
        </AnimatePresence>

        <div className="mt-11 h-2.5 w-full max-w-[250px] overflow-hidden rounded-full bg-[#e4f4ea]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: green }}
            initial={{ width: "10%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.9, ease: "easeInOut" }}
          />
        </div>
      </div>
    </ScreenShell>
  );
}
