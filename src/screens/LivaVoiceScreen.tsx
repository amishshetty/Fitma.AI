import { ArrowLeft, MicOff, Mic } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import IconButton from "../components/ui/IconButton";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import { Screen } from "../types";

export default function LivaVoiceScreen({ onCancel, onDone }: { onCancel: () => void; onDone: (spoken: string) => void }) {
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing" | "error">("idle");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus("error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setTranscript(currentTranscript);
    };
    recognition.onerror = () => setVoiceStatus("error");
    recognition.onend = () => {
      if (voiceStatus === "listening") setVoiceStatus("idle");
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = async () => {
    if (recognitionRef.current) {
      // Workaround: Explicitly request microphone permission first to fix access denied issues in Chrome/Mobile
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error("Microphone access error:", err);
        alert("Microphone access denied. Please enable microphone permissions in your browser.");
        setVoiceStatus("error");
        return;
      }

      setVoiceStatus("listening");
      setTranscript("");
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
        setVoiceStatus("error");
      }
    }
  };

  const handleSend = () => {
    if (transcript.trim()) {
      recognitionRef.current?.stop();
      setVoiceStatus("processing");
      onDone(transcript.trim());
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#10201a] text-white">
      <div className="flex items-center gap-3 px-6 pt-11">
        <IconButton onClick={() => { recognitionRef.current?.stop(); onCancel(); }} label="Back">
          <ArrowLeft size={19} color="#10201a" />
        </IconButton>
        <div>
          <h1 className="text-lg font-bold text-white">Voice Conversation</h1>
          <p className="text-xs text-[#6d8779]">Speak to Liva</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <div className="relative mb-12">
          {voiceStatus === "listening" && <div className="absolute inset-0 rounded-full bg-[#34C759]/10 animate-ping" />}
          <motion.div
            animate={voiceStatus === "listening" ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 1.8, repeat: Infinity }}
            onClick={voiceStatus === "idle" || voiceStatus === "error" ? startListening : undefined}
            className={`relative flex h-36 w-36 items-center justify-center rounded-full text-white ${voiceStatus === "idle" || voiceStatus === "error" ? "cursor-pointer hover:scale-105 transition-transform" : ""}`}
            style={{
              background: voiceStatus === "error" ? "linear-gradient(135deg, #ef4444, #dc2626)" : voiceStatus === "idle" ? "linear-gradient(135deg, #9bb2a5, #6d8779)" : "linear-gradient(135deg, #34C759, #00C4B0)",
              boxShadow: voiceStatus === "error" ? "0 18px 48px rgba(239,68,68,0.3)" : voiceStatus === "idle" ? "0 18px 48px rgba(155,178,165,0.3)" : "0 18px 48px rgba(52,199,89,0.3)",
            }}
          >
            {voiceStatus === "error" ? <MicOff size={64} /> : <Mic size={64} />}
          </motion.div>
        </div>

        <h1 className="text-2xl font-extrabold tracking-wide" style={{ color: "#ffffff" }}>
          {voiceStatus === "error" ? "Mic not available" : voiceStatus === "processing" ? "Sending to Liva..." : voiceStatus === "idle" ? "Tap Mic to Start" : "Listening..."}
        </h1>

        {transcript && (
          <p className="mt-4 max-w-[300px] text-sm leading-relaxed text-[#b0d4be] bg-white/5 rounded-2xl px-5 py-3 border border-white/10">
            "{transcript}"
          </p>
        )}

        {!transcript && voiceStatus === "listening" && (
          <p className="mt-3.5 max-w-[260px] text-sm leading-relaxed text-[#9bb2a5]">
            Try saying: <span className="text-[#34C759] font-semibold">"I had two rotis and dal"</span>
          </p>
        )}

        {/* Waveform lines */}
        <div className="mt-11 flex h-14 items-end gap-2.5">
          {[28, 48, 34, 60, 42, 50, 32].map((height, index) => (
            <motion.div
              key={index}
              animate={{ height: voiceStatus === "listening" ? [16, height, 18] : [8, 8, 8] }}
              transition={{ duration: 0.85, delay: index * 0.08, repeat: Infinity }}
              className="w-2 rounded-full"
              style={{ background: index % 2 ? "#00C4B0" : "#34C759" }}
            />
          ))}
        </div>
      </div>

      <div className="px-6 pb-9 pt-5 space-y-3">
        {transcript && (
          <PrimaryButton onClick={handleSend}>Send to Liva</PrimaryButton>
        )}
        <SecondaryButton onClick={() => { recognitionRef.current?.stop(); onCancel(); }}>Cancel</SecondaryButton>
      </div>
    </div>
  );
}
