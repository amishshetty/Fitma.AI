import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";

export default function LivaAvatar({ size = 52, floating }: { size?: number; floating?: boolean }) {
  return (
    <motion.div
      animate={floating ? { y: [0, -6, 0] } : undefined}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #ffffff 0%, #e9faef 100%)",
        boxShadow: "0 8px 26px rgba(52,199,89,0.24), inset 0 0 0 2px rgba(52,199,89,0.14)",
      }}
    >
      <svg width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <circle cx="40" cy="44" r="30" fill="#f0fdf4" />
        <circle cx="40" cy="44" r="29" stroke="#d8f3df" strokeWidth="2" />
        <circle cx="31" cy="40" r="5" fill="#0f1f1a" />
        <circle cx="49" cy="40" r="5" fill="#0f1f1a" />
        <circle cx="33" cy="38" r="2" fill="white" />
        <circle cx="51" cy="38" r="2" fill="white" />
        <path d="M32 51Q40 60 48 51" stroke="#0f1f1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="26" cy="52" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.48" />
        <ellipse cx="54" cy="52" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.48" />
        <line x1="40" y1="14" x2="40" y2="24" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="40" cy="11" r="5" fill="#34C759" />
        <circle cx="40" cy="11" r="2.5" fill="#22c55e" />
      </svg>
    </motion.div>
  );
}
