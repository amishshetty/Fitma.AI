import { Camera, Mic, Bell, Check } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ProgressDots from "../components/ui/ProgressDots";
import SecondaryButton from "../components/ui/SecondaryButton";
import ScreenShell from "./ScreenShell";
import { ink, muted } from "../constants";
import { Screen } from "../types";

export default function PermissionsScreen({ onNext }: { onNext: () => void }) {
  const [granted, setGranted] = useState<Set<number>>(new Set());
  const permissions = [
    { title: "Camera", description: "Snap your meal and Liva identifies nutrition instantly.", icon: Camera, color: "#6366f1" },
    { title: "Microphone", description: "Voice logging takes just a few seconds.", icon: Mic, color: "#0ea5e9" },
    { title: "Notifications", description: "Meal reminders, hydration prompts, and weekly insights.", icon: Bell, color: "#f59e0b" },
  ];

  return (
    <ScreenShell
      title="Make Liva smarter for you"
      subtitle="These permissions unlock the fastest experience."
      footer={
        <div className="space-y-3">
          <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
          <SecondaryButton onClick={onNext}>Skip</SecondaryButton>
          <ProgressDots total={5} current={4} />
        </div>
      }
    >
      <div className="space-y-3">
        {permissions.map((permission, index) => {
          const Icon = permission.icon;
          const active = granted.has(index);
          return (
            <button
              key={permission.title}
              onClick={() =>
                setGranted((previous) => {
                  const next = new Set(previous);
                  next.has(index) ? next.delete(index) : next.add(index);
                  return next;
                })
              }
              className="flex w-full items-start gap-4 rounded-[24px] bg-white p-4 text-left"
              style={{ border: active ? `1.5px solid ${permission.color}` : "1.5px solid rgba(16,32,26,0.06)" }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${permission.color}16`, color: permission.color }}>
                <Icon size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold" style={{ color: ink }}>
                  {permission.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed" style={{ color: muted }}>
                  {permission.description}
                </span>
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: active ? permission.color : "#eef4f0", color: "white" }}>
                {active && <Check size={15} />}
              </span>
            </button>
          );
        })}
      </div>
    </ScreenShell>
  );
}
