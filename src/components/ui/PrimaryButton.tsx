import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";

export default function PrimaryButton({
  children,
  onClick,
  icon,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      onClick={disabled ? undefined : onClick}
      className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold text-white"
      style={{
        background: disabled ? "#b9dec5" : "linear-gradient(135deg, #34C759 0%, #25ad48 100%)",
        boxShadow: disabled ? "none" : "0 12px 28px rgba(52,199,89,0.34)",
      }}
    >
      {children}
      {icon}
    </motion.button>
  );
}
