import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import IconButton from "../components/ui/IconButton";
import ScreenShell from "./ScreenShell";
import { ink } from "../constants";
import { Screen } from "../types";

export default function CameraMealSelectionScreen({ image, onBack, onSelect }: { image: string, onBack: () => void, onSelect: (type: string) => void }) {
  const meals = [
    { id: "breakfast", label: "Breakfast", icon: "🍳" },
    { id: "lunch", label: "Lunch", icon: "🍱" },
    { id: "snack", label: "Snack", icon: "🍎" },
    { id: "dinner", label: "Dinner", icon: "🍲" },
  ];
  return (
    <ScreenShell>
      <div className="flex items-center gap-3 px-6 pt-10 pb-4">
        <IconButton onClick={onBack} label="Back">
          <ArrowLeft size={19} />
        </IconButton>
        <h1 className="text-xl font-bold" style={{ color: ink }}>
          Select Meal
        </h1>
      </div>
      <div className="flex flex-1 flex-col items-center px-6 pb-6 text-center">
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8 mt-4 overflow-hidden rounded-[28px] w-52 h-52 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative"
        >
          <img src={image} alt="Captured meal" className="w-full h-full object-cover" />
        </motion.div>

        <motion.h2 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-2xl font-bold text-slate-800 tracking-tight"
        >
          Which meal is this?
        </motion.h2>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-sm font-semibold text-slate-500"
        >
          Select a category for accurate tracking.
        </motion.p>

        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid w-full grid-cols-2 gap-4"
        >
          {meals.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgb(0,0,0,0.04)] transition-all hover:scale-[0.98] active:scale-95 border border-slate-100"
            >
              <span className="text-3xl">{m.icon}</span>
              <span className="font-bold text-slate-700 text-[15px]">{m.label}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </ScreenShell>
  );
}
