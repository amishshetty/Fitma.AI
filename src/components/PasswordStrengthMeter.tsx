import React, { useState, useEffect, useRef, useMemo } from "react";

export default function PasswordStrengthMeter({ password }: { password: string }) {
  const score = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) s++;
    return s;
  }, [password]);

  if (!password) return null;

  const ratings = ["Very Weak", "Weak", "Medium", "Good", "Strong", "Excellent"];
  const color = score <= 2 ? "bg-rose-500" : score <= 4 ? "bg-amber-500" : "bg-emerald-500";
  const textColor = score <= 2 ? "text-rose-500" : score <= 4 ? "text-amber-500" : "text-emerald-500";

  return (
    <div className="mt-1 space-y-1">
      <div className="flex justify-between items-center text-[9px] font-bold">
        <span className="text-slate-400">Strength:</span>
        <span className={textColor}>{ratings[score]}</span>
      </div>
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}
