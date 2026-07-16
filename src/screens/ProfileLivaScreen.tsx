import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import ScreenShell from "./ScreenShell";
import { green, muted } from "../constants";
import { Screen } from "../types";
import { MemoryItem } from "../types";

export default function ProfileLivaScreen({
  onBack,
  memories,
  onUpdateMemories,
}: {
  onBack: () => void;
  memories: MemoryItem[];
  onUpdateMemories: (memories: MemoryItem[]) => void;
}) {
  const [personality, setPersonality] = useState<"friendly" | "pro" | "motivational">("friendly");
  const [newMemory, setNewMemory] = useState("");

  const handleDeleteMemory = (id: number) => {
    onUpdateMemories(memories.filter((m) => m.id !== id));
  };

  const handleTeachLiva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.trim()) return;
    onUpdateMemories([
      ...memories,
      { id: Date.now(), text: newMemory.trim(), category: "User Added" },
    ]);
    setNewMemory("");
  };

  return (
    <ScreenShell
      title="Meet Your AI Coach"
      subtitle="Optimize Liva's communication personality style and memory."
      onBack={onBack}
    >
      <div className="space-y-5 pb-8 text-center">
        <LivaAvatar size={100} floating />

        {/* AI Personality Type Buttons */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 text-left" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Coach Communication Style</h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { key: "friendly", label: "Friendly" },
              { key: "pro", label: "Scientific" },
              { key: "motivational", label: "Motivate" },
            ].map((style) => (
              <button
                key={style.key}
                onClick={() => setPersonality(style.key as any)}
                className="py-2.5 rounded-xl border text-center font-bold transition-all"
                style={{
                  background: personality === style.key ? green : "white",
                  color: personality === style.key ? "white" : muted,
                  borderColor: personality === style.key ? green : "rgba(16,32,26,0.06)",
                }}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Liva's Memory list */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 text-left space-y-3.5" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">What Liva Knows (AI Memory)</h3>
          
          <div className="space-y-2">
            {memories.map((m) => (
              <div key={m.id} className="flex justify-between items-start gap-4 pb-2 border-b border-slate-50 last:border-b-0">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">{m.category}</span>
                  <span className="text-xs font-medium text-slate-700 leading-relaxed block mt-0.5">"{m.text}"</span>
                </div>
                <button
                  onClick={() => handleDeleteMemory(m.id)}
                  className="text-[10px] font-bold text-[#f43f5e] hover:bg-rose-50 px-2 py-1 rounded"
                >
                  Forget
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Teach Liva input box */}
        <div className="rounded-[24px] bg-white p-5 border border-slate-100 text-left" style={{ boxShadow: "0 6px 18px rgba(16,32,26,0.03)" }}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Teach Liva Something New</h3>
          <form onSubmit={handleTeachLiva} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. I fast every Monday"
              className="flex-1 bg-slate-50 px-3 py-2.5 rounded-xl border-none outline-none text-xs text-slate-700 font-semibold"
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#34c759] text-white px-4.5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#25ad48]"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </ScreenShell>
  );
}
