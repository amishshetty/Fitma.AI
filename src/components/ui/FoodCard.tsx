import { Utensils, Plus } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { ink, green, muted, softGreen } from "../../constants";

export default function FoodCard({
  name,
  calories,
  protein,
  serving,
  onAdd,
}: {
  name: string;
  calories: number;
  protein: number;
  serving: string;
  onAdd?: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4" style={{ boxShadow: "0 4px 16px rgba(16,32,26,0.06)" }}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: softGreen, color: green }}>
        <Utensils size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold" style={{ color: ink }}>
          {name}
        </p>
        <p className="mt-1 text-xs" style={{ color: muted }}>
          {calories} kcal - {protein}g protein
        </p>
        <p className="text-xs" style={{ color: "#9bb2a5" }}>
          {serving}
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex h-10 w-10 items-center justify-center rounded-full text-white"
        aria-label={`Add ${name}`}
        style={{ background: green }}
      >
        <Plus size={19} />
      </button>
    </div>
  );
}
