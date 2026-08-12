import React, { useState, useEffect, useRef, useMemo } from 'react';
import LivaAvatar from '../components/layout/LivaAvatar';
import ScreenShell from './ScreenShell';
import { green, muted } from '../constants';
import { Screen } from '../types';
import { MemoryItem } from '../types';

export default function ProfileLivaScreen({
  onBack,
  memories,
  onUpdateMemories,
  personality,
  setPersonality,
}: {
  onBack: () => void;
  memories: MemoryItem[];
  onUpdateMemories: (memories: MemoryItem[]) => void;
  personality: string;
  setPersonality: (style: string) => void;
}) {
  const [newMemory, setNewMemory] = useState('');

  const handleDeleteMemory = (id: number) => {
    onUpdateMemories(memories.filter((m) => m.id !== id));
  };

  const handleTeachLiva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.trim()) return;
    onUpdateMemories([
      ...memories,
      { id: Date.now(), text: newMemory.trim(), category: 'User Added' },
    ]);
    setNewMemory('');
  };

  return (
    <ScreenShell
      title="Meet Your AI Coach"
      subtitle="Optimize Liva's communication personality style and memory."
      onBack={onBack}
    >
      <div className="space-y-6 pb-8">
        <div className="flex flex-col items-center pt-2">
          <LivaAvatar size={100} floating />
        </div>

        {/* AI Personality Type Buttons */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border text-left"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Coach Communication Style
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { key: 'Friendly', label: 'Friendly' },
              { key: 'Scientific', label: 'Scientific' },
              { key: 'Motivate', label: 'Motivate' },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setPersonality(st.key)}
                className="py-2.5 rounded-xl border text-center font-bold transition-all"
                style={{
                  background: personality === st.key ? green : 'white',
                  color: personality === st.key ? 'white' : muted,
                  borderColor:
                    personality === st.key ? green : 'rgba(16,32,26,0.06)',
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Liva's Memory list */}
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border text-left space-y-3.5"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
            What Liva Knows (AI Memory)
          </h3>

          <div className="space-y-2">
            {memories.map((m) => (
              <div
                key={m.id}
                className="flex justify-between items-start gap-4 pb-2 border-b border-slate-100 dark:border-border/50 last:border-b-0"
              >
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block">
                    {m.category}
                  </span>
                  <span className="text-xs font-medium text-foreground leading-relaxed block mt-0.5">
                    "{m.text}"
                  </span>
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
        <div
          className="rounded-[24px] bg-card text-card-foreground p-5 border border-slate-100 dark:border-border text-left"
          style={{ boxShadow: '0 6px 18px rgba(16,32,26,0.03)' }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
            Teach Liva Something New
          </h3>
          <form onSubmit={handleTeachLiva} className="flex items-center gap-2 mt-3">
            <input
              type="text"
              placeholder="e.g. I fast every Monday"
              className="flex-1 bg-slate-50 dark:bg-muted px-4 py-3 rounded-2xl border border-slate-100 dark:border-border/50 outline-none text-xs text-foreground font-semibold focus:border-emerald-500/50 transition-colors"
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#34c759] text-white px-6 py-3 rounded-2xl text-xs font-bold hover:bg-[#25ad48] shadow-sm transition-transform hover:scale-95"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </ScreenShell>
  );
}
