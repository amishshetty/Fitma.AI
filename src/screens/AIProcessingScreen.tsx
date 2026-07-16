import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import ScreenShell from "./ScreenShell";
import { ink, green, muted, rotatingFacts } from "../constants";
import { Screen } from "../types";

export default function AIProcessingScreen({ onDone }: { onDone: () => void }) {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const factTimer = window.setInterval(() => setFactIndex((index) => (index + 1) % rotatingFacts.length), 900);
    const doneTimer = window.setTimeout(onDone, 3200);
    return () => {
      window.clearInterval(factTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <ScreenShell>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="relative mb-10">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-[-18px] rounded-full border-2 border-dashed border-[#34C759]/35" />
          <LivaAvatar size={132} floating />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: ink }}>
          Analyzing your meal...
        </h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            className="mt-4 text-base font-semibold"
            style={{ color: muted }}
          >
            {rotatingFacts[factIndex]}
          </motion.p>
        </AnimatePresence>
        <div className="mt-10 h-3 w-full max-w-[260px] overflow-hidden rounded-full bg-[#e4f4ea]">
          <motion.div className="h-full rounded-full" style={{ background: green }} initial={{ width: "8%" }} animate={{ width: "100%" }} transition={{ duration: 3.1, ease: "easeInOut" }} />
        </div>
      </div>
    </ScreenShell>
  );
}
