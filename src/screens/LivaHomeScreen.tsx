import {
  Sparkles,
  Camera,
  Mic,
  Keyboard,
  Send,
  BarChart2,
  PieChart,
  ArrowRight,
  Plus,
  UtensilsCrossed,
  Soup,
  Droplets,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import BottomNav from "../components/layout/BottomNav";
import LivaAvatar from "../components/layout/LivaAvatar";
import { ink, muted } from "../constants";
import { Screen, EntryMode, ChatMessage } from "../types";

export default function LivaHomeScreen({
  onNavigate,
  onStartLog,
  userName,
  userProfile,
  onMealLogged,
  onWaterLogged,
  onMealDeleted,
  remainingCalories = 0
}: {
  onNavigate: (screen: Screen) => void;
  onStartLog: (mode: EntryMode) => void;
  userName: string;
  userProfile?: any;
  onMealLogged?: (data: any) => void;
  onWaterLogged?: (data: any) => void;
  onMealDeleted?: (data: any) => void;
  remainingCalories?: number;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const suggestionsScrollRef = useRef<HTMLDivElement>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const scrollSuggestions = (direction: 'left' | 'right') => {
    if (suggestionsScrollRef.current) {
      const scrollAmount = 180;
      suggestionsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const quickSuggestions = [
    { label: "Log Lunch", icon: UtensilsCrossed, action: () => handleSendText("Log my lunch") },
    { label: "Suggest Dinner", icon: Soup, action: () => handleSendText("Suggest a healthy dinner") },
    { label: "Today's Summary", icon: BarChart2, action: () => handleSendText("What's my summary for today?") },
    { label: "Log Water", icon: Droplets, action: () => handleSendText("Log a glass of water") },
    { label: "...", icon: MoreHorizontal, action: () => {} }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { 
      id: Date.now().toString(),
      sender: "user", 
      text: textToSend,
      timestamp
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          profile: userProfile || {
            name: userName || "Amish",
            goal: "Weight Loss",
            diet: "Vegetarian",
            dailyCalories: 1800,
            motivationStyle: "Friendly",
            language: "English"
          },
          previousMessages: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact Liva backend");
      }

      const data = await response.json();
      const livaReply = data.response || "I'm here for you! Try asking me something about nutrition or log a meal.";

      if (data.mealData && onMealLogged) {
        onMealLogged(data.mealData);
      }
      
      if (data.waterData && onWaterLogged) {
        onWaterLogged(data.waterData);
      }
      
      if (data.deleteData && onMealDeleted) {
        onMealDeleted(data.deleteData);
      }

      setMessages((prev) => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(),
          sender: "liva", 
          text: livaReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error("Error communicating with Liva backend, using local fallback:", err);
      // Fallback
      setMessages((prev) => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(),
          sender: "liva", 
          text: `Hey ${userName || "Amish"}! I heard: "${textToSend}". I'm in fallback mode, but keep up the great work!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceInput = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const isIOSChrome = navigator.userAgent.match("CriOS");
    if (isIOSChrome) {
      alert("Apple restricts voice recognition in Chrome on iOS. Please use Safari to use voice features.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = userProfile?.language === "Hindi" ? "hi-IN" : userProfile?.language === "Marathi" ? "mr-IN" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = true; 
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setInputText(transcript);
      
      const currentResult = event.results[event.resultIndex];
      if (currentResult && currentResult.isFinal) {
        recognition.stop(); 
        setIsListening(false);
        handleSendText(transcript);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col" style={{ background: "#f8faf8" }}>
      {/* Scrollable Main Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-11 pb-64">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: ink }}>
              Hi {userName || "User"} 👋
            </h1>
            <p className="mt-1.5 text-sm font-semibold" style={{ color: muted }}>
              Liva Coach Mode is active
            </p>
          </div>
          <LivaAvatar size={54} floating />
        </div>

        {/* Coach Insight */}
        <div className="mb-8 relative overflow-hidden rounded-[20px] p-5 border border-[#d1f2db] bg-[#f1fcf5]">
          {/* Background Graphic Suggestion */}
          <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-[#34C759] opacity-[0.08] pointer-events-none">
            <PieChart size={160} strokeWidth={2} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#34C759] shadow-sm">
                <BarChart2 size={16} strokeWidth={2.5} />
              </span>
              <p className="text-[11px] font-extrabold text-[#0e793c] uppercase tracking-wider">Coach Insight</p>
            </div>
            <p className="text-[14px] font-bold text-[#1e293b] leading-snug mb-4">
              You have <span className="text-[#34C759]">{remainingCalories} calories</span> remaining today.
              <span className="block mt-1">Would you like {new Date().getHours() < 11 ? "breakfast" : new Date().getHours() < 16 ? "lunch" : "dinner"} suggestions?</span>
            </p>
            <button 
              onClick={() => handleSendText(`Suggest a healthy ${new Date().getHours() < 11 ? "breakfast" : new Date().getHours() < 16 ? "lunch" : "dinner"}`)}
              className="flex items-center gap-1.5 text-[13px] font-bold text-white bg-[#34C759] px-5 py-2.5 rounded-full hover:bg-[#2bb44a] transition-colors w-max"
            >
              Get Suggestions <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="space-y-4">
          {messages.length > 0 && (
            <div className="flex justify-center mb-6">
              <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Today {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
              {msg.sender === "liva" && <LivaAvatar size={32} />}
              <div className="flex flex-col gap-1 max-w-[76%]">
                <div
                  className="rounded-[22px] px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: msg.sender === "user" ? "linear-gradient(135deg, #34C759 0%, #25ad48 100%)" : "white",
                    color: msg.sender === "user" ? "white" : ink,
                    boxShadow: msg.sender === "user" ? "0 4px 12px rgba(52,199,89,0.15)" : "0 4px 12px rgba(16,32,26,0.04)",
                    borderRadius: msg.sender === "user" ? "22px 22px 4px 22px" : "22px 22px 22px 4px",
                    border: msg.sender === "liva" ? "1px solid rgba(52, 199, 89, 0.08)" : "none"
                  }}
                >
                  {msg.text}
                </div>
                <span className={`text-[9px] font-semibold text-slate-400 px-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-2.5 justify-start animate-pulse">
              <LivaAvatar size={32} />
              <div className="rounded-[22px] px-4.5 py-3.5 bg-white border border-[#34C759]/10 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34C759] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34C759] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34C759] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Persistent Input Section */}
      <div className="absolute bottom-20 left-0 right-0 z-20 pointer-events-none bg-gradient-to-t from-[#f8faf8] via-[#f8faf8] to-transparent pt-8">
        
        {/* Quick Suggestions with Scroll Arrows */}
        <div className="relative mb-4 pointer-events-auto px-6">
          {/* Left Arrow */}
          <button 
            onClick={() => scrollSuggestions('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#34C759]/20 shadow-md text-[#34C759] hover:bg-[#f2faf5] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div 
            ref={suggestionsScrollRef}
            className="overflow-x-auto no-scrollbar flex gap-3 scroll-smooth py-1 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {quickSuggestions.map((suggestion, idx) => {
              const Icon = suggestion.icon;
              const isMore = suggestion.label === "...";
              return (
                <button
                  key={idx}
                  onClick={suggestion.action}
                  className={`flex flex-col items-center justify-center flex-shrink-0 ${isMore ? 'w-[48px]' : 'w-[84px]'} h-[84px] rounded-[20px] bg-white border border-[#34C759]/15 shadow-sm hover:border-[#34C759]/40 transition-colors`}
                >
                  <Icon size={isMore ? 20 : 24} className="text-[#34C759]" strokeWidth={2} />
                  {!isMore && (
                    <span className="text-[10px] font-bold text-slate-600 text-center leading-tight px-1 mt-2">
                      {suggestion.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scrollSuggestions('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#34C759]/20 shadow-md text-[#34C759] hover:bg-[#f2faf5] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Input Bar */}
        <div className="px-6 pb-6 pointer-events-auto">
          <div 
            className="rounded-[24px] bg-white border border-[#34C759]/20 p-4"
            style={{ boxShadow: "0 8px 32px rgba(16,32,26,0.06)" }}
          >
            {/* Top Text Input Area */}
            <div className="flex items-center gap-2 mb-4 px-1">
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 font-medium"
                style={{ color: ink }}
                placeholder={isListening ? "Listening..." : "Ask Liva anything..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendText(inputText);
                }}
              />
              <button
                onClick={() => handleSendText(inputText)}
                disabled={!inputText.trim() && !isListening}
                className={`flex items-center justify-center transition-colors flex-shrink-0 ${isListening ? 'text-red-500 animate-pulse' : 'text-[#34C759] hover:text-[#25ad48] disabled:opacity-40'}`}
              >
                {isListening ? <Mic size={20} /> : <Send size={20} className="transform -rotate-45" />}
              </button>
            </div>

            {/* Bottom Actions Area */}
            <div className="flex items-center justify-between">
              {/* Voice Button */}
              <button 
                onClick={toggleVoiceInput}
                className="flex items-center gap-2.5 justify-center rounded-full bg-white py-1 transition-colors hover:bg-slate-50"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isListening ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse" : "bg-[#ecfbf1] text-[#34C759]"}`}>
                  <Mic size={15} />
                </div>
                <span className="text-[11px] font-bold text-slate-500 pr-2">Voice</span>
              </button>

              {/* Camera Button */}
              <button 
                onClick={() => onStartLog("camera")}
                className="flex items-center gap-2.5 justify-center rounded-full bg-white py-1 transition-colors hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-500">
                  <Camera size={15} />
                </div>
                <span className="text-[11px] font-bold text-slate-500 pr-2">Camera</span>
              </button>

              {/* Keyboard Button */}
              <button 
                onClick={() => document.querySelector('input')?.focus()}
                className="flex items-center gap-2.5 justify-center rounded-full bg-white py-1 transition-colors hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-500">
                  <Keyboard size={15} />
                </div>
                <span className="text-[11px] font-bold text-slate-500 pr-2">Keyboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="liva" onNavigate={onNavigate} />
    </div>
  );
}
