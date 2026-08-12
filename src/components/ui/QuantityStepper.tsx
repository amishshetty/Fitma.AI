import { Minus, Plus } from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ink, green } from '../../constants';

export default function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-secondary p-1">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-card-foreground shadow-sm border border-slate-100 dark:border-border"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span
        className="w-6 text-center text-sm font-bold text-foreground"
        
      >
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
