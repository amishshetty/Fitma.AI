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
  onQuickAction?: (action: string) => void;
}

export const FoodRecommendationCard: React.FC<FoodRecommendationCardProps> = ({
  meal,
  calories,
  why,
  message_suffix,
  alternatives,
  tip,
  onQuickAction
}) => {
  return (
    <div className="flex flex-col gap-2 w-full animate-fadeIn mt-1">
      {meal && (
        <div className="bg-[#f8faf8] border border-slate-100 rounded-xl p-3 shadow-sm flex justify-between items-center">
          <span className="font-bold text-[14px] text-slate-800">{meal}</span>
          {calories && <span className="text-[12px] font-semibold text-[#34C759]">{calories} kcal</span>}
        </div>
      )}

      {message_suffix && (
        <p className="text-[13px] text-slate-600 italic leading-snug">{message_suffix}</p>
      )}

      {why && why.length > 0 && (
        <div className="pl-1">
          <h4 className="text-[12px] font-bold text-slate-700 mb-1">Why it's good:</h4>
          <ul className="list-disc pl-4 space-y-0.5">
            {why.map((reason, idx) => (
              <li key={idx} className="text-[12px] text-slate-600 leading-snug">{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {alternatives && alternatives.length > 0 && (
        <AlternativeFoodsCard alternatives={alternatives} />
      )}
      
      {tip && (
        <LivaTipCard tip={tip} />
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {[
          { label: "Log This Meal", query: `Log this meal: ${meal || "this meal"}` },
          { label: "Show Another Option", query: "Show Another Option" },
          { label: "Vegetarian Version", query: "Vegetarian Version" },
          { label: "High Protein", query: "High Protein" },
          { label: "Takes <15 mins", query: "Takes <15 mins" }
        ].map((action, idx) => (
          <button
            key={idx}
            onClick={() => onQuickAction && onQuickAction(action.query)}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 
                       bg-[#f2faf5] text-[#2a9d48] border border-[#34C759]/20 
                       hover:bg-[#34C759] hover:text-white hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};


interface AlternativeFoodsCardProps {
  alternatives: AlternativeFood[];
}

export const AlternativeFoodsCard: React.FC<AlternativeFoodsCardProps> = ({ alternatives }) => {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="w-full animate-fadeIn mt-1">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-5 h-5 rounded-full bg-[#34C759]/10 flex items-center justify-center">
          <Leaf size={10} className="text-[#34C759]" />
        </div>
        <h4 className="text-[13px] font-bold text-slate-800">Alternatives</h4>
      </div>
      
      <div className="flex flex-col rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
        {alternatives.map((alt, idx) => {
          const isString = typeof alt === 'string';
          const name = isString ? alt : (alt?.name || "Alternative Option");
          const description = isString ? "" : (alt?.description || "");
          
          return (
            <div key={idx}>
              {idx > 0 && <div className="border-t border-dashed border-slate-100 mx-3" />}
              <div className="flex items-center justify-between px-3 py-2 group hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col justify-center">
                    <span className="text-[13px] font-bold text-slate-800 leading-tight">{name}</span>
                    {description && (
                      <span className="text-[11px] text-slate-500 font-medium leading-tight">{description}</span>
                    )}
                  </div>
                </div>
                <ChevronRight size={14} className="text-[#34C759] flex-shrink-0 opacity-70" />
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
    <div className="mt-1 w-full bg-[#f2faf5] rounded-xl p-3 flex gap-2 animate-fadeIn border border-[#34C759]/10">
      <div className="mt-0.5 text-[#34C759]">
        <Lightbulb size={14} />
      </div>
      <div className="flex-1">
        <h4 className="text-[11px] font-bold text-[#2a9d48] mb-0.5">Tip</h4>
        <p className="text-[12px] font-medium text-slate-700 leading-snug">{tip}</p>
      </div>
    </div>
  );
};

export const NutritionSummaryCard = ({ calories, protein, carbs, fat }: { calories: number, protein: number, carbs: number, fat: number }) => {
  return (
    <div className="w-full mt-2 bg-white rounded-xl border border-slate-100 shadow-sm p-3 animate-fadeIn">
      <div className="grid grid-cols-4 gap-1">
        <div className="flex flex-col items-center justify-center border-r border-slate-100">
          <span className="text-[10px] font-semibold text-slate-500 mb-0.5">Cals</span>
          <div className="font-extrabold text-slate-800 text-[13px] leading-none">{calories}</div>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-slate-100">
          <span className="text-[10px] font-semibold text-slate-500 mb-0.5">Pro</span>
          <div className="font-extrabold text-slate-800 text-[13px] leading-none">{protein}g</div>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-slate-100">
          <span className="text-[10px] font-semibold text-slate-500 mb-0.5">Carbs</span>
          <div className="font-extrabold text-slate-800 text-[13px] leading-none">{carbs}g</div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-500 mb-0.5">Fat</span>
          <div className="font-extrabold text-slate-800 text-[13px] leading-none">{fat}g</div>
        </div>
      </div>
    </div>
  );
};
