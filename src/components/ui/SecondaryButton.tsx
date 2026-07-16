import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { muted } from "../../constants";

export default function SecondaryButton({
  children,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold"
      style={{ color: muted, border: "1px solid rgba(52,199,89,0.14)" }}
    >
      {icon}
      {children}
    </motion.button>
  );
}
