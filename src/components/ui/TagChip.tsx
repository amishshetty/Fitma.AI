import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ink } from '../../constants';

export default function TagChip({
  children,
  onClick,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-sm border border-slate-100 dark:border-border"
    >
      {icon}
      <span className="text-sm font-medium text-foreground">
        {children}
      </span>
    </button>
  );
}
