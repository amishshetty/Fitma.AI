import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { ink } from "../../constants";

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
      title={label}
      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white"
      style={{ color: ink, boxShadow: "0 4px 14px rgba(16,32,26,0.08)" }}
    >
      {children}
    </motion.button>
  );
}
