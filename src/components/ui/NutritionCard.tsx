import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ink, muted } from '../../constants';

export default function NutritionCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl bg-card text-card-foreground p-4 border border-slate-100 dark:border-border shadow-sm"
    >
      <div
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <p className="text-lg font-bold text-foreground" >
        {value}
      </p>
      <p className="text-xs font-medium text-muted-foreground" >
        {label}
      </p>
    </div>
  );
}
