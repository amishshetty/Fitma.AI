import React, { useState, useEffect, useRef, useMemo } from "react";
import { ink, muted } from "../../constants";

export default function NutritionCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4" style={{ boxShadow: "0 4px 16px rgba(16,32,26,0.06)" }}>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <p className="text-lg font-bold" style={{ color: ink }}>
        {value}
      </p>
      <p className="text-xs font-medium" style={{ color: muted }}>
        {label}
      </p>
    </div>
  );
}
