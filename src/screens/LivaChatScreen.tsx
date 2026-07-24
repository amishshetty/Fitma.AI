import { ArrowLeft, MicOff, Mic, Send, Flame, Egg, Leaf, Droplet, TrendingUp, Camera, Keyboard } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import IconButton from "../components/ui/IconButton";
import { ink } from "../constants";
import { Screen } from "../types";
import { ChatMessage } from "../types";
import { FoodRecommendationCard, NutritionSummaryCard } from "../components/chat/LivaResponseCards";
import { getDeviceId } from "../utils/deviceInfo";

export default function LivaChatScreen({ 
  onBack, 
  onNavigate, 
  userName,
  initialMessage,
  initialResponse,
  userProfile,
  onMealLogged,
  onWaterLogged,
  onMealDeleted,
  loggedMeals = []
}: { 
  onBack: () => void; 
  onNavigate: (screen: Screen) => void; 
  userName: string;
  userId?: string;
  initialMessage?: string;
  initialResponse?: any;
  userProfile?: {
    name: string;
    goal: string;
    diet: string;
    dailyCalories: number;
    motivationStyle: string;
    language: string;
  };
  onMealLogged?: (data: { calories: number; protein: number; items: string[]; mealType: string }) => void;
  onWaterLogged?: (data: { amountML: number }) => void;
  onMealDeleted?: (data: { mealType: string }) => void;
  loggedMeals?: any[];
}) {
  const chatStorageKey = `liva_chat_history_${userId || "guest"}`;
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(chatStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp && (Date.now() - parsed.timestamp < 6 * 60 * 60 * 1000)) {
          return parsed.messages || [];
        }
      }
    } catch (e) {
      console.error("Error loading chat history", e);
    }
    return [];
  });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Save to local storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(chatStorageKey, JSON.stringify({
        timestamp: Date.now(),
        messages
      }));
    }
  }, [messages, chatStorageKey]);

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const dynamicPrompts = useMemo(() => {
    return ["Log Lunch", "Suggest Dinner", "Today's Summary", "Log Water"];
  }, []);

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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      // Use API_URL if defined, otherwise fallback to relative path for Vite proxy
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          deviceId: getDeviceId(),
          profile: userProfile || {
            name: userName || "Amish",
            goal: "Weight Loss",
            diet: "Vegetarian",
            dailyCalories: 1800,
            motivationStyle: "Friendly",
            language: "English"
          },
          previousMessages: messages.slice(-2).map(m => ({ sender: m.sender, text: m.text })),
          loggedMeals: (loggedMeals || []).map(m => {
            let dateStr = "";
            try {
              dateStr = new Date(parseInt(m.id)).toDateString();
            } catch (e) {
              dateStr = "Unknown";
            }
            return { ...m, dateString: dateStr };
          }),
          localDateStr: new Date().toDateString()
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to contact Liva backend");
      }

      const data = await response.json();
      const livaReply = data.response || "I'm here for you! Try asking me something about nutrition or log a meal.";

      // If meal data was detected by Gemini, notify parent (safety check included)
      if (data.mealData && !data.deleteData && data.mealData.mealType && data.mealData.mealType.toLowerCase() !== "unknown") {
        if (onMealLogged) {
          onMealLogged(data.mealData);
        }
      }
      
      // If water data was detected by Gemini, notify parent
      if (data.waterData && onWaterLogged) {
        onWaterLogged(data.waterData);
      }
      
      // If delete data was detected, notify parent
      if (data.deleteData && onMealDeleted) {
        onMealDeleted(data.deleteData);
      }

      const summaryToRender = data.mealData || data.summaryData || null;

      setMessages((prev) => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(),
          sender: "liva", 
          text: livaReply,
          greeting: data.greeting,
          motivation: data.motivation,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          nutritionSummary: summaryToRender ? {
            calories: summaryToRender.calories || 0,
            protein: summaryToRender.protein || 0,
            carbs: summaryToRender.carbs || 0,
            fat: summaryToRender.fat || 0
          } : undefined,
          recommendationData: data.recommendationData && Array.isArray(data.recommendationData) ? data.recommendationData.map((rec: any) => ({
            meal: rec.meal || "",
            message_suffix: rec.message_suffix || "",
            calories: rec.calories || 0,
            protein: rec.protein || 0,
            carbs: rec.carbs || 0,
            fat: rec.fat || 0,
            why: rec.why || [],
            alternatives: rec.alternatives || [],
            tip: rec.tip || ""
          })) : undefined
        }
      ]);
    } catch (err: any) {
      console.error("Error communicating with Liva backend, using local fallback:", err);
      const fallbackReplies: Record<string, string> = {
        "i had two rotis and dal.": `Hey ${userName || "Amish"}! 2 rotis and a bowl of dal provide roughly 360 kcal. This is a very clean, balanced vegetarian meal! Keep up the good work!`,
        "suggest a healthy dinner.": `For dinner: A grilled paneer and vegetable stir-fry, or a warm bowl of mixed-lentil quinoa khichdi with cucumber raita. It's light, nutritious, and absolutely delicious!`,
        "how much protein should i eat?": `Based on your Weight Loss goal, aiming for 60-80g of protein daily is optimal. You can hit this with sources like paneer, lentils, chickpeas, Greek yogurt, and tofu.`,
        "motivate me today.": `Hey, it's totally okay to have low energy days! Take a deep breath, do a light stretch, and take it one moment at a time. You've got this!`,
      };
      
      const lower = textToSend.toLowerCase().trim();
      let reply = `Hey ${userName || "Amish"}! I logged that for you. Let's stay focused on your daily targets!`;
      
      if (fallbackReplies[lower]) {
        reply = fallbackReplies[lower];
      } else if (lower.includes("protein")) {
        reply = fallbackReplies["how much protein should i eat?"];
      } else if (lower.includes("dinner") || lower.includes("suggest") || lower.includes("lunch")) {
        reply = fallbackReplies["suggest a healthy dinner."];
      } else if (lower.includes("roti") || lower.includes("dal")) {
        reply = fallbackReplies["i had two rotis and dal."];
      } else if (lower.includes("motivate") || lower.includes("motivation")) {
        reply = fallbackReplies["motivate me today."];
      } else if (lower.includes("doctor") || lower.includes("pain") || lower.includes("medicine")) {
        reply = `I am your AI health companion, not a doctor. For specific medical concerns or conditions, please consult a qualified healthcare professional.`;
      }
      
      reply = `(Network Error: ${err.message}) ` + reply;

      setMessages((prev) => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(),
          sender: "liva", 
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Voice input via Web Speech API
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

    let recognition: any = null;
    try {
      recognition = new SpeechRecognition();
    } catch (e) {
      console.warn("SpeechRecognition not supported:", e);
      alert("Voice input is restricted by your browser. Please use a different browser like Safari.");
      return;
    }
    recognition.lang = userProfile?.language === "Hindi" ? "hi-IN" : userProfile?.language === "Marathi" ? "mr-IN" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = true; // Use continuous to prevent aggressive no-speech timeouts
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setInputText(transcript);
      
      const currentResult = event.results[event.resultIndex];
      if (currentResult && currentResult.isFinal) {
        recognition.stop(); // Explicitly stop if continuous is true
        setIsListening(false);
        handleSendText(transcript);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const processedInitialResponseRef = useRef<any>(null);

  useEffect(() => {
    if (initialMessage && initialResponse && processedInitialResponseRef.current !== initialResponse) {
      processedInitialResponseRef.current = initialResponse;
      // If we already have the AI response from the overlay, inject it directly instead of fetching
      const userMsg: ChatMessage = { 
        id: Date.now().toString(),
        sender: "user", 
        text: initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const summaryToRender = initialResponse.mealData || initialResponse.summaryData || null;
      const livaMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "liva", 
        text: initialResponse.response || "I'm here for you! Try asking me something about nutrition or log a meal.",
        greeting: initialResponse.greeting,
        motivation: initialResponse.motivation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        nutritionSummary: summaryToRender ? {
          calories: summaryToRender.calories || 0,
          protein: summaryToRender.protein || 0,
          carbs: summaryToRender.carbs || 0,
          fat: summaryToRender.fat || 0
        } : undefined,
        recommendationData: initialResponse.recommendationData && Array.isArray(initialResponse.recommendationData) ? initialResponse.recommendationData.map((rec: any) => ({
          meal: rec.meal || "",
          message_suffix: rec.message_suffix || "",
          calories: rec.calories || 0,
          protein: rec.protein || 0,
          carbs: rec.carbs || 0,
          fat: rec.fat || 0,
          why: rec.why || [],
          alternatives: rec.alternatives || [],
          tip: rec.tip || ""
        })) : undefined
      };
      
      setMessages(prev => [...prev, userMsg, livaMsg]);
    } else if (initialMessage && !initialResponse && messages.length === 0) {
      handleSendText(initialMessage);
    }
  }, [initialMessage, initialResponse]);

  return (
    <div className="flex min-h-0 flex-1 flex-col" style={{ background: "#f8faf8" }}>
      {/* Header (Mockup 1) */}
      <div className="flex items-center justify-between px-6 pt-11 pb-4 bg-white" style={{ borderBottom: "1px solid rgba(52,199,89,0.08)" }}>
        <div className="flex items-center gap-3">
          <IconButton onClick={onBack} label="Back">
            <ArrowLeft size={19} />
          </IconButton>
          <div>
            <h1 className="text-[17px] font-bold text-slate-800">{getGreetingTime()}, {userName || "Amish"}! 👋</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
              <p className="text-[11px] font-semibold text-slate-500">Liva Coach Mode is active</p>
            </div>
          </div>
        </div>
        <LivaAvatar size={38} floating />
      </div>

      {/* Chat Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        
        {/* Coach Insight (Mockup 1) - Always visible at top */}
        <div className="bg-white mx-5 mt-5 mb-5 rounded-[20px] p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f2faf5] flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} className="text-[#34C759]" />
          </div>
          <div className="flex-1">
            <h3 className="text-[11px] font-extrabold text-[#2a9d48] tracking-wider mb-1">COACH INSIGHT</h3>
            <p className="text-[14px] font-semibold text-slate-700 leading-snug pr-4">
              You have <span className="text-[#34C759] font-bold">480</span> calories remaining today. Would you like dinner suggestions?
            </p>
          </div>
        </div>

        <div className="space-y-5 px-5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
              
              {/* Liva Avatar only for Liva messages */}
              {msg.sender === "liva" && <LivaAvatar size={32} />}
              
              <div className={`flex flex-col gap-1 ${msg.sender === "user" ? "max-w-[76%] items-end" : "max-w-[85%] items-start"}`}>
                
                {msg.sender === "user" ? (
                  /* User Bubble (Mockup 1) */
                  <div className="rounded-[20px] rounded-br-sm px-4 py-3 bg-[#34C759] text-white shadow-sm text-[15px] leading-relaxed font-medium">
                    {msg.text}
                  </div>
                ) : (
                  /* Liva Bubble (Mockup 2) */
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] w-full">
                    {msg.greeting && (
                      <h3 className="text-[17px] font-bold text-slate-800 mb-2">
                        {msg.greeting}
                      </h3>
                    )}
                    
                    {msg.text && (
                      <p className="text-[15px] leading-relaxed text-slate-700 mb-3">
                        {msg.text}
                      </p>
                    )}
                    
                    {msg.motivation && (
                      <p className="text-[15px] leading-relaxed text-slate-700 font-medium">
                        {msg.motivation}
                      </p>
                    )}
                    
                    {msg.recommendationData && msg.recommendationData.map((rec, index) => (
                      <React.Fragment key={index}>
                        <FoodRecommendationCard 
                          meal={rec.meal}
                          message_suffix={rec.message_suffix}
                          calories={rec.calories}
                          protein={rec.protein}
                          carbs={rec.carbs}
                          fat={rec.fat}
                          why={rec.why}
                          alternatives={rec.alternatives}
                          tip={rec.tip}
                          onQuickAction={handleSendText}
                        />
                      </React.Fragment>
                    ))}

                    {msg.nutritionSummary && (
                      <NutritionSummaryCard 
                        calories={msg.nutritionSummary.calories}
                        protein={msg.nutritionSummary.protein}
                        carbs={msg.nutritionSummary.carbs}
                        fat={msg.nutritionSummary.fat}
                      />
                    )}
                  </div>
                )}
                
                <span className={`text-[9px] font-semibold text-slate-400 px-1 mt-1 flex items-center gap-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  {msg.timestamp} {msg.sender === "user" && <span className="text-[#34C759] text-[10px]">✓</span>}
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

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts (Mockup 1) */}
      <div className="px-5 pb-3 pt-2 flex gap-2 overflow-x-auto no-scrollbar">
        {dynamicPrompts.map((promptText) => (
          <button
            key={promptText}
            type="button"
            onClick={() => handleSendText(promptText)}
            className="whitespace-nowrap px-4 py-2.5 rounded-full bg-white border border-slate-200 text-[13px] font-bold text-slate-700 hover:border-[#34C759] hover:text-[#34C759] transition-colors shadow-sm cursor-pointer"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Chat Input Bar (Mockup 1) */}
      <div className="px-5 pb-8 pt-2 bg-white" style={{ borderTop: "1px solid rgba(52,199,89,0.06)" }}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 bg-[#f8faf8] rounded-full px-4 py-2.5 border border-slate-100">
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-slate-400"
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
              disabled={!inputText.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#34C759] disabled:opacity-30 hover:bg-[#34C759]/10 transition-colors cursor-pointer"
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="flex items-center gap-6 px-4">
            <button 
              onClick={toggleVoiceInput}
              className={`flex items-center justify-center transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-[#34C759]'}`}
            >
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            <button className="flex items-center justify-center text-slate-400 hover:text-[#34C759] transition-colors">
              <Camera size={22} />
            </button>
            <button className="flex items-center justify-center text-slate-400 hover:text-[#34C759] transition-colors">
              <Keyboard size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
