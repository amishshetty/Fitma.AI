import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import IconButton from "../components/ui/IconButton";
import { ink, muted } from "../constants";
import { Screen } from "../types";

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
    <div className="flex min-h-0 flex-1 flex-col" style={{ background: "#f7fffe" }}>
      <div className="flex items-center gap-3 px-6 pt-10">
        {onBack && (
          <IconButton onClick={onBack} label="Back">
            <ArrowLeft size={19} />
          </IconButton>
        )}
        <div className="min-w-0 flex-1">
          {title && (
            <h1 className="text-2xl font-bold leading-tight" style={{ color: ink }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-1 text-sm leading-relaxed" style={{ color: muted }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className={`min-h-0 flex-1 overflow-y-auto px-6 ${compact ? "pt-4" : "pt-6"} pb-4`}>{children}</div>
      {footer && <div className="px-6 pb-8 pt-2">{footer}</div>}
    </div>
  );
}
