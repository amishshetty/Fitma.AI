import React from "react";
import { Flame, Egg, Lightbulb, Heart, ArrowRight } from "lucide-react";

interface AlternativeFood {
  name: string;
  description: string;
}

interface FoodRecommendationCardProps {
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  why?: string[];
  message_suffix?: string;
  alternatives?: AlternativeFood[];
  tip?: string;
}

export const FoodRecommendationCard: React.FC<FoodRecommendationCardProps> = ({
  meal,
  calories,
  protein,
  why,
  message_suffix,
  alternatives,
  tip
}) => {
  return (
    <div className="flex flex-col gap-1 w-[280px] sm:w-[320px] animate-fadeIn mt-1">
      <div className="text-[18px] font-extrabold text-[#34C759] leading-tight">
        {meal}
      </div>
      
      {message_suffix && (
        <div className="text-slate-600 text-sm mt-0.5 mb-3">
          {message_suffix}
        </div>
      )}

      {/* Macros Section */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 mt-1">
        <div className="bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 flex items-center gap-1.5 whitespace-nowrap">
          <Flame size={14} className="text-orange-500" />
          <span className="font-bold text-slate-700 text-sm">{calories} <span className="text-[10px] text-slate-500 font-medium">kcal</span></span>
        </div>
        <div className="bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 flex items-center gap-1.5 whitespace-nowrap">
          <Egg size={14} className="text-amber-500" />
          <span className="font-bold text-slate-700 text-sm">{protein}g <span className="text-[10px] text-slate-500 font-medium">Protein</span></span>
        </div>
      </div>
      
      {alternatives && alternatives.length > 0 && (
        <AlternativeFoodsCard alternatives={alternatives} />
      )}
      
      {tip && (
        <LivaTipCard tip={tip} />
      )}
    </div>
  );
};


interface AlternativeFoodsCardProps {
  alternatives: AlternativeFood[];
}

export const AlternativeFoodsCard: React.FC<AlternativeFoodsCardProps> = ({ alternatives }) => {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="mt-2 w-full animate-fadeIn" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center gap-2 mb-3 ml-1">
        <div className="w-6 h-6 rounded-full bg-[#34C759]/10 flex items-center justify-center">
          <span className="text-[10px]">🍃</span>
        </div>
        <h4 className="text-[14px] font-bold text-slate-800">Better Alternatives</h4>
      </div>
      
      <div className="flex flex-col rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
        {alternatives.map((alt, idx) => (
          <div key={idx}>
            {idx > 0 && <div className="border-t border-dashed border-slate-200 mx-4" />}
            <div className="flex items-center justify-between px-4 py-3 group hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f2faf5] flex items-center justify-center text-lg flex-shrink-0">
                  {idx % 2 === 0 ? "🍲" : "🥗"}
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-slate-800">{alt.name}</span>
                  <span className="text-[12px] text-slate-500 font-medium leading-snug mt-0.5">{alt.description}</span>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#34C759] flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface LivaTipCardProps {
  tip: string;
}

export const LivaTipCard: React.FC<LivaTipCardProps> = ({ tip }) => {
  return (
    <div className="mt-4 bg-[#f2faf5] rounded-2xl p-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Lightbulb size={16} className="text-[#34C759]" />
          <h4 className="text-[14px] font-bold text-[#34C759]">Liva Tip</h4>
        </div>
        <span className="text-[14px]">✨</span>
      </div>
      <p className="text-[13px] text-[#2c7a42] font-medium leading-relaxed">
        {tip}
      </p>
    </div>
  );
};

interface MotivationCardProps {
  motivation: string;
}

export const MotivationCard: React.FC<MotivationCardProps> = ({ motivation }) => {
  if (!motivation) return null;
  
  return (
    <div className="mt-4 w-[280px] sm:w-[320px] bg-white rounded-2xl p-4 border border-rose-100 shadow-sm animate-fadeIn" style={{ animationDelay: '300ms' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-500">
          <Heart size={16} className="fill-current" />
        </div>
        <div>
          <h4 className="text-[12px] font-bold text-rose-500 uppercase tracking-wider mb-1">Motivation</h4>
          <p className="text-[14px] text-slate-700 leading-snug font-medium italic">
            "{motivation}"
          </p>
        </div>
      </div>
    </div>
  );
};
