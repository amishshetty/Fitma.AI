import React, { useState, useEffect, useRef, useMemo } from "react";
import ScreenShell from "./ScreenShell";
import { ink, green, muted } from "../constants";
import { Screen } from "../types";

export default function LivaRecommendationsScreen({ onBack, onSelectRecipe }: { onBack: () => void; onSelectRecipe: (recipeId: number) => void }) {
  const recommendations = [
    {
      id: 1,
      title: "Gourmet Quinoa Bowl",
      calories: 460,
      protein: "32g",
      prepTime: "20 min",
      score: 95,
      image: mealRecommendationImg,
      description: "Quinoa loaded with grilled chicken breast, avocado, and spinach."
    },
    {
      id: 2,
      title: "Herb Grilled Salmon",
      calories: 520,
      protein: "38g",
      prepTime: "15 min",
      score: 92,
      image: recipeHeroImg,
      description: "Rich salmon fillet served with lemon broccoli slices."
    },
    {
      id: 3,
      title: "Sautéed Paneer Salad",
      calories: 390,
      protein: "18g",
      prepTime: "12 min",
      score: 89,
      image: mealRecommendationImg,
      description: "Low-carb warm paneer tossed with bell peppers and microgreens."
    }
  ];

  return (
    <ScreenShell title="Dinner Suggestions" subtitle="Personalized dinner ideas matching your protein target." onBack={onBack}>
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="overflow-hidden rounded-[26px] bg-white border border-[#34C759]/10"
            style={{ boxShadow: "0 6px 20px rgba(16,32,26,0.05)" }}
          >
            <div className="h-32 w-full bg-slate-100 relative">
              <img src={rec.image} alt={rec.title} className="h-full w-full object-cover" />
              <div className="absolute right-3.5 top-3.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#197a38] backdrop-blur-sm">
                ★ {rec.score} Score
              </div>
            </div>
            <div className="p-4.5">
              <h3 className="text-base font-bold" style={{ color: ink }}>
                {rec.title}
              </h3>
              <p className="mt-1 text-xs" style={{ color: muted }}>
                {rec.description}
              </p>
              
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500 border-t border-[#34C759]/06 pt-3.5">
                <span>🔥 {rec.calories} kcal</span>
                <span>💪 {rec.protein} Prot</span>
                <span>⏱ {rec.prepTime}</span>
              </div>
              
              <button
                onClick={() => onSelectRecipe(rec.id)}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#ecfbf1] py-2.5 text-xs font-bold"
                style={{ color: green }}
              >
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}
