import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import ScreenShell from "./ScreenShell";
import { ink, muted, rotatingFacts } from "../constants";
import { Screen } from "../types";

export default function CameraAIProcessingScreen({ image, mealType, loggedMeals, onDone, onError }: { image: string, mealType: string, loggedMeals: any[], onDone: (data: any) => void, onError: (err: string) => void }) {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const factTimer = window.setInterval(() => setFactIndex((index) => (index + 1) % rotatingFacts.length), 1500);
    
    // Call our real Vision API
    const analyzeImage = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://fitma-ai.onrender.com';
        const response = await fetch(`${API_URL}/api/vision/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: image, mealType, recentMeals: loggedMeals })
        });
        const data = await response.json();
        if (data.success && data.mealData) {
          onDone(data.mealData);
        } else {
          onError("Failed to analyze image");
        }
      } catch (e) {
        console.error(e);
        onError("Network error while analyzing image");
      }
    };
    
    analyzeImage();

    return () => {
      window.clearInterval(factTimer);
    };
  }, [image, mealType, onDone, onError]);

  return (
    <ScreenShell>
      <div className="flex h-full flex-col items-center justify-center text-center p-6">
        <div className="relative mb-10 overflow-hidden rounded-full border-4 border-white shadow-2xl w-40 h-40">
          <img src={image} className="w-full h-full object-cover blur-sm opacity-80" alt="Analyzing" />
          <div className="absolute inset-0 flex items-center justify-center">
             <LivaAvatar size={80} floating />
          </div>
          <motion.div animate={{ y: [-80, 80, -80] }} transition={{ duration: 2, repeat: Infinity }} className="absolute left-0 right-0 h-1 bg-[#34C759] shadow-[0_0_10px_#34C759]" />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: ink }}>
          Analyzing your plate...
        </h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            className="mt-4 text-base font-semibold"
            style={{ color: muted }}
          >
            {rotatingFacts[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </ScreenShell>
  );
}
