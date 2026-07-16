import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function ProfileDevicesScreen({ onBack }: { onBack: () => void }) {
  const [connected, setConnected] = useState({ apple: true, fitbit: false, garmin: false });
  const [success, setSuccess] = useState(false);

  const toggleConnection = (key: string) => {
    setConnected((prev: any) => {
      const updated = !prev[key];
      if (updated) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2400);
      }
      return { ...prev, [key]: updated };
    });
  };

  return (
    <ScreenShell
      title="Connected Devices"
      subtitle="Synchronize physical workout metrics from smart bands."
      onBack={onBack}
    >
      <div className="space-y-4 pb-8">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 bg-[#f2faf5] text-[#197a38] text-xs font-bold border border-[#34c759]/20"
          >
            ✓ Success: Wearable device connected. Sync log generated.
          </motion.div>
        )}

        <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-4.5" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          {[
            { key: "apple", label: "Apple Watch", desc: "Steps, active energy, heart metrics" },
            { key: "fitbit", label: "Fitbit Integration", desc: "Sleep cycles, heart parameters" },
            { key: "garmin", label: "Garmin Sync", desc: "Intense runs, workout speeds" },
          ].map((device) => {
            const isConn = (connected as any)[device.key];
            return (
              <div key={device.key} className="flex items-center justify-between pb-2 border-b border-slate-50 last:border-b-0">
                <div>
                  <span className="text-xs font-bold block" style={{ color: ink }}>{device.label}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{device.desc}</span>
                </div>
                <button
                  onClick={() => toggleConnection(device.key)}
                  className="rounded-full px-3 py-1.5 text-[10px] font-bold transition-all"
                  style={{
                    background: isConn ? "#f2faf5" : "#f6f8f7",
                    color: isConn ? green : muted,
                    border: isConn ? `1px solid ${green}` : "1px solid rgba(16,32,26,0.08)",
                  }}
                >
                  {isConn ? "Connected" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
