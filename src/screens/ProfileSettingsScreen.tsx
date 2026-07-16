import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink, green } from "../constants";
import { Screen } from "../types";

export default function ProfileSettingsScreen({
  onBack,
  onLogout,
}: {
  onBack: () => void;
  onLogout: () => void;
}) {
  const [offlineMode, setOfflineMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [contrast, setContrast] = useState(false);

  return (
    <ScreenShell
      title="General Settings"
      subtitle="Granular accessibility and database configuration."
      onBack={onBack}
      footer={
        <button
          onClick={onLogout}
          className="w-full bg-rose-50 text-[#f43f5e] hover:bg-rose-100 transition-colors py-3 rounded-2xl text-xs font-bold"
        >
          Logout Account
        </button>
      }
    >
      <div className="space-y-4 pb-8">
        {/* Settings categories */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-4" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Accessibility Features</h3>
          
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <div>
              <span className="text-xs font-bold block" style={{ color: ink }}>Large Text Size</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Scale interface typography for visibility</span>
            </div>
            <button
              onClick={() => setLargeText(!largeText)}
              className="w-10 h-5.5 rounded-full p-0.5 transition-all flex items-center justify-start"
              style={{
                background: largeText ? green : "#cbd5e1",
                justifyContent: largeText ? "flex-end" : "flex-start",
              }}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow inline-block" />
            </button>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <div>
              <span className="text-xs font-bold block" style={{ color: ink }}>High Contrast Mode</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Deep darks and high ratio alerts</span>
            </div>
            <button
              onClick={() => setContrast(!contrast)}
              className="w-10 h-5.5 rounded-full p-0.5 transition-all flex items-center justify-start"
              style={{
                background: contrast ? green : "#cbd5e1",
                justifyContent: contrast ? "flex-end" : "flex-start",
              }}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow inline-block" />
            </button>
          </div>
        </div>

        {/* Offline cache settings */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 space-y-4" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Offline Synchronizer</h3>
          
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <div>
              <span className="text-xs font-bold block" style={{ color: ink }}>Offline Mode</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Save meals locally when internet drops</span>
            </div>
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className="w-10 h-5.5 rounded-full p-0.5 transition-all flex items-center justify-start"
              style={{
                background: offlineMode ? green : "#cbd5e1",
                justifyContent: offlineMode ? "flex-end" : "flex-start",
              }}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow inline-block" />
            </button>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              <span className="text-xs font-bold block" style={{ color: ink }}>Clear Local Cache</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Delete temporary scanned food images</span>
            </div>
            <button className="text-[10px] font-bold text-[#f43f5e] hover:bg-rose-50 px-2.5 py-1.5 rounded">
              Clear 28MB
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="text-center text-[10px] text-slate-400 font-semibold space-y-0.5">
          <p>Fitma.ai v0.9.4 Prototype Build</p>
          <p>© 2026 Fitma Technologies Inc. All rights reserved.</p>
        </div>
      </div>
    </ScreenShell>
  );
}
