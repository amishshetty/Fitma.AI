import { Home, Calendar, Sparkles, Target, User } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { green, softGreen } from "../../constants";
import { Screen } from "../../types";

export default function BottomNav({ active, onNavigate }: { active: "home" | "log" | "liva" | "progress" | "profile"; onNavigate: (screen: Screen) => void }) {
  const items = [
    { key: "home", label: "Home", icon: Home, screen: "home" as Screen },
    { key: "log", label: "My Plan", icon: Calendar, screen: "my-plan" as Screen },
    { key: "liva", label: "Liva", icon: Sparkles, screen: "liva-home" as Screen },
    { key: "progress", label: "Progress", icon: Target, screen: "progress-dashboard" as Screen },
    { key: "profile", label: "Profile", icon: User, screen: "profile-home" as Screen },
  ];

  return (
    <div className="flex items-center justify-around bg-white px-3 pb-5 pt-3" style={{ borderTop: "1px solid rgba(52,199,89,0.12)" }}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.screen)}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 py-1"
            style={{ color: isActive ? green : "#94aa9d" }}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: isActive ? softGreen : "transparent" }}
            >
              <Icon size={18} />
            </span>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
