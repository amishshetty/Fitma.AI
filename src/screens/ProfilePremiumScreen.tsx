import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import { green } from "../constants";
import { Screen } from "../types";

export default function ProfilePremiumScreen({ onBack }: { onBack: () => void }) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#10201a] text-white justify-between px-6 py-10 relative overflow-hidden">
      <div className="flex justify-between items-center">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#6d8779]">Premium Access</span>
        <button onClick={onBack} className="text-xs font-bold text-[#f43f5e]">Close</button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-[290px] mx-auto space-y-6 pt-6 pb-6">
        <span className="text-5xl">👑</span>
        <div>
          <h1 className="text-3xl font-black text-white leading-tight">Fitma Premium</h1>
          <p className="mt-2 text-xs leading-relaxed text-[#9bb2a5]">
            Unlock the ultimate AI nutrition coach. Limitless tracking, forecasts, and medical audit files.
          </p>
        </div>

        {/* Benefits lists */}
        <div className="w-full space-y-2 text-left bg-white/06 border border-white/10 rounded-2xl p-4.5 text-xs text-white/80">
          <div className="flex gap-2.5">
            <span className="text-[#34c759]">✓</span>
            <span>Unlimited AI Plate Scanning & Voice Log</span>
          </div>
          <div className="flex gap-2.5">
            <span className="text-[#34c759]">✓</span>
            <span>Comprehensive Blood Report Analysis</span>
          </div>
          <div className="flex gap-2.5">
            <span className="text-[#34c759]">✓</span>
            <span>Custom Grocery Lists & Restaurant Search</span>
          </div>
        </div>

        {/* Subscription toggle cards */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => setBilling("monthly")}
            className="rounded-2xl p-3 border text-left"
            style={{
              borderColor: billing === "monthly" ? green : "rgba(255,255,255,0.08)",
              background: billing === "monthly" ? "rgba(52,199,89,0.08)" : "transparent",
            }}
          >
            <span className="text-[9px] uppercase font-bold text-white/60 block">Monthly</span>
            <span className="text-sm font-black block mt-1">$9.99<span className="text-[10px] font-normal text-white/50">/mo</span></span>
          </button>
          
          <button
            onClick={() => setBilling("yearly")}
            className="rounded-2xl p-3 border text-left relative"
            style={{
              borderColor: billing === "yearly" ? green : "rgba(255,255,255,0.08)",
              background: billing === "yearly" ? "rgba(52,199,89,0.08)" : "transparent",
            }}
          >
            <span className="absolute -top-2.5 right-2 bg-[#34c759] text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide">Best Value</span>
            <span className="text-[9px] uppercase font-bold text-white/60 block">Yearly</span>
            <span className="text-sm font-black block mt-1">$59.99<span className="text-[10px] font-normal text-white/50">/yr</span></span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <PrimaryButton onClick={onBack}>Upgrade Now</PrimaryButton>
        <span className="text-[8px] text-white/40 text-center block font-medium">Auto-renews. Cancel anytime in App Store.</span>
      </div>
    </div>
  );
}
