import { motion } from "motion/react";
import React, { useState } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import ScreenShell from "./ScreenShell";
import { ink, muted, green } from "../constants";
import { GoalConfig } from "../types";
import { Target, Activity, Flame, Droplet, ChevronDown, Leaf, Wheat, Sparkles, Search, Ruler, Scale, Info } from "lucide-react";

const ModernSlider = ({ value, min, max, step, onChange, color, label, icon: Icon, unit }: any) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-3 p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-sm">
      <div className="flex justify-between items-center text-sm font-bold">
        <div className="flex items-center gap-2" style={{ color: ink }}>
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15`, color: color }}>
            <Icon size={16} />
          </div>
          {label}
        </div>
        <span className="font-extrabold text-lg" style={{ color: color }}>
          {value} <span className="text-xs text-slate-400 font-semibold">{unit}</span>
        </span>
      </div>
      <div className="relative h-2 w-full bg-slate-100 rounded-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ backgroundColor: color }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

const ModernDropdown = ({ value, options, onChange, icon: Icon, label }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3 p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-sm relative z-50">
      <div className="flex items-center gap-2 text-sm font-bold" style={{ color: ink }}>
        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500">
          <Icon size={16} />
        </div>
        {label}
      </div>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3.5 rounded-xl bg-white border border-slate-100 text-sm font-bold text-left flex justify-between items-center outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          style={{ color: ink }}
        >
          {value}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={18} className="text-slate-400" />
          </motion.div>
        </button>
        
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {options.map((option: string) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${
                    value === option ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default function ProfileGoalsScreen({
  onBack,
  goals,
  onUpdateGoals,
  primaryGoal,
  onUpdatePrimaryGoal,
}: {
  onBack: () => void;
  goals: GoalConfig;
  onUpdateGoals: (goals: GoalConfig) => void;
  primaryGoal?: string;
  onUpdatePrimaryGoal?: (goal: string) => void;
}) {
  const [success, setSuccess] = useState(false);

  const applyRecommendation = () => {
    onUpdateGoals({ ...goals, protein: goals.protein + 10 });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  const primaryGoalsList = [
    { label: "Lose Weight", icon: Flame, color: "#fb923c" },
    { label: "Gain Muscle", icon: Target, color: "#6366f1" },
    { label: "Eat Healthier", icon: Leaf, color: green },
    { label: "Maintain Weight", icon: Wheat, color: "#06b6d4" },
    { label: "Improve Energy", icon: Sparkles, color: "#f59e0b" },
    { label: "Just Exploring", icon: Search, color: "#94a3b8" },
  ];

  const height = goals.height || 170;
  const weight = goals.weight;
  
  const heightInM = height / 100;
  const bmi = parseFloat((weight / (heightInM * heightInM)).toFixed(1));
  let bmiCategory = "Normal";
  let bmiColor = "#34c759"; 
  let bmiMessage = "Great job! You're in a healthy range.";
  
  if (bmi < 18.5) { 
    bmiCategory = "Underweight"; 
    bmiColor = "#f59e0b"; 
    bmiMessage = "You may need more calories to build strength.";
  } else if (bmi >= 25 && bmi < 30) { 
    bmiCategory = "Overweight"; 
    bmiColor = "#f59e0b"; 
    if (primaryGoal === "Maintain Weight") {
      bmiMessage = "Liva Tip: A slight deficit could help you get to a Normal range over time!";
    } else {
      bmiMessage = "A perfect time to build healthy habits.";
    }
  } else if (bmi >= 30) { 
    bmiCategory = "Obese"; 
    bmiColor = "#ef4444"; 
    bmiMessage = "Focus on small, sustainable changes every day.";
  }
  
  const calculateTargets = (currentWeight: number, currentHeight: number, journey: string) => {
    const bmr = 10 * currentWeight + 6.25 * currentHeight - 5 * 25 + 5;
    const tdee = bmr * 1.55;

    let cals = tdee;
    let proteinMultiplier = 1.8;
    
    if (journey === "Lose Weight") {
      cals -= 500;
      proteinMultiplier = 2.0;
    } else if (journey === "Gain Muscle") {
      cals += 500;
      proteinMultiplier = 2.2;
    } else if (journey === "Improve Energy") {
      cals = tdee;
      proteinMultiplier = 1.6;
    } else {
      cals = tdee;
      proteinMultiplier = 1.8;
    }

    return {
      calories: Math.round(cals / 50) * 50,
      protein: Math.round((currentWeight * proteinMultiplier) / 5) * 5,
      water: Math.round((currentWeight * 35) / 250) * 250,
    };
  };

  const updateBodyMetrics = (newWeight: number, newHeight: number) => {
    const targets = calculateTargets(newWeight, newHeight, primaryGoal || "Lose Weight");
    onUpdateGoals({
      ...goals,
      weight: newWeight,
      height: newHeight,
      ...targets
    });
  };

  return (
    <ScreenShell
      title="Goals Manager"
      subtitle="Modify daily nutrition budgets and workout limits."
      onBack={onBack}
    >
      <div className="space-y-4 pb-8">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 bg-[#f2faf5] text-[#197a38] text-xs font-bold border border-[#34c759]/20 shadow-sm"
          >
            ✓ Success: Liva protein recommendation applied (+10g).
          </motion.div>
        )}

        {onUpdatePrimaryGoal && (
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-bold ml-1" style={{ color: ink }}>Primary Journey</h3>
            <div className="grid grid-cols-2 gap-3">
              {primaryGoalsList.map((g) => {
                const Icon = g.icon;
                const active = primaryGoal === g.label;
                return (
                  <button
                    key={g.label}
                    onClick={() => {
                      onUpdatePrimaryGoal(g.label);
                      const targets = calculateTargets(weight, height, g.label);
                      onUpdateGoals({
                        ...goals,
                        ...targets
                      });
                    }}
                    className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-2xl bg-white p-3 text-center transition-all"
                    style={{
                      border: active ? `2px solid ${g.color}` : "2px solid rgba(16,32,26,0.04)",
                      boxShadow: active ? `0 6px 16px ${g.color}20` : "0 4px 12px rgba(16,32,26,0.03)",
                    }}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[14px]" style={{ background: `${g.color}15`, color: g.color }}>
                      <Icon size={20} />
                    </span>
                    <span className="text-[11px] font-bold" style={{ color: active ? g.color : ink }}>
                      {g.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <h3 className="text-sm font-bold ml-1 mt-8 mb-2" style={{ color: ink }}>Body Metrics (BMI Calculator)</h3>
        
        <ModernSlider
          label="Height"
          icon={Ruler}
          color="#3b82f6"
          unit="cm"
          min={140} max={220} step={1}
          value={height}
          onChange={(v: number) => updateBodyMetrics(weight, v)}
        />

        <ModernSlider
          label="Weight"
          icon={Scale}
          color="#a855f7"
          unit="kg"
          min={40} max={150} step={0.5}
          value={weight}
          onChange={(v: number) => updateBodyMetrics(v, height)}
        />

        {/* BMI Card */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-sm p-5 mt-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: ink }}>
              <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500">
                <Info size={16} />
              </div>
              Your BMI
            </h4>
            <div className="text-right">
              <span className="text-2xl font-black" style={{ color: bmiColor }}>{bmi}</span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{bmiCategory}</p>
            </div>
          </div>
          
          {/* Visual BMI Bar */}
          <div className="h-2.5 w-full bg-slate-100 rounded-full flex overflow-hidden mb-3">
            <div className="h-full bg-[#3b82f6]" style={{ width: '20%' }} /> {/* Underweight */}
            <div className="h-full bg-[#34c759]" style={{ width: '40%' }} /> {/* Normal */}
            <div className="h-full bg-[#f59e0b]" style={{ width: '20%' }} /> {/* Overweight */}
            <div className="h-full bg-[#ef4444]" style={{ width: '20%' }} /> {/* Obese */}
          </div>
          <div className="relative w-full mb-4">
            <motion.div 
              className="absolute top-0 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
              style={{ 
                borderColor: bmiColor, 
                left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 98)}%`,
                marginTop: '-14px'
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
          
          <p className="text-xs font-semibold leading-relaxed" style={{ color: primaryGoal === "Maintain Weight" && bmi >= 25 ? "#f59e0b" : muted }}>
            {bmiMessage}
          </p>
        </div>

        <h3 className="text-sm font-bold ml-1 mt-8 mb-2" style={{ color: ink }}>Daily Targets (Calculated)</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center gap-3 font-bold text-sm" style={{ color: ink }}>
              <div className="p-2 rounded-xl bg-orange-50 text-orange-500"><Flame size={18} /></div>
              Calorie Budget
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-orange-500">{goals.calories}</span> <span className="text-xs text-slate-400 font-semibold">kcal</span>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center gap-3 font-bold text-sm" style={{ color: ink }}>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-500"><Activity size={18} /></div>
              Protein Intake
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-sky-500">{goals.protein}</span> <span className="text-xs text-slate-400 font-semibold">g</span>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center gap-3 font-bold text-sm" style={{ color: ink }}>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-500"><Droplet size={18} /></div>
              Water Target
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-teal-500">{goals.water}</span> <span className="text-xs text-slate-400 font-semibold">ml</span>
            </div>
          </div>
        </div>

        {/* Liva Coach Recommendation */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-green-50 to-emerald-50/30 border border-green-100/50 space-y-4 shadow-sm mt-6">
          <div className="flex gap-4 items-start">
            <LivaAvatar size={42} floating />
            <div>
              <p className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-widest">Liva Goal Audit</p>
              <p className="mt-1.5 text-[13px] font-medium leading-relaxed" style={{ color: ink }}>
                Based on your daily activity levels and moderate workouts, I recommend increasing protein to <span className="font-bold text-emerald-700">{(goals.protein + 10)}g</span> to recover muscle fibers faster.
              </p>
            </div>
          </div>
          <button
            onClick={applyRecommendation}
            className="w-full bg-white hover:bg-emerald-50 text-[13px] font-bold text-emerald-700 py-3 rounded-2xl transition-all shadow-sm border border-emerald-100"
          >
            Apply Goal Recommendation
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
