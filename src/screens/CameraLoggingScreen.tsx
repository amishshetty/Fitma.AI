import { ArrowLeft, Utensils, Flashlight, Image } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import IconButton from "../components/ui/IconButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import { green } from "../constants";
import { Screen } from "../types";

export default function CameraLoggingScreen({ onBack, onCapture }: { onBack: () => void; onCapture: (base64: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
          onCapture(compressedBase64);
        } else {
          // Fallback if canvas fails
          onCapture(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#10201a] text-white">
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-3 px-6 pt-10">
        <IconButton onClick={onBack} label="Back">
          <ArrowLeft size={19} />
        </IconButton>
        <div>
          <p className="text-xl font-bold text-white">Take a clear photo.</p>
          <p className="text-sm text-white/70">Center the plate inside the guide.</p>
        </div>
      </div>
      <div className="relative flex flex-1 items-center justify-center" style={{ background: "radial-gradient(circle at 50% 45%, #27443a, #10201a 68%)" }}>
        <div className="absolute h-72 w-72 rounded-[36px]" style={{ border: "2px solid rgba(255,255,255,0.72)" }} />
        <div className="absolute h-56 w-56 rounded-full" style={{ border: "1px dashed rgba(52,199,89,0.8)" }} />
        <Utensils size={76} color="rgba(255,255,255,0.62)" />
        <motion.div animate={{ y: [-120, 120, -120] }} transition={{ duration: 2.4, repeat: Infinity }} className="absolute h-0.5 w-72 rounded-full bg-[#34C759]" />
      </div>
      <div className="grid grid-cols-3 gap-3 bg-black/20 px-6 pb-9 pt-5 backdrop-blur">
        <SecondaryButton icon={<Image size={18} />} onClick={() => fileInputRef.current?.click()}>Gallery</SecondaryButton>
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white" style={{ boxShadow: "0 0 0 6px rgba(255,255,255,0.18)" }}>
          <span className="h-12 w-12 rounded-full" style={{ background: green }} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
        </div>
        <SecondaryButton icon={<Flashlight size={18} />}>Flash</SecondaryButton>
      </div>
    </div>
  );
}
