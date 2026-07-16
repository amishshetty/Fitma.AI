import { Leaf } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function SplashScreen({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onNext, 1200);
    return () => window.clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center" style={{ background: "linear-gradient(160deg, #f7fffe 0%, #e8f9ee 100%)" }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-5">
        <div className="flex h-24 w-24 items-center justify-center rounded-[28px] text-white" style={{ background: "linear-gradient(135deg, #34C759, #00C4B0)" }}>
          <Leaf size={48} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: ink }}>
            Fitma<span style={{ color: green }}>.ai</span>
          </h1>
          <p className="mt-2 text-sm font-semibold" style={{ color: muted }}>
            Your AI nutrition companion
          </p>
        </div>
      </motion.div>
    </div>
  );
}
