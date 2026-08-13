import { ArrowLeft } from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import IconButton from '../components/ui/IconButton';
import GlassBackButton from '../components/ui/GlassBackButton';
import { ink, muted } from '../constants';
import { Screen } from '../types';

export default function ScreenShell({
  title,
  subtitle,
  children,
  footer,
  onBack,
  compact,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onBack?: () => void;
  compact?: boolean;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background text-foreground transition-colors duration-200">
      <div 
        className="flex flex-col px-6"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)' }}
      >
        <div className="flex items-start gap-3">
          {onBack && (
            <div className="flex-shrink-0 pt-[2px]">
              <GlassBackButton onClick={onBack} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h1 className="text-2xl font-bold leading-tight pt-1">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        className={`min-h-0 flex-1 overflow-y-auto px-6 ${compact ? 'pt-4' : 'pt-6'} pb-4`}
      >
        {children}
      </div>
      {footer && <div className="px-6 pb-8 pt-2">{footer}</div>}
    </div>
  );
}
