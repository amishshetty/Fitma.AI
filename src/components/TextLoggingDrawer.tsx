import { X, Loader2, Check, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PrimaryButton from './ui/PrimaryButton';
import { ink } from '../constants';

export default function TextLoggingDrawer({
  onClose,
  onLogMeal,
  userProfile,
  memories,
  loggedMeals = [],
}: {
  onClose: () => void;
  onLogMeal: (meal: any) => void;
  userProfile: any;
  memories: any[];
  loggedMeals?: any[];
}) {
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [pendingInternalMeal, setPendingInternalMeal] = useState<any>(null);

  const handleParseAndSave = async () => {
    if (!text.trim()) return;
    setIsParsing(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          deviceId: 'text-logger',
          profile: userProfile || {
            name: 'User',
            goal: 'maintenance',
            diet: 'any',
            dailyCalories: 2000,
            motivationStyle: 'friendly',
            language: 'english',
          },
          memories: memories || [],
          previousMessages: [],
          loggedMeals: [],
          remainingCalories: userProfile?.dailyCalories || 2000,
        }),
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();

      if (data.mealData) {
        if (!data.mealData.name && data.mealData.items) {
          data.mealData.name = data.mealData.items.join(', ');
        }
        setIsParsing(false);
        if (
          !data.mealData.mealType ||
          data.mealData.mealType.toLowerCase() === 'unknown'
        ) {
          setPendingInternalMeal(data.mealData);
        } else {
          onLogMeal(data.mealData);
          onClose();
        }
      } else {
        throw new Error('No meal data found in AI response');
      }
    } catch (e) {
      console.error(e);
      // Fallback if AI fails
      onLogMeal({
        mealType: 'snack',
        items: [text],
        calories: 250,
        protein: 5,
        name: text,
      });
      setIsParsing(false);
      onClose();
    }
  };

  const { recentMealNames, isCustom } = useMemo(() => {
    const names = new Set<string>();
    // Assume id is timestamp, sort descending
    const sorted = [...(loggedMeals || [])].sort((a, b) => parseInt(b.id || '0') - parseInt(a.id || '0'));
    for (const meal of sorted) {
      if (meal.name && typeof meal.name === 'string' && meal.name.trim() !== '') {
        names.add(meal.name);
      }
      if (names.size >= 3) break;
    }
    const arr = Array.from(names);
    if (arr.length > 0) {
      return { recentMealNames: arr, isCustom: true };
    }
    return {
      recentMealNames: [
        'Add 2 roti 2 egg in breakfast',
        'Had chicken and rice for lunch',
        'Ate 1 apple for snack',
      ],
      isCustom: false,
    };
  }, [loggedMeals]);

  const suggestions = recentMealNames;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden pointer-events-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-card text-card-foreground rounded-t-[32px] p-6 pb-8 shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Smart Meal Log</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Type naturally. We'll extract the details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-border text-muted-foreground active:scale-95 transition-transform"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5 flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (pendingInternalMeal) setPendingInternalMeal(null);
              }}
              className="min-h-32 w-full resize-none rounded-[24px] bg-card text-foreground p-5 text-base outline-none transition-shadow focus:ring-4 focus:ring-primary/20 shadow-sm border border-slate-100 dark:border-border"
              placeholder='"I had 2 rotis and 2 eggs for breakfast"'
            />
            {/* Decorative AI icon */}
            <div className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              <Activity size={14} /> AI Powered
            </div>
          </div>

          <AnimatePresence>
            {pendingInternalMeal && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex flex-col items-start w-full space-y-2 overflow-hidden"
              >
                <div className="bg-card text-card-foreground px-4 py-2.5 rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm shadow-sm border border-slate-100 dark:border-border max-w-[85%]">
                  <p className="text-foreground font-extrabold text-[13px] tracking-tight">
                    Which meal is this?
                  </p>
                </div>
                <div className="flex flex-nowrap overflow-x-auto gap-2 w-full pb-1 hide-scrollbar pt-1">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        onLogMeal({
                          ...pendingInternalMeal,
                          mealType: section.toLowerCase(),
                        });
                        setPendingInternalMeal(null);
                        onClose();
                      }}
                      className="bg-card text-card-foreground hover:bg-secondary text-primary font-bold py-2 px-4 rounded-lg shadow-sm border border-slate-100 dark:border-border text-[12px] whitespace-nowrap transition-colors flex-shrink-0"
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
            {isCustom ? 'Previously Logged' : 'Try these examples'}
          </p>
          <div className="flex flex-col gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setText(suggestion)}
                className="text-left rounded-xl bg-card text-card-foreground p-3 text-sm text-muted-foreground active:bg-slate-50 dark:active:bg-muted transition-colors border border-slate-100 dark:border-border shadow-sm"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>

        <PrimaryButton
          onClick={handleParseAndSave}
          disabled={isParsing || !text.trim()}
          icon={
            isParsing ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Check size={18} />
            )
          }
        >
          {isParsing ? 'Analyzing & Saving...' : 'Save Smart Meal'}
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
