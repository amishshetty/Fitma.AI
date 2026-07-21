import { ArrowLeft, MicOff, Mic, Send, Flame, Egg, Leaf, Droplet } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import LivaAvatar from "../components/layout/LivaAvatar";
import IconButton from "../components/ui/IconButton";
import { ink } from "../constants";
import { Screen } from "../types";
import { ChatMessage } from "../types";

export default function LivaChatScreen({ 
  onBack, 
  onNavigate, 
  userName,
  initialMessage,
  userProfile,
  onMealLogged,
  onWaterLogged,
  onMealDeleted,
  loggedMeals = []
}: { 
  onBack: () => void; 
  onNavigate: (screen: Screen) => void; 
  userName: string;
  initialMessage?: string;
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const dynamicPrompts = useMemo(() => {
    const hour = new Date().getHours();
    let prompts = [];

    // 1. Time-based meal suggestion
    let nextMeal = "snack";
    let nextMealSuggest = "Suggest a healthy snack";
    if (hour >= 5 && hour < 11) {
      nextMeal = "breakfast";
      nextMealSuggest = "Suggest a healthy breakfast";
    } else if (hour >= 11 && hour < 15) {
      nextMeal = "lunch";
      nextMealSuggest = "Suggest a healthy lunch";
    } else if (hour >= 15 && hour < 19) {
      nextMeal = "snack";
      nextMealSuggest = "Suggest a healthy snack";
    } else {
      nextMeal = "dinner";
      nextMealSuggest = "Suggest a healthy dinner";
    }

    const today = new Date().setHours(0,0,0,0);
    const loggedToday = (loggedMeals || []).filter(m => parseInt(m.id) >= today);
    const hasLoggedNextMeal = loggedToday.some(m => m.mealType === nextMeal);

    if (hasLoggedNextMeal) {
      if (nextMeal === "breakfast") nextMealSuggest = "Suggest a healthy lunch";
      else if (nextMeal === "lunch") nextMealSuggest = "Suggest a healthy snack";
      else if (nextMeal === "snack") nextMealSuggest = "Suggest a healthy dinner";
      else nextMealSuggest = "Suggest a healthy late-night snack";
    }
    
    prompts.push(nextMealSuggest);
    prompts.push("Show me yesterday's summary");
    prompts.push("How am I doing on protein today?");
    prompts.push("Motivate me to stay on track today.");

    return prompts;
  }, [loggedMeals]);

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
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        signal: controller.signal,
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
          previousMessages: messages.map(m => ({ sender: m.sender, text: m.text })),
          loggedMeals: loggedMeals.map(m => {
            let dateStr = "";
            try {
              dateStr = new Date(parseInt(m.id)).toDateString();
            } catch (e) {
              dateStr = "Unknown";
            }
            return { ...m, dateString: dateStr };
          })
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to contact Liva backend");
      }

      const data = await response.json();
      const livaReply = data.response || "I'm here for you! Try asking me something about nutrition or log a meal.";

      // If meal data was detected by Gemini, notify parent
      if (data.mealData && onMealLogged) {
        onMealLogged(data.mealData);
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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          nutritionSummary: summaryToRender ? {
            calories: summaryToRender.calories || 0,
            protein: summaryToRender.protein || 0,
            carbs: summaryToRender.carbs || 0,
            fat: summaryToRender.fat || 0
          } : undefined,
          recommendationData: data.recommendationData ? {
            meal: data.recommendationData.meal || "",
            calories: data.recommendationData.calories || 0,
            protein: data.recommendationData.protein || 0,
            carbs: data.recommendationData.carbs || 0,
            fat: data.recommendationData.fat || 0,
            why: data.recommendationData.why || [],
            alternatives: data.recommendationData.alternatives || [],
            tip: data.recommendationData.tip || ""
          } : undefined
        }
      ]);
    } catch (err) {
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
      } else if (lower.includes("dinner") || lower.includes("suggest")) {
        reply = fallbackReplies["suggest a healthy dinner."];
      } else if (lower.includes("roti") || lower.includes("dal")) {
        reply = fallbackReplies["i had two rotis and dal."];
      } else if (lower.includes("motivate") || lower.includes("motivation")) {
        reply = fallbackReplies["motivate me today."];
      } else if (lower.includes("doctor") || lower.includes("pain") || lower.includes("medicine")) {
        reply = `I am your AI health companion, not a doctor. For specific medical concerns or conditions, please consult a qualified healthcare professional.`;
      }
      
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

    const recognition = new SpeechRecognition();
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

  useEffect(() => {
    if (initialMessage) {
      handleSendText(initialMessage);
    }
  }, [initialMessage]);

  return (
    <div className="flex min-h-0 flex-1 flex-col" style={{ background: "#f8faf8" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-11 pb-4 bg-white" style={{ borderBottom: "1px solid rgba(52,199,89,0.08)" }}>
        <IconButton onClick={onBack} label="Back">
          <ArrowLeft size={19} />
        </IconButton>
        <div className="flex items-center gap-2.5">
          <LivaAvatar size={38} floating />
          <div>
            <h1 className="text-md font-bold" style={{ color: ink }}>Liva</h1>
            <p className="text-[10px] font-semibold text-slate-400">Your AI Health Companion</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-6 text-center animate-fadeIn">
            <LivaAvatar size={74} floating />
            <h2 className="text-xl font-extrabold text-slate-800 mt-4">Hi {userName || "Amish"} 👋</h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">I'm Liva.</p>

            <div className="mt-6 w-full max-w-[280px] bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-left">
              <p className="text-xs font-bold text-slate-600 mb-2">I can help you:</p>
              <ul className="text-xs font-semibold text-slate-500 space-y-1.5 list-disc pl-4.5">
                <li>Log meals</li>
                <li>Answer nutrition questions</li>
                <li>Recommend healthy meals</li>
                <li>Track calories</li>
                <li>Motivate you</li>
                <li>Build healthier habits</li>
              </ul>
            </div>

            {/* Suggested Prompts */}
            <div className="mt-8 w-full max-w-[280px] text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Suggested Prompts</p>
              <div className="flex flex-col gap-2">
                {dynamicPrompts.map((promptText) => (
                  <button
                    key={promptText}
                    type="button"
                    onClick={() => handleSendText(promptText)}
                    className="w-full text-left rounded-xl bg-white border border-slate-100 hover:border-[#34c759]/40 hover:bg-[#f2faf5] px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all cursor-pointer"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE CONVERSATION */
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
                {msg.sender === "liva" && <LivaAvatar size={32} />}
                <div className="flex flex-col gap-1 max-w-[76%]">
                  <div
                    className="rounded-[22px] px-4 py-3 text-sm leading-relaxed"
                    style={{
                      background: msg.sender === "user" ? "linear-gradient(135deg, #34C759 0%, #25ad48 100%)" : "white",
                      color: msg.sender === "user" ? "white" : ink,
                      boxShadow: msg.sender === "user" ? "0 4px 12px rgba(52,199,89,0.15)" : "0 4px 12px rgba(16,32,26,0.03)",
                      borderRadius: msg.sender === "user" ? "22px 22px 4px 22px" : "22px 22px 22px 4px",
                      border: msg.sender === "liva" ? "1px solid rgba(52, 199, 89, 0.08)" : "none"
                    }}
                  >
                    {msg.text}
                  </div>
                  {msg.nutritionSummary && (
                    <div className="mt-2 bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] animate-fadeIn w-[280px]">
                      <div className="flex justify-between items-center text-center">
                        {/* Calories */}
                        <div className="flex-1 border-r border-slate-100 px-1">
                          <div className="flex justify-center mb-2">
                            <div className="w-8 h-8 rounded-full border border-[#34c759] flex items-center justify-center text-[#34c759]">
                              <Flame size={16} strokeWidth={2.5} />
                            </div>
                          </div>
                          <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Calories</p>
                          <p className="text-xs font-extrabold text-slate-800">{msg.nutritionSummary.calories} <span className="text-[10px] font-semibold text-slate-400">kcal</span></p>
                        </div>
                        {/* Protein */}
                        <div className="flex-1 border-r border-slate-100 px-1">
                          <div className="flex justify-center mb-2">
                            <div className="w-8 h-8 rounded-full border border-[#34c759] flex items-center justify-center text-[#34c759]">
                              <Egg size={16} strokeWidth={2.5} />
                            </div>
                          </div>
                          <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Protein</p>
                          <p className="text-xs font-extrabold text-slate-800">{msg.nutritionSummary.protein} <span className="text-[10px] font-semibold text-slate-400">g</span></p>
                        </div>
                        {/* Carbs */}
                        <div className="flex-1 border-r border-slate-100 px-1">
                          <div className="flex justify-center mb-2">
                            <div className="w-8 h-8 rounded-full border border-[#34c759] flex items-center justify-center text-[#34c759]">
                              <Leaf size={16} strokeWidth={2.5} />
                            </div>
                          </div>
                          <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Carbs</p>
                          <p className="text-xs font-extrabold text-slate-800">{msg.nutritionSummary.carbs} <span className="text-[10px] font-semibold text-slate-400">g</span></p>
                        </div>
                        {/* Fat */}
                        <div className="flex-1 px-1">
                          <div className="flex justify-center mb-2">
                            <div className="w-8 h-8 rounded-full border border-[#34c759] flex items-center justify-center text-[#34c759]">
                              <Droplet size={16} strokeWidth={2.5} />
                            </div>
                          </div>
                          <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Fat</p>
                          <p className="text-xs font-extrabold text-slate-800">{msg.nutritionSummary.fat} <span className="text-[10px] font-semibold text-slate-400">g</span></p>
                        </div>
                      </div>
                    </div>
                  )}
                  {msg.recommendationData && (
                    <div className="mt-2 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] animate-fadeIn overflow-hidden w-[280px]">
                      {/* Header */}
                      <div className="bg-[#f2faf5] px-4 py-3 border-b border-slate-100">
                        <p className="text-[10px] font-bold text-[#34c759] uppercase tracking-wider mb-1">Recommended Meal</p>
                        <h3 className="text-sm font-extrabold text-slate-800 whitespace-pre-wrap">{msg.recommendationData.meal}</h3>
                      </div>
                      
                      {/* Macros */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex justify-between items-center text-center">
                          <div className="flex-1 border-r border-slate-100 px-1">
                            <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Calories</p>
                            <p className="text-xs font-extrabold text-slate-800">{msg.recommendationData.calories}</p>
                          </div>
                          <div className="flex-1 border-r border-slate-100 px-1">
                            <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Protein</p>
                            <p className="text-xs font-extrabold text-slate-800">{msg.recommendationData.protein}g</p>
                          </div>
                          <div className="flex-1 border-r border-slate-100 px-1">
                            <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Carbs</p>
                            <p className="text-xs font-extrabold text-slate-800">{msg.recommendationData.carbs}g</p>
                          </div>
                          <div className="flex-1 px-1">
                            <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Fat</p>
                            <p className="text-xs font-extrabold text-slate-800">{msg.recommendationData.fat}g</p>
                          </div>
                        </div>
                      </div>

                      {/* Why this? */}
                      {msg.recommendationData.why && msg.recommendationData.why.length > 0 && (
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-[10px] font-bold text-slate-500 mb-2">Why this?</p>
                          <ul className="space-y-1.5">
                            {msg.recommendationData.why.map((reason, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-slate-600">
                                <span className="text-[#34c759] mt-0.5">✓</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Alternatives */}
                      {msg.recommendationData.alternatives && msg.recommendationData.alternatives.length > 0 && (
                        <div className="px-4 py-3 border-b border-slate-100 bg-[#fafafa]">
                          <p className="text-[10px] font-bold text-slate-500 mb-2">Alternatives</p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.recommendationData.alternatives.map((alt, i) => (
                              <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600">
                                {alt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tip */}
                      {msg.recommendationData.tip && (
                        <div className="px-4 py-3 bg-[#e8f5e9]/50">
                          <p className="text-[10px] font-bold text-[#2e7d32] mb-1">AI Tip</p>
                          <p className="text-xs font-medium text-slate-700 leading-relaxed">{msg.recommendationData.tip}</p>
                        </div>
                      )}
                    </div>
                  )}
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

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <div className="px-6 pb-8 pt-2 bg-white" style={{ borderTop: "1px solid rgba(52,199,89,0.06)" }}>
        <div className="flex items-center gap-2 bg-[#f2faf5] rounded-[24px] px-3.5 py-2">
          {/* Microphone Button - Real Voice Input */}
          <button
            onClick={toggleVoiceInput}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all cursor-pointer ${
              isListening
                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
                : "text-[#34C759] hover:bg-[#34C759]/10"
            }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none px-2"
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
            className="flex h-9 w-9 items-center justify-center rounded-full text-white bg-[#34C759] disabled:opacity-50 hover:bg-[#25ad48] transition-colors cursor-pointer"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
