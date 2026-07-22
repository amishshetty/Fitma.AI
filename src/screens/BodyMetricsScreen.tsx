import { motion } from "motion/react";
import React, { useState } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import ProgressDots from "../components/ui/ProgressDots";
import SecondaryButton from "../components/ui/SecondaryButton";
import ScreenShell from "./ScreenShell";
import { ink } from "../constants";
import { Ruler, Scale, Info } from "lucide-react";

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

export default function BodyMetricsScreen({ 
  onNext, 
  onSkip, 
  initialWeight = 70, 
  initialHeight = 170 
}: { 
  onNext: (weight: number, height: number) => void; 
  onSkip: () => void;
  initialWeight?: number;
  initialHeight?: number;
}) {
  const [weight, setWeight] = useState(initialWeight);
  const [height, setHeight] = useState(initialHeight);
  
  const heightInM = height / 100;
  const bmi = parseFloat((weight / (heightInM * heightInM)).toFixed(1));
  let bmiCategory = "Normal";
  let bmiColor = "#34c759"; 
  
  if (bmi < 18.5) { 
    bmiCategory = "Underweight"; 
    bmiColor = "#f59e0b"; 
  } else if (bmi >= 25 && bmi < 30) { 
    bmiCategory = "Overweight"; 
    bmiColor = "#f59e0b"; 
  } else if (bmi >= 30) { 
    bmiCategory = "Obese"; 
    bmiColor = "#ef4444"; 
  }

  return (
    <ScreenShell
      title="Tell us about yourself"
      subtitle="This helps Liva calculate your exact daily targets."
      footer={
        <div className="space-y-3">
          <PrimaryButton onClick={() => onNext(weight, height)}>
            Save & Continue
          </PrimaryButton>
          <SecondaryButton onClick={onSkip}>Skip for now</SecondaryButton>
          <ProgressDots total={6} current={4} />
        </div>
      }
    >
      <div className="space-y-6">
        <ModernSlider
          label="Height"
          icon={Ruler}
          color="#3b82f6"
          unit="cm"
          min={140} max={220} step={1}
          value={height}
          onChange={setHeight}
        />

        <ModernSlider
          label="Weight"
          icon={Scale}
          color="#a855f7"
          unit="kg"
          min={40} max={150} step={0.5}
          value={weight}
          onChange={setWeight}
        />
        
        {/* BMI Preview Card */}
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
        </div>
      </div>
    </ScreenShell>
  );
}
