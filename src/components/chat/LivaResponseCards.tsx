import React from "react";
import { Leaf, Lightbulb, ChevronRight, Flame, Egg, Droplet } from "lucide-react";

interface AlternativeFood {
  name: string;
  description: string;
}

interface FoodRecommendationCardProps {
  meal?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  why?: string[];
  message_suffix?: string;
  alternatives?: AlternativeFood[];
  tip?: string;
}

export const FoodRecommendationCard: React.FC<FoodRecommendationCardProps> = ({
  alternatives,
  tip
}) => {
  return (
    <div className="flex flex-col gap-3 w-full animate-fadeIn mt-2">
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
    <div className="w-full animate-fadeIn mt-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-[#34C759]/10 flex items-center justify-center">
          <Leaf size={12} className="text-[#34C759]" />
        </div>
        <h4 className="text-[14px] font-bold text-slate-800">Better Alternatives</h4>
        <div className="flex-1 h-px bg-slate-100 ml-2"></div>
      </div>
      
      <div className="flex flex-col rounded-[16px] border border-slate-100 bg-white overflow-hidden shadow-sm">
        {alternatives.map((alt, idx) => {
          // Add some robust error checking in case backend sends string
          const isString = typeof alt === 'string';
          const name = isString ? alt : (alt?.name || "Alternative Option");
          const description = isString ? "" : (alt?.description || "A healthy alternative for your meal.");
          
          return (
            <div key={idx}>
              {idx > 0 && <div className="border-t border-dashed border-slate-100 mx-4" />}
              <div className="flex items-center justify-between px-4 py-3 group hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f2faf5] flex items-center justify-center text-lg flex-shrink-0">
                    {idx % 2 === 0 ? "🍲" : "🥗"}
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[14px] font-bold text-slate-800">{name}</span>
                    {description && (
                      <span className="text-[12px] text-slate-500 font-medium leading-snug mt-0.5">{description}</span>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#34C759] flex-shrink-0 opacity-70" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const LivaTipCard = ({ tip }: { tip: string }) => {
  if (!tip) return null;
  return (
    <div className="mt-2 w-full bg-[#f2faf5] rounded-[16px] p-4 flex gap-3 animate-fadeIn border border-[#34C759]/10">
      <div className="mt-0.5 text-[#34C759]">
        <Lightbulb size={18} />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-[#2a9d48] mb-1">Liva Tip</h4>
        <p className="text-sm font-medium text-slate-700 leading-relaxed">{tip}</p>
      </div>
      <div className="text-[#34C759] opacity-50">
        <span className="text-lg">✨</span>
      </div>
    </div>
  );
};

export const NutritionSummaryCard = ({ calories, protein, carbs, fat }: { calories: number, protein: number, carbs: number, fat: number }) => {
  return (
    <div className="w-full mt-3 bg-white rounded-[16px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 animate-fadeIn">
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center justify-center border-r border-slate-100">
          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mb-1.5">
            <Flame size={14} className="text-orange-500" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 mb-0.5">Calories</span>
          <div className="font-extrabold text-slate-800 text-sm leading-none">{calories} <span className="text-[10px] font-semibold text-slate-400">kcal</span></div>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-slate-100">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mb-1.5">
            <Egg size={14} className="text-amber-500" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 mb-0.5">Protein</span>
          <div className="font-extrabold text-slate-800 text-sm leading-none">{protein} <span className="text-[10px] font-semibold text-slate-400">g</span></div>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-slate-100">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mb-1.5">
            <Leaf size={14} className="text-green-500" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 mb-0.5">Carbs</span>
          <div className="font-extrabold text-slate-800 text-sm leading-none">{carbs} <span className="text-[10px] font-semibold text-slate-400">g</span></div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1.5">
            <Droplet size={14} className="text-blue-500" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 mb-0.5">Fat</span>
          <div className="font-extrabold text-slate-800 text-sm leading-none">{fat} <span className="text-[10px] font-semibold text-slate-400">g</span></div>
        </div>
      </div>
    </div>
  );
};
