import { motion } from 'motion/react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ink } from '../../constants';

export default function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/30 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-foreground hover:bg-white/50 dark:hover:bg-black/40 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-50 rounded-2xl pointer-events-none" />
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </motion.button>
  );
}
