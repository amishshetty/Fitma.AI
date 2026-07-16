import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "./LivaAvatar";

export default function LivaSiriOverlay({
  text,
  onClose,
  cueCard
}: {
  text: string;
  onClose: () => void;
  cueCard?: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 bg-black/16 backdrop-blur-[2px] z-50 flex flex-col justify-end overflow-hidden pointer-events-auto">
      {/* Tap backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {cueCard && (
        <div className="z-20 w-full px-4 mb-4 flex flex-col items-center pointer-events-auto">
          {cueCard}
        </div>
      )}

      {/* Siri Glowing wave container */}
      <div className="relative bg-white/94 backdrop-blur-md rounded-t-[32px] p-6 pb-9 border-t border-white/20 flex flex-col items-center text-center space-y-5 shadow-2xl z-10">
        <LivaAvatar size={74} floating />
        
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liva Assistant</p>
          <p className="text-sm font-bold text-slate-800 leading-relaxed px-4">
            {text}
          </p>
        </div>

        {/* Apple Siri fluid wave animation */}
        <div className="w-full h-8 relative flex items-center justify-center overflow-hidden">
          <motion.div
            animate={{
              scaleX: [1, 1.15, 1],
              scaleY: [1, 1.4, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-56 h-12 bg-gradient-to-r from-teal-400 via-purple-500 via-pink-400 to-[#34c759] rounded-full blur-lg opacity-85 absolute bottom-[-24px]"
          />
          <div className="w-48 h-8 bg-gradient-to-r from-sky-400 via-[#34c759] to-amber-300 rounded-full blur-md opacity-60 absolute bottom-[-16px] animate-pulse" />
        </div>

        <button
          onClick={onClose}
          className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full"
        >
          Dismiss Liva
        </button>
      </div>
    </div>
  );
}
