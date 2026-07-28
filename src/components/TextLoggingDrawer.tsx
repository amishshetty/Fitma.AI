import { X, Loader2, Check, Activity } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "./ui/PrimaryButton";
import { ink } from "../constants";

export default function TextLoggingDrawer({ onClose, onLogMeal }: { onClose: () => void; onLogMeal: (meal: any) => void }) {
  const [text, setText] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const handleParseAndSave = async () => {
    if (!text.trim()) return;
    setIsParsing(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          deviceId: "text-logger",
          profile: {
            name: "User",
            goal: "maintenance",
            diet: "any",
            dailyCalories: 2000,
            motivationStyle: "friendly",
            language: "english"
          },
          previousMessages: [],
          loggedMeals: [],
          remainingCalories: 2000
        }),
      });

      if (!response.ok) throw new Error("API Error");
      
      const data = await response.json();
      
      if (data.mealData) {
        if (!data.mealData.name && data.mealData.items) {
          data.mealData.name = data.mealData.items.join(", ");
        }
        onLogMeal(data.mealData);
        setIsParsing(false);
        onClose();
      } else {
        throw new Error("No meal data found in AI response");
      }
    } catch (e) {
      console.error(e);
      // Fallback if AI fails
      onLogMeal({
        mealType: "snack",
        items: [text],
        calories: 250,
        protein: 5,
        name: text
      });
      setIsParsing(false);
      onClose();
    }
  };

  const suggestions = ["Add 2 roti 2 egg in breakfast", "Had chicken and rice for lunch", "Ate 1 apple for snack"];
  
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden pointer-events-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-[#F8F9FA] rounded-t-[32px] p-6 pb-8 shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Smart Meal Log</h2>
            <p className="text-sm text-slate-500 mt-1">Type naturally. We'll extract the details.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-200/50 text-slate-500 active:scale-95 transition-transform">
            <X size={20} />
          </button>
        </div>

        <div className="relative mb-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-32 w-full resize-none rounded-[24px] bg-white p-5 text-base outline-none transition-shadow focus:ring-4 focus:ring-[#34C759]/20"
            placeholder='"I had 2 rotis and 2 eggs for breakfast"'
            style={{ color: ink, boxShadow: "0 4px 20px rgba(16,32,26,0.04)", border: "1px solid #e2e8f0" }}
          />
          {/* Decorative AI icon */}
          <div className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-[#34C759]/10 px-3 py-1.5 text-xs font-bold text-[#34C759]">
            <Activity size={14} /> AI Powered
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Try these examples</p>
          <div className="flex flex-col gap-2">
            {suggestions.map((suggestion) => (
              <button 
                key={suggestion} 
                onClick={() => setText(suggestion)}
                className="text-left rounded-xl bg-white p-3 text-sm text-slate-600 active:bg-slate-50 transition-colors border border-slate-100 shadow-sm"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>

        <PrimaryButton 
          onClick={handleParseAndSave} 
          disabled={isParsing || !text.trim()} 
          icon={isParsing ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
        >
          {isParsing ? "Analyzing & Saving..." : "Save Smart Meal"}
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
