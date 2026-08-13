import React from 'react';
import { ArrowLeft } from 'lucide-react';


export default function GlassBackButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95 text-foreground ${className || ''}`}
      aria-label="Go back"
    >
      <ArrowLeft size={20} strokeWidth={2.5} />
    </button>
  );
}
