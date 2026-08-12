import { Check } from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PrimaryButton from '../components/ui/PrimaryButton';
import ScreenShell from './ScreenShell';
import { ink, green, muted } from '../constants';
import { Screen } from '../types';

export default function LivaRecipeSwiperScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  const recipes = [
    {
      id: 1,
      title: 'High-Protein Lentil Wrap',
      kcal: 340,
      macro: '18g Protein',
      img: mealRecommendationImg,
    },
    {
      id: 2,
      title: 'Lemon Herb Quinoa Salad',
      kcal: 290,
      macro: '11g Protein',
      img: recipeHeroImg,
    },
    {
      id: 3,
      title: 'Greek Yogurt Berry Bowl',
      kcal: 210,
      macro: '16g Protein',
      img: mealRecommendationImg,
    },
  ];

  const [index, setIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const handleSwipe = (like: boolean) => {
    if (like) setSavedCount((c) => c + 1);
    setIndex((i) => i + 1);
  };

  const isDeckEmpty = index >= recipes.length;

  return (
    <ScreenShell
      title="Recipe Swiper"
      subtitle="Discover healthy quick meals. Swipe left to skip, right to save."
      onBack={onBack}
    >
      <div className="flex h-full flex-col justify-center items-center">
        {!isDeckEmpty ? (
          <div
            className="w-full max-w-[280px] bg-card text-card-foreground rounded-[32px] border border-[#34C759]/16 overflow-hidden relative"
            style={{ boxShadow: '0 12px 30px rgba(16,32,26,0.06)' }}
          >
            <div className="h-48 w-full bg-border">
              <img
                src={recipes[index].img}
                alt={recipes[index].title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="text-base font-bold text-foreground" >
                {recipes[index].title}
              </h3>
              <div className="mt-2.5 flex justify-center gap-3 text-xs font-semibold text-muted-foreground">
                <span>🔥 {recipes[index].kcal} kcal</span>
                <span>🥚 {recipes[index].macro}</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-around gap-3">
                <button
                  onClick={() => handleSwipe(false)}
                  className="flex h-12 w-24 items-center justify-center rounded-xl bg-slate-50 dark:bg-muted text-xs font-bold text-muted-foreground hover:bg-border transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleSwipe(true)}
                  className="flex h-12 w-24 items-center justify-center rounded-xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
                  style={{ background: green }}
                >
                  Save Recipe
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 space-y-6">
            <div className="overflow-hidden relative flex h-20 w-20 items-center justify-center rounded-full bg-[#ecfbf1] text-[#34C759] mx-auto">
  <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
    <Check size={36} />
  </div>
</div>
            <div>
              <h3 className="text-lg font-bold text-foreground" >
                Swipe Deck Complete
              </h3>
              <p
                className="mt-2 text-xs leading-relaxed text-muted-foreground"
                
              >
                You saved{' '}
                <span className="font-bold text-[#34C759]">
                  {savedCount} recipes
                </span>{' '}
                to your favorite vault!
              </p>
            </div>
            <PrimaryButton onClick={onBack}>Return to Dashboard</PrimaryButton>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
