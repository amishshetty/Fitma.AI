import { Search } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import FoodCard from "../components/ui/FoodCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import TagChip from "../components/ui/TagChip";
import ScreenShell from "./ScreenShell";
import { ink, muted } from "../constants";
import { Screen } from "../types";

export default function SearchFoodScreen({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <ScreenShell
      title="Search Food"
      subtitle="Add foods manually or pick from suggestions."
      onBack={onBack}
      footer={
        <PrimaryButton onClick={onContinue}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3" style={{ boxShadow: "0 4px 16px rgba(16,32,26,0.05)" }}>
        <Search size={20} color={muted} />
        <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search paneer, rice, eggs..." />
      </div>
      <div className="space-y-5">
        <section>
          <h2 className="mb-3 text-sm font-bold" style={{ color: ink }}>
            Recent Searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Paneer Paratha", "Chicken", "Dal Rice"].map((item) => (
              <TagChip key={item}>{item}</TagChip>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-bold" style={{ color: ink }}>
            Popular Foods
          </h2>
          <div className="space-y-3">
            <FoodCard name="Paneer Paratha" calories={310} protein={12} serving="1 paratha" />
            <FoodCard name="Chicken Biryani" calories={520} protein={28} serving="1 plate" />
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-bold" style={{ color: ink }}>
            Suggested Foods
          </h2>
          <div className="space-y-3">
            <FoodCard name="Dal Rice" calories={390} protein={14} serving="1 bowl" />
            <FoodCard name="Oats Breakfast" calories={360} protein={16} serving="1 bowl" />
          </div>
        </section>
      </div>
    </ScreenShell>
  );
}
