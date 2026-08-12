import { motion } from 'motion/react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ink, green, muted } from '../../constants';

export default function ProgressRing({
  value,
  size = 88,
  color = green,
  label,
}: {
  value: number;
  size?: number;
  color?: string;
  label?: string;
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="-rotate-90 w-full h-full" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            className="stroke-muted-foreground/20"
            strokeWidth="9"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - value / 100) }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color: color }}>
            {value}%
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[11px] font-bold mt-1" style={{ color: color }}>
          {label}
        </span>
      )}
    </div>
  );
}
