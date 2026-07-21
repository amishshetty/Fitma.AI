import React from "react";
import { Flame, Egg, Lightbulb, Heart, ArrowRight } from "lucide-react";

interface FoodRecommendationCardProps {
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  why?: string[];
  tip?: string;
}

export const FoodRecommendationCard: React.FC<FoodRecommendationCardProps> = ({
  meal,
  calories,
  protein,
  why,
  tip
}) => {
  return (
    <div className="mt-3 w-[280px] sm:w-[320px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#34C759]/20 bg-gradient-to-br from-white to-[#f7fdf9] animate-fadeIn">
      {/* Header section with gradient */}
      <div className="bg-gradient-to-r from-[#e8f7ed] to-[#f2faf5] px-5 py-4 border-b border-[#34C759]/10 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#34C759]/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl flex-shrink-0 border border-[#34C759]/10">
            🍲
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[#34C759] uppercase tracking-wider mb-1">Recommended</p>
            <h3 className="text-[17px] font-extrabold text-slate-800 leading-tight">
              {meal}
            </h3>
            {why && why.length > 0 && (
              <p className="text-[12px] text-slate-500 mt-1.5 font-medium flex items-center gap-1.5 flex-wrap">
                {why.slice(0, 2).map((reason, idx) => (
                  <span key={idx} className="flex items-center gap-1">
                    {idx > 0 && <span className="text-slate-300">•</span>}
                    {reason}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Macros Section */}
      <div className="px-5 py-3.5 flex gap-2 overflow-x-auto no-scrollbar">
        <div className="bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 flex items-center gap-1.5 whitespace-nowrap">
          <Flame size={14} className="text-orange-500" />
          <span className="font-bold text-slate-700 text-sm">{calories} <span className="text-[10px] text-slate-500 font-medium">kcal</span></span>
        </div>
        <div className="bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 flex items-center gap-1.5 whitespace-nowrap">
          <Egg size={14} className="text-amber-500" />
          <span className="font-bold text-slate-700 text-sm">{protein}g <span className="text-[10px] text-slate-500 font-medium">Protein</span></span>
        </div>
      </div>

      {/* Tip Section (if part of meal) */}
      {tip && (
        <div className="px-5 pb-4 pt-1">
          <div className="flex items-start gap-2 text-[13px] text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <span className="mt-0.5">💡</span>
            <p className="flex-1 leading-snug">{tip}</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface AlternativeFoodsCardProps {
  alternatives: string[];
}

export const AlternativeFoodsCard: React.FC<AlternativeFoodsCardProps> = ({ alternatives }) => {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="mt-4 w-[280px] sm:w-[320px] animate-fadeIn" style={{ animationDelay: '100ms' }}>
      <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 ml-1">Better Alternatives</h4>
      <div className="flex flex-col gap-2">
        {alternatives.map((alt, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm group hover:border-[#34C759]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></div>
              <span className="text-[14px] font-semibold text-slate-700">{alt}</span>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-[#34C759] transition-colors" />
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
  if (!tip) return null;
  
  return (
    <div className="mt-4 w-[280px] sm:w-[320px] bg-gradient-to-r from-[#34C759]/10 to-[#34C759]/5 rounded-2xl p-4 border border-[#34C759]/20 animate-fadeIn" style={{ animationDelay: '200ms' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#34C759]/20 flex items-center justify-center flex-shrink-0 text-[#2e7d32]">
          <Lightbulb size={18} className="fill-current" />
        </div>
        <div>
          <h4 className="text-[12px] font-bold text-[#2e7d32] uppercase tracking-wider mb-1">Liva Tip</h4>
          <p className="text-[14px] text-slate-700 leading-snug font-medium">
            {tip}
          </p>
        </div>
      </div>
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
