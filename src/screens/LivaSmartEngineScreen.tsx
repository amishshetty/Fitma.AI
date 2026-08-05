import React, { useState } from "react";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { BrainCircuit, Activity, Zap, Info, Clock, Calendar } from "lucide-react";
import { Screen } from "../types";

export default function LivaSmartEngineScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  const [enabled, setEnabled] = useState(true);

  // Mocking the AI state based on the PRD
  const aiCategories = [
    {
      id: "meals",
      name: "Smart Meal Reminders",
      description: "Adapts to your eating schedule to send timely reminders without spam.",
      stage: "STAGE_2_ADAPTIVE",
      statusText: "Adaptive Learning (Day 12)",
      nextPrediction: "Lunch at 1:15 PM",
      confidence: 85,
    },
    {
      id: "water",
      name: "Dynamic Hydration",
      description: "Calculates intake vs wake time. Adjusts on workout days.",
      stage: "STAGE_1_LEARNING",
      statusText: "Initial Learning Phase",
      nextPrediction: "200ml every 1.5 hours",
      confidence: 45,
    },
    {
      id: "protein",
      name: "Protein Optimization",
      description: "Analyzes daily macros to suggest high-protein snacks.",
      stage: "STAGE_3_OPTIMIZED",
      statusText: "Fully Optimized",
      nextPrediction: "Summary at 5:00 PM",
      confidence: 96,
    }
  ];

  return (
    <ScreenShell
      title="Liva AI Engine"
      subtitle="Your personal intelligence core for smart notifications."
      onBack={onBack}
    >
      <div className="space-y-6 pb-12 mt-4 relative">
        {/* Main Switch Card */}
        <div 
          className="relative overflow-hidden rounded-[24px] bg-white p-5 border border-slate-100 flex justify-between items-center"
          style={{ boxShadow: "0 8px 24px rgba(16, 32, 26, 0.03)" }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80" style={{ background: enabled ? green : muted }} />
          <div>
            <h3 className="font-bold text-[15px]" style={{ color: ink }}>Liva Smart Reminders</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">Let AI manage your notification schedule.</p>
          </div>
          <button 
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 ${enabled ? 'justify-end bg-[#34C759]' : 'justify-start bg-slate-200'}`}
            style={{ padding: '0 2px' }}
          >
            <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
          </button>
        </div>

        {/* AI Engine Status */}
        <div className="opacity-90 transition-opacity" style={{ opacity: enabled ? 1 : 0.5, pointerEvents: enabled ? 'auto' : 'none' }}>
          <div className="flex items-center gap-2 mb-4 px-1">
            <BrainCircuit size={16} color={green} />
            <h4 className="text-[13px] font-extrabold uppercase tracking-widest text-slate-400">Intelligence Modules</h4>
          </div>

          <div className="space-y-4">
            {aiCategories.map((cat, idx) => (
              <div 
                key={idx}
                className="relative bg-white rounded-[20px] p-5 border border-slate-100"
                style={{ 
                  boxShadow: "0 4px 16px rgba(16,32,26,0.02)",
                  animation: `fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.15}s backwards`
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-[14px]" style={{ color: ink }}>{cat.name}</h3>
                  <div 
                    className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                    style={{ 
                      color: cat.stage === 'STAGE_3_OPTIMIZED' ? '#8B5CF6' : (cat.stage === 'STAGE_2_ADAPTIVE' ? '#F59E0B' : '#34C759'), 
                      backgroundColor: cat.stage === 'STAGE_3_OPTIMIZED' ? '#f5f3ff' : (cat.stage === 'STAGE_2_ADAPTIVE' ? '#fffbeb' : '#ecfbf1')
                    }}
                  >
                    <Activity size={10} />
                    {cat.statusText}
                  </div>
                </div>
                
                <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{cat.description}</p>
                
                <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2 border border-slate-100/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><Clock size={12}/> Next Prediction</span>
                    <span className="text-[11px] font-bold" style={{ color: ink }}>{cat.nextPrediction}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><Zap size={12}/> AI Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${cat.confidence}%`, background: green }} />
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: ink }}>{cat.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#f0f9f4] rounded-2xl p-4 border border-[#e2f5e9] flex gap-3 items-start mt-6">
          <Info size={16} color={green} className="shrink-0 mt-0.5" />
          <p className="text-[12px] font-medium leading-relaxed" style={{ color: ink }}>
            Liva's Brain evaluates your patterns every 15 minutes. It actively prevents notification fatigue and only sends what matters.
          </p>
        </div>

      </div>
    </ScreenShell>
  );
}
