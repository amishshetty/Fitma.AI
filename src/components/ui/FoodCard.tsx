import { Utensils, Plus } from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ink, green, muted, softGreen } from '../../constants';

export default function FoodCard({
  name,
  calories,
  protein,
  serving,
  onAdd,
}: {
  name: string;
  calories: number;
  protein: number;
  serving: string;
  onAdd?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border shadow-sm"
    >
      <div
        className="overflow-hidden relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
      >
  <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
    <Utensils size={24} />
  </div>
</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground" >
          {name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground" >
          {calories} kcal - {protein}g protein
        </p>
        <p className="text-xs text-muted-foreground">
          {serving}
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
        aria-label={`Add ${name}`}
      >
        <Plus size={19} />
      </button>
    </div>
  );
}
