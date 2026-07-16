import { ArrowLeft, Mic } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import IconButton from "../components/ui/IconButton";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import { ink, muted } from "../constants";
import { Screen } from "../types";

export default function LivaRecipeDetailScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [companionActive, setCompanionActive] = useState(false);
  const [cookingStep, setCookingStep] = useState(0);

  const ingredients = [
    "150g Organic Quinoa",
    "120g Chicken Breast (or Paneer)",
    "Half Avocado sliced",
    "1 Soft-boiled egg",
    "Handful of Cherry Tomatoes",
    "Tablespoon of Olive oil"
  ];

  const cookingSteps = [
    "Step 1: Thoroughly rinse 150g of organic quinoa in cold water to remove any bitter coating.",
    "Step 2: Boil the quinoa in 300ml of water for approximately 12 minutes until fluffy.",
    "Step 3: Grill the chicken breast on medium heat for 6 minutes each side with olive oil and spices.",
    "Step 4: Slice the avocado, tomatoes, and egg, then combine with warm quinoa in a serving bowl."
  ];

  const handleNextStep = () => {
    if (cookingStep < cookingSteps.length - 1) {
      setCookingStep((s) => s + 1);
    } else {
      setCompanionActive(false);
      setCookingStep(0);
      onSave(); // Saved on cook complete!
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      {!companionActive ? (
        <>
          {/* Hero Image Header */}
          <div className="relative h-60 w-full bg-slate-200">
            <img src={recipeHeroImg} alt="Gourmet Quinoa Bowl" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Back Button */}
            <div className="absolute left-4 top-10">
              <IconButton onClick={onBack} label="Back">
                <ArrowLeft size={19} />
              </IconButton>
            </div>
            
            <div className="absolute bottom-4 left-6 right-6">
              <span className="rounded-full bg-[#34C759] px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wide">
                Liva Companion Pick
              </span>
              <h1 className="mt-2 text-2xl font-extrabold text-white">Gourmet Quinoa Bowl</h1>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Quick Nutrition Badges */}
            <div className="grid grid-cols-4 gap-2 bg-[#f2faf5] p-3 rounded-2xl">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Calories</span>
                <span className="text-sm font-bold" style={{ color: ink }}>460</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Protein</span>
                <span className="text-sm font-bold text-[#34C759]">32g</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Carbs</span>
                <span className="text-sm font-bold" style={{ color: ink }}>45g</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Prep Time</span>
                <span className="text-sm font-bold" style={{ color: ink }}>20m</span>
              </div>
            </div>

            {/* Ingredients section */}
            <div>
              <h2 className="mb-3 text-sm font-bold" style={{ color: ink }}>Ingredients Needed</h2>
              <div className="space-y-2">
                {ingredients.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-600">
                    <span className="h-4 w-4 rounded-full border border-[#34C759]/30 flex items-center justify-center text-[8px] text-[#34C759]">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chef Tip */}
            <div className="rounded-[20px] bg-[#eefaf2] p-4 border border-[#34C759]/16">
              <h3 className="text-xs font-bold text-[#197a38] uppercase tracking-wider mb-1">Liva's Chef Tip</h3>
              <p className="text-xs leading-relaxed" style={{ color: muted }}>
                Rinse quinoa in cold water before boiling to remove saponin coating. Grill the chicken with a pinch of black pepper and lemon zest.
              </p>
            </div>
          </div>

          <div className="px-6 pb-8 pt-2 space-y-3">
            <PrimaryButton onClick={() => setCompanionActive(true)}>
              Start Cooking Companion Mode
            </PrimaryButton>
            <SecondaryButton onClick={onSave}>Save to Cook Vault</SecondaryButton>
          </div>
        </>
      ) : (
        /* Steps Companion Mode */
        <div className="flex flex-1 flex-col justify-between bg-[#10201a] text-white px-6 py-10">
          <div className="flex justify-between items-center pb-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#34c759] animate-pulse" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#6d8779]">Cooking Companion Active</span>
            </div>
            <button onClick={() => setCompanionActive(false)} className="text-xs font-bold text-[#f43f5e]">
              Exit
            </button>
          </div>

          {/* Cooking Step content */}
          <div className="flex-1 flex flex-col justify-center text-center max-w-[320px] mx-auto">
            <span className="text-sm font-semibold text-[#34C759] uppercase tracking-widest mb-4">
              Step {cookingStep + 1} of {cookingSteps.length}
            </span>
            <h2 className="text-xl font-extrabold leading-relaxed">
              {cookingSteps[cookingStep]}
            </h2>

            {/* Voice Guide Simulation */}
            <div className="mt-11 rounded-2xl bg-white/06 p-4 border border-white/10 flex items-center justify-between gap-3 text-left">
              <div>
                <span className="text-[9px] uppercase text-white/50 block font-bold tracking-wider">Voice Control</span>
                <span className="text-xs text-white/80 mt-1 block">Say <span className="text-[#34C759] font-bold">"Next step"</span> to advance hands-free.</span>
              </div>
              <button
                onClick={handleNextStep}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34C759] text-white hover:bg-[#25ad48]"
              >
                <Mic size={16} />
              </button>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="pt-6">
            <PrimaryButton onClick={handleNextStep}>
              {cookingStep < cookingSteps.length - 1 ? "Next Step" : "Complete & Save Recipe"}
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
