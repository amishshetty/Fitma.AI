import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import BottomNav from '../components/layout/BottomNav';
import ScreenShell from './ScreenShell';
import { ink, muted } from '../constants';
import { Screen, EntryMode } from '../types';
import { quickOptions } from '../constants';

export default function QuickLogScreen({
  onSelect,
  onBack,
  onNavigate,
}: {
  onSelect: (mode: EntryMode) => void;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <ScreenShell
        title="Log Your Meal"
        subtitle="Choose the easiest way."
        onBack={onBack}
      >
        <div className="space-y-4">
          {quickOptions.map((option) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.title}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(option.mode)}
                className="flex w-full items-center gap-5 rounded-[28px] bg-card text-card-foreground p-5 text-left border border-slate-100 dark:border-border shadow-sm"
              >
                <span
                  className="overflow-hidden relative flex h-16 w-16 items-center justify-center rounded-[22px]"
                  style={{ background: option.bg, color: option.tint }}
                >
  <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
    <Icon size={30} />
  </div>
</span>
                <span className="min-w-0 flex-1">
                  <span
                    className="block text-lg font-bold text-foreground"
                    
                  >
                    {option.title}
                  </span>
                  <span
                    className="mt-1 block text-sm leading-relaxed text-muted-foreground"
                    
                  >
                    {option.description}
                  </span>
                </span>
                <ChevronRight size={20} className="text-muted-foreground" />
              </motion.button>
            );
          })}
          <div className="pt-4">
            <h2 className="mb-3 text-sm font-bold text-foreground" >
              Recent Meals
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                'Paneer Paratha',
                'Chicken Biryani',
                'Dal Rice',
                'Oats Breakfast',
              ].map((meal) => (
                <button
                  key={meal}
                  className="rounded-2xl bg-card text-foreground px-4 py-3 text-left text-sm font-semibold border border-slate-100 dark:border-border"
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScreenShell>
      <BottomNav active="log" onNavigate={onNavigate} />
    </div>
  );
}
