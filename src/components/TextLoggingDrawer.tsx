import { X, Loader2, Check, Activity } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "./ui/PrimaryButton";
import { ink } from "../constants";

export default function TextLoggingDrawer({ onClose, onLogMeal }: { onClose: () => void; onLogMeal: (meal: any) => void }) {
  const [text, setText] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const handleParseAndSave = () => {
    if (!text.trim()) return;
    setIsParsing(true);
    
    setTimeout(() => {
      // Basic NLP parser simulation
      const lower = text.toLowerCase();
      
      // Determine category
      let mealType = "snack";
      if (lower.includes("breakfast") || lower.includes("morning")) mealType = "breakfast";
      else if (lower.includes("lunch") || lower.includes("afternoon")) mealType = "lunch";
      else if (lower.includes("dinner") || lower.includes("night")) mealType = "dinner";

      // Simple extraction of items and quantities
      const items: string[] = [];
      let totalCal = 0;
      let totalProt = 0;

      const foodDB = [
        { regex: /(\d+)\s*(roti|rotis|chapati)/, name: "Roti", cal: 104, prot: 3 },
        { regex: /(\d+)\s*(egg|eggs)/, name: "Egg", cal: 70, prot: 6 },
        { regex: /(\d+)\s*(apple|apples)/, name: "Apple", cal: 95, prot: 0.5 },
        { regex: /(chicken)/, name: "Chicken", cal: 250, prot: 25 },
        { regex: /(paneer)/, name: "Paneer", cal: 265, prot: 14 },
        { regex: /(rice)/, name: "Rice", cal: 130, prot: 2.7 },
      ];

      foodDB.forEach(food => {
        const match = lower.match(food.regex);
        if (match) {
          let qty = 1;
          if (match[1] && !isNaN(parseInt(match[1]))) {
            qty = parseInt(match[1]);
          }
          items.push(`${qty > 1 ? qty + ' ' : ''}${food.name}`);
          totalCal += food.cal * qty;
          totalProt += food.prot * qty;
        }
      });
      
      if (items.length === 0) {
        // Fallback: Strip common conversational words to extract just the food name
        const stopWords = ["i", "have", "had", "ate", "eaten", "some", "a", "an", "the", "and", "with", "for", "in", "today", "this", "morning", "afternoon", "evening", "night", "breakfast", "lunch", "dinner", "snack", "snacks", "my", "is", "was", "written", "wriiten", "got", "took", "just"];
        let cleaned = lower;
        
        // Remove punctuation
        cleaned = cleaned.replace(/[.,!?\"'’]/g, "");
        
        const words = cleaned.split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 0);
        
        if (words.length > 0) {
          // Capitalize each remaining word
          const extractedName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          items.push(extractedName);
        } else {
          items.push(text.trim()); // Absolute fallback
        }
        
        totalCal = 250;
        totalProt = 5;
      }

      onLogMeal({
        mealType: mealType,
        items: items,
        calories: totalCal,
        protein: totalProt,
        name: items.join(", ")
      });
      setIsParsing(false);
      onClose(); // Close drawer after saving
    }, 800);
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
