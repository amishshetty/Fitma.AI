import { useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import mealRecommendationImg from "@/assets/meal_recommendation.jpg";
import recipeHeroImg from "@/assets/recipe_hero.jpg";
import {
  Activity,
  Apple,
  ArrowLeft,
  Award,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Droplets,
  Egg,
  Flame,
  Flashlight,
  Home,
  Image,
  Keyboard,
  Leaf,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  Minus,
  Plus,
  Search,
  Send,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  User,
  Utensils,
  Wheat,
  Zap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  Key,
  Globe,
  Sunrise,
  Sun,
  Moon,
  Coffee,
  X
} from "lucide-react";

import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signInWithPopup
} from "firebase/auth";
import {
  ref,
  get,
  set,
  update
} from "firebase/database";
import FloatingLiva from "../components/layout/FloatingLiva";
import LivaSiriOverlay from "../components/layout/LivaSiriOverlay";
import PhoneFrame from "../components/layout/PhoneFrame";
import TextLoggingDrawer from "../components/TextLoggingDrawer";
import AIProcessingScreen from "../screens/AIProcessingScreen";
import CameraAIProcessingScreen from "../screens/CameraAIProcessingScreen";
import CameraLoggingScreen from "../screens/CameraLoggingScreen";
import CameraMealSelectionScreen from "../screens/CameraMealSelectionScreen";
import GoalsScreen from "../screens/GoalsScreen";
import HomeScreen from "../screens/HomeScreen";
import LivaChatScreen from "../screens/LivaChatScreen";
import LivaHomeScreen from "../screens/LivaHomeScreen";
import LivaRecipeDetailScreen from "../screens/LivaRecipeDetailScreen";
import LivaRecipeSwiperScreen from "../screens/LivaRecipeSwiperScreen";
import LivaRecommendationsScreen from "../screens/LivaRecommendationsScreen";
import LivaResponseScreen from "../screens/LivaResponseScreen";
import LivaThinkingScreen from "../screens/LivaThinkingScreen";
import LivaVoiceScreen from "../screens/LivaVoiceScreen";
import LivaWaterScreen from "../screens/LivaWaterScreen";
import LivaWeeklyCoachScreen from "../screens/LivaWeeklyCoachScreen";
import LoginScreen from "../screens/LoginScreen";
import MealConfirmationScreen from "../screens/MealConfirmationScreen";
import MealSuccessScreen from "../screens/MealSuccessScreen";
import MeetLivaScreen from "../screens/MeetLivaScreen";
import MyPlanScreen from "../screens/MyPlanScreen";
import NutritionBreakdownScreen from "../screens/NutritionBreakdownScreen";
import OnboardingSuccessScreen from "../screens/OnboardingSuccessScreen";
import PermissionsScreen from "../screens/PermissionsScreen";
import PortionSelectionScreen from "../screens/PortionSelectionScreen";
import ProfileDevicesScreen from "../screens/ProfileDevicesScreen";
import ProfileGoalsScreen from "../screens/ProfileGoalsScreen";
import ProfileHealthScreen from "../screens/ProfileHealthScreen";
import ProfileHelpScreen from "../screens/ProfileHelpScreen";
import ProfileHomeScreen from "../screens/ProfileHomeScreen";
import ProfileLivaScreen from "../screens/ProfileLivaScreen";
import ProfilePersonalScreen from "../screens/ProfilePersonalScreen";
import ProfilePremiumScreen from "../screens/ProfilePremiumScreen";
import ProfilePrivacyScreen from "../screens/ProfilePrivacyScreen";
import ProfileSettingsScreen from "../screens/ProfileSettingsScreen";
import ProgressAchievementsScreen from "../screens/ProgressAchievementsScreen";
import ProgressDashboardScreen from "../screens/ProgressDashboardScreen";
import ProgressGoalsScreen from "../screens/ProgressGoalsScreen";
import ProgressHabitsScreen from "../screens/ProgressHabitsScreen";
import ProgressInsightsScreen from "../screens/ProgressInsightsScreen";
import ProgressMonthlyScreen from "../screens/ProgressMonthlyScreen";
import ProgressNutritionScreen from "../screens/ProgressNutritionScreen";
import ProgressWeeklyScreen from "../screens/ProgressWeeklyScreen";
import ProgressWeightScreen from "../screens/ProgressWeightScreen";
import QuickLogScreen from "../screens/QuickLogScreen";
import ReminderCelebrationScreen from "../screens/ReminderCelebrationScreen";
import ReminderCenterScreen from "../screens/ReminderCenterScreen";
import ReminderHydrationScreen from "../screens/ReminderHydrationScreen";
import ReminderMealFlowScreen from "../screens/ReminderMealFlowScreen";
import ReminderPreferencesScreen from "../screens/ReminderPreferencesScreen";
import ReminderPreviewScreen from "../screens/ReminderPreviewScreen";
import ReminderSettingsScreen from "../screens/ReminderSettingsScreen";
import ReminderWeeklySummaryScreen from "../screens/ReminderWeeklySummaryScreen";
import SaveMealScreen from "../screens/SaveMealScreen";
import SearchFoodScreen from "../screens/SearchFoodScreen";
import SplashScreen from "../screens/SplashScreen";
import TextLoggingScreen from "../screens/TextLoggingScreen";
import VoiceLoggingScreen from "../screens/VoiceLoggingScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { ink, green, muted, softGreen, mealItems, rotatingFacts, screenVariants } from "../constants";
import { Screen, EntryMode } from "../types";
import { screens } from "../constants";
import { GoalConfig, MemoryItem, LoggedMeal } from "../types";

// ==========================================
// PROGRESS & INSIGHTS MODULE SCREENS
// ==========================================
// ==========================================
// NOTIFICATIONS & SMART REMINDERS SCREENS
// ==========================================
// ==========================================
// PROFILE & SETTINGS MODULE SCREENS
// ==========================================

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [entryMode, setEntryMode] = useState<EntryMode>("voice");
  const [chatInitialMsg, setChatInitialMsg] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [livaFlowActive, setLivaFlowActive] = useState(false);
  const [isTextDrawerOpen, setIsTextDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingMealData, setPendingMealData] = useState<any>(null);
  const [capturedImageBase64, setCapturedImageBase64] = useState<string | null>(null);
  const [processingTargetMeal, setProcessingTargetMeal] = useState<string>("unknown");
  // SIRI OVERLAY STATE
  const [livaSiriActive, setLivaSiriActive] = useState(false);
  const [siriText, setSiriText] = useState("Listening...");
  const [showHeyLivaTip, setShowHeyLivaTip] = useState(false);
  const wakeWordRecRef = useRef<any>(null);
  const activeSiriRecRef = useRef<any>(null);

  const showFloatingLiva =
    screen === "home" ||
    screen === "quick-log" ||
    screen === "progress-dashboard" ||
    screen === "profile-home";

  useEffect(() => {
    if (!showFloatingLiva) {
      setShowHeyLivaTip(false);
      return;
    }

    // Trigger initial guide tooltip after 3 seconds
    const initialTimeout = setTimeout(() => {
      setShowHeyLivaTip(true);
      setTimeout(() => {
        setShowHeyLivaTip(false);
      }, 4000);
    }, 3000);

    // Set recurring 20 seconds interval
    const interval = setInterval(() => {
      setShowHeyLivaTip(true);
      setTimeout(() => {
        setShowHeyLivaTip(false);
      }, 4000);
    }, 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [showFloatingLiva]);

  // AUTH PERSISTENCE STATES
  const [dbError, setDbError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("fitma_token"));
  const [loginInitialView, setLoginInitialView] = useState<"signin" | "signup" | "forgot" | "reset" | "verify" | "profile-complete">("signin");
  const [loginInitialResetToken, setLoginInitialResetToken] = useState("");
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(30);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userActivity, setUserActivity] = useState<"sedentary" | "light" | "moderate" | "athlete">("light");
  const [userPreferences, setUserPreferences] = useState({ veg: false, egg: false, nonveg: false, vegan: false, jain: false });
  const [userAllergies, setUserAllergies] = useState({ peanuts: false, gluten: false, dairy: false, shellfish: false });
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [userPhone, setUserPhone] = useState("");
  const [userGender, setUserGender] = useState("Male");
  const [userHeight, setUserHeight] = useState("178 cm");
  const [userUnits, setUserUnits] = useState("Metric (kg, cm)");
  const [primaryGoal, setPrimaryGoal] = useState<string>("Weight Loss");
  const [language, setLanguage] = useState<string>("English");
  const [motivationStyle, setMotivationStyle] = useState<string>("Friendly");

  const getDietString = () => {
    if (userPreferences.vegan) return "Vegan";
    if (userPreferences.jain) return "Jain";
    if (userPreferences.veg) return "Vegetarian";
    if (userPreferences.egg) return "Eggitarian";
    if (userPreferences.nonveg) return "Non-Vegetarian";
    return "Vegetarian";
  };

  // NEW PROGRESS & REMINDERS STATE
  const [userWeight, setUserWeight] = useState(70.0);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [history, setHistory] = useState<Record<string, any>>({});
  
  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const todayData = history[todayStr] || {};
  
  const todayStart = new Date().setHours(0,0,0,0);
  const todayEnd = new Date().setHours(23,59,59,999);
  const todaysLoggedMeals = loggedMeals.filter(m => {
    const time = parseInt(m.id);
    return time >= todayStart && time <= todayEnd;
  });
  
  const proteinLogged = todaysLoggedMeals.reduce((acc, curr) => acc + (curr.protein || 0), 0);
  const caloriesLogged = todaysLoggedMeals.reduce((acc, curr) => acc + (curr.calories || 0), 0);
  
  const waterLogged = todayData.water || 0;
  
  const completedHabits = todayData.completedHabits || {
    breakfast: false,
    water: false,
    protein: false,
    exercise: false,
    sleep: false,
  };
  const [goals, setGoals] = useState<GoalConfig>({
    weight: 70.0,
    calories: 2000,
    protein: 100,
    water: 2500,
  });

  // Synchronization helper to update DB in real-time
  const syncProfile = async (updates: Partial<any>) => {
    const activeToken = token || localStorage.getItem("fitma_token");
    if (!activeToken) return;

    // Always update localStorage fallback for instant offline recovery/previews
    const localKey = `fitma_fallback_user_${activeToken}`;
    try {
      const existing = JSON.parse(localStorage.getItem(localKey) || "{}");
      const updated = { ...existing, ...updates };
      localStorage.setItem(localKey, JSON.stringify(updated));
    } catch (e) {
      console.warn("Local storage sync warning:", e);
    }

    // Write to Firebase Realtime Database
    try {
      await update(ref(db, `users/${activeToken}`), updates);
      setDbError(null);
    } catch (err: any) {
      console.error("Failed to sync profile updates to Firebase Realtime Database:", err);
      if (err.message && err.message.toLowerCase().includes("permission denied")) {
        setDbError("Firebase Permission Denied: Please set Realtime Database rules to '.read': true, '.write': true in your Firebase console.");
      } else {
        setDbError(`Firebase Sync Alert: ${err.message || "Connection issue"}`);
      }
    }
  };

  const syncDailyData = (dateStr: string, updater: any) => {
    setHistory((prev) => {
      const current = prev[dateStr] || {};
      const nextUpdates = typeof updater === 'function' ? updater(current) : updater;
      const nextDay = { ...current, ...nextUpdates };
      const nextHistory = { ...prev, [dateStr]: nextDay };
      
      // Delay syncing slightly to allow batching
      setTimeout(() => syncProfile({ history: nextHistory }), 0);
      
      return nextHistory;
    });
  };

  const setWaterLogged = (updater: any) => {
    syncDailyData(todayStr, (curr: any) => ({
      water: typeof updater === 'function' ? updater(curr.water || 0) : updater
    }));
  };

  const setCaloriesLogged = (updater: any) => {
    syncDailyData(todayStr, (curr: any) => ({
      calories: typeof updater === 'function' ? updater(curr.calories || 0) : updater
    }));
  };

  const setProteinLogged = (updater: any) => {
    syncDailyData(todayStr, (curr: any) => ({
      protein: typeof updater === 'function' ? updater(curr.protein || 0) : updater
    }));
  };

  const setCompletedHabits = (updater: any) => {
    syncDailyData(todayStr, (curr: any) => ({
      completedHabits: typeof updater === 'function' ? updater(curr.completedHabits || { breakfast: false, water: false, protein: false, exercise: false, sleep: false }) : updater
    }));
  };

  const logLivaMeal = (mealData: any) => {
    if (!mealData) return;

    if (mealData.mealType && mealData.mealType.toLowerCase() === "unknown") {
      setPendingMealData(mealData);
      return;
    }

    const addedCal = Number(mealData.calories) || 0;
    const addedProt = Number(mealData.protein) || 0;
    const mealType = (mealData.mealType || "snack").toLowerCase();
    const items = mealData.items || ["meal"];

    const isYesterday = mealData.date === "yesterday";
    const mealDate = new Date();
    if (isYesterday) {
      mealDate.setDate(mealDate.getDate() - 1);
    }
    const mealDateStr = mealDate.toDateString();
    const newId = isYesterday ? (Date.now() - 86400000).toString() : Date.now().toString();

    const newMeal: LoggedMeal = {
      id: newId,
      name: items.join(", "),
      calories: addedCal,
      protein: addedProt,
      timestamp: mealDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mealType: mealType
    };

    setLoggedMeals((prevMeals) => {
      const targetStart = new Date(mealDate).setHours(0,0,0,0);
      const targetEnd = new Date(mealDate).setHours(23,59,59,999);
      
      const existingMealIndex = prevMeals.findIndex(m => {
        const time = parseInt(m.id);
        return time >= targetStart && time <= targetEnd && m.mealType === mealType;
      });

      let updatedMeals = [...prevMeals];
      let calAdjustment = addedCal;
      let protAdjustment = addedProt;

      if (existingMealIndex !== -1 && mealType !== "snack") {
        const oldMeal = updatedMeals[existingMealIndex];
        calAdjustment -= oldMeal.calories;
        protAdjustment -= oldMeal.protein;
        updatedMeals.splice(existingMealIndex, 1);
      }

      updatedMeals.push(newMeal);

      syncDailyData(mealDateStr, (curr: any) => {
        const nextHabits = { ...(curr.completedHabits || {}) };
        if (mealType === "breakfast") {
          nextHabits.breakfast = true;
        }
        return {
          calories: Math.max(0, (curr.calories || 0) + calAdjustment),
          protein: Math.max(0, (curr.protein || 0) + protAdjustment),
          completedHabits: nextHabits
        };
      });

      syncProfile({ meals: updatedMeals });
      return updatedMeals;
    });
  };

  const deleteLivaMeal = (mealId: string) => {
    setLoggedMeals((prevMeals) => {
      const mealToDelete = prevMeals.find(m => m.id === mealId);
      if (!mealToDelete) return prevMeals;

      const updatedMeals = prevMeals.filter(m => m.id !== mealId);
      
      const dateStr = new Date(parseInt(mealId) - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
      syncDailyData(dateStr, (curr: any) => ({
        calories: Math.max(0, (curr.calories || 0) - mealToDelete.calories),
        protein: Math.max(0, (curr.protein || 0) - mealToDelete.protein)
      }));

      syncProfile({ meals: updatedMeals });
      return updatedMeals;
    });
  };

  const deleteLivaMealByType = (rawMealType: string) => {
    const mealType = (rawMealType || "").toLowerCase();
    setLoggedMeals((prevMeals) => {
      const targetStart = new Date().setHours(0,0,0,0);
      const targetEnd = new Date().setHours(23,59,59,999);
      
      const mealsToday = prevMeals.filter(m => {
        const time = parseInt(m.id);
        return time >= targetStart && time <= targetEnd && m.mealType === mealType;
      });

      if (mealsToday.length === 0) return prevMeals;
      
      const mealToDelete = mealsToday[mealsToday.length - 1];
      const updatedMeals = prevMeals.filter(m => m.id !== mealToDelete.id);
      
      const dateStr = new Date(parseInt(mealToDelete.id) - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
      syncDailyData(dateStr, (curr: any) => ({
        calories: Math.max(0, (curr.calories || 0) - mealToDelete.calories),
        protein: Math.max(0, (curr.protein || 0) - mealToDelete.protein)
      }));

      syncProfile({ meals: updatedMeals });
      return updatedMeals;
    });
  };

  const logLivaWater = (waterData: any) => {
    if (!waterData) return;

    const amountML = Number(waterData.amountML) || Number(waterData.amount) || Number(waterData.ml) || 0;
    if (amountML <= 0) return;

    syncDailyData(todayStr, (curr: any) => {
       const nextWater = (curr.water || 0) + amountML;
       const nextHabits = { ...(curr.completedHabits || {}) };
       if (nextWater >= (goals.water || 2500)) {
         nextHabits.water = true;
       }
       return {
         water: nextWater,
         completedHabits: nextHabits
       };
    });
  };

  // Check session token and load profile on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const href = window.location.href;

    if (tokenParam) {
      if (href.includes("verify-email")) {
        alert("Please confirm verification in the email link sent by Firebase Auth.");
        window.history.replaceState({}, document.title, window.location.origin);
        setLoginInitialView("signin");
        go("login");
        return;
      } else if (href.includes("reset-password")) {
        setLoginInitialView("reset");
        setLoginInitialResetToken(tokenParam);
        window.history.replaceState({}, document.title, window.location.origin);
        go("login");
        return;
      }
    }

    const activeToken = localStorage.getItem("fitma_token");
    if (activeToken) {
      const loadProfile = async () => {
        try {
          const userSnapshot = await get(ref(db, `users/${activeToken}`));
          if (userSnapshot.exists()) {
            const u = userSnapshot.val();
            setUserName(u.name || u.username || "User");
            setUserEmail(u.email || "");
            setUserWeight(u.weight || 70.0);
            
            const loadedHistory = u.history || {};
            setHistory(loadedHistory);
            setGoals(u.goals || { weight: 65.0, calories: 2000, protein: 100, water: 2500 });
            setUserActivity(u.activity || "light");
            setUserPreferences(u.preferences || { veg: false, egg: false, nonveg: false, vegan: false, jain: false });
            setUserAllergies(u.allergies || { peanuts: false, gluten: false, dairy: false, shellfish: false });
            setMemories(u.memories || []);
            setUserPhone(u.phone || "");
            setUserGender(u.gender || "Male");
            setUserHeight(u.height || "178 cm");
            setUserUnits(u.units || "Metric (kg, cm)");
            setPrimaryGoal(u.primaryGoal || "Weight Loss");
            setLanguage(u.language || "English");
            setMotivationStyle(u.motivationStyle || "Friendly");
            setLoggedMeals(u.meals || []);
            setScreen("home");
          } else {
            throw new Error("No profile document found in Realtime Database.");
          }
        } catch (err) {
          console.error("Auto login failed:", err);
          localStorage.removeItem("fitma_token");
          setToken(null);
          setScreen("splash");
        }
      };
      loadProfile();
      
      // Ping the Render backend to wake it up in the background!
      const API_URL = import.meta.env.VITE_API_URL || 'https://fitma-ai.onrender.com';
      fetch(`${API_URL}/api/health`).catch(() => {});
    }
  }, []);

  // Wake word activation "Hey Liva"
  useEffect(() => {
    if (!showFloatingLiva || livaSiriActive) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const wakeWordRecognition = new SpeechRecognition();
    wakeWordRecognition.lang = "en-US";
    wakeWordRecognition.continuous = true;
    wakeWordRecognition.interimResults = true;
    wakeWordRecRef.current = wakeWordRecognition;

    wakeWordRecognition.onresult = (event: any) => {
      if (livaSiriActive) return;

      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript + " ";
      }
      
      const transcript = finalTranscript.toLowerCase().trim();

      // Much more lenient match for any combination of hey/hi and a variant of Liva
      // Or just mentioning liva/olivia/leeva independently
      const isWakeWord = /(hey|hay|hi|hello|ok|okay|wake up|start|listen)\s*(liva|liver|leva|leave a|live a|olivia|liba|leeva|aliva|riva|ziva)/i.test(transcript);
      
      const isJustLiva = /(liva|leeva|aliva|liba)/i.test(transcript);

      if (isWakeWord || isJustLiva) {
        wakeWordRecognition.onend = null; // Prevent auto-restart loop
        wakeWordRecognition.stop();
        setTimeout(() => {
          triggerSiri();
        }, 300);
      }
    };

    wakeWordRecognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        wakeWordRecognition.onend = null; // kill it if permissions are fully denied
      }
    };

    wakeWordRecognition.onend = () => {
      if (showFloatingLiva && !livaSiriActive) {
        setTimeout(() => {
          try {
            wakeWordRecognition.start();
          } catch (e) {}
        }, 250); // Small delay prevents mobile browser throttle
      }
    };

    // try {
    //   wakeWordRecognition.start();
    // } catch (e) {}

    return () => {
      wakeWordRecognition.onend = null;
      wakeWordRecognition.stop();
    };
  }, [showFloatingLiva, livaSiriActive]);

  const triggerSiri = async () => {
    if (livaSiriActive) return; // Prevent double trigger if already active

    // Manually release wake word recognizer if active
    if (wakeWordRecRef.current) {
      try {
        wakeWordRecRef.current.onend = null;
        wakeWordRecRef.current.abort(); // Force abort immediately
      } catch (e) {}
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setChatInitialMsg("");
      go("liva-chat");
      return;
    }

    // Workaround: Explicitly request microphone permission first to fix access denied issues in Chrome/Mobile
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Microphone access denied. Please enable microphone permissions in your browser.");
      return;
    }

    setSiriText("Listening...");
    setLivaSiriActive(true);

    const recognition = new SpeechRecognition();
    activeSiriRecRef.current = recognition; // Register as the current active instance
    recognition.lang = language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = true; // Use continuous to prevent aggressive no-speech timeouts

    let finalTranscript = "";
    let hasError = false;
    let isProcessing = false;

    const finishListening = async () => {
      if (activeSiriRecRef.current !== recognition) return;
      if (isProcessing || hasError) return;
      isProcessing = true;
      
      try {
        recognition.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      
      setSiriText("Thinking...");
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const API_URL = import.meta.env.VITE_API_URL || 'https://fitma-ai.onrender.com';
        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: finalTranscript,
            profile: {
              name: userName || "Amish",
              goal: primaryGoal,
              diet: getDietString(),
              dailyCalories: goals.calories || 1800,
              motivationStyle: motivationStyle,
              language: language
            },
            previousMessages: []
          }),
        });

        clearTimeout(timeoutId);
        
        if (activeSiriRecRef.current !== recognition) return; // double check after fetch

        const data = await response.json();
        setSiriText(data.response);

        if (data.mealData && !data.deleteData) {
          if (data.mealData.mealType && data.mealData.mealType.toLowerCase() === "unknown") {
            setPendingMealData(data.mealData);
          } else {
            logLivaMeal(data.mealData);
            const loggedType = data.mealData.mealType || "snack";
            const capitalizedType = loggedType.charAt(0).toUpperCase() + loggedType.slice(1);
            setToastMessage(`Meal saved in ${capitalizedType}!`);
            setTimeout(() => setToastMessage(null), 3000);
          }
        }

        if (data.waterData) {
          logLivaWater(data.waterData);
        }

        if (data.deleteData && data.deleteData.mealType) {
          deleteLivaMealByType(data.deleteData.mealType);
        }

        // Only auto-close if we are not asking for meal confirmation
        if (!data.mealData || data.deleteData) {
          setTimeout(() => {
            if (activeSiriRecRef.current === recognition) {
              setLivaSiriActive(false);
            }
          }, 3500);
        }
      } catch {
        if (activeSiriRecRef.current !== recognition) return;
        setSiriText("Couldn't reach Liva right now. Try again later!");
        setTimeout(() => {
          if (activeSiriRecRef.current === recognition) {
            setLivaSiriActive(false);
          }
        }, 3000);
      }
    };

    recognition.onresult = (event: any) => {
      if (activeSiriRecRef.current !== recognition) return;
      if (isProcessing) return;
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      
      setSiriText(transcript || "Listening...");
      finalTranscript = transcript;
      
      const currentResult = event.results[event.resultIndex];
      if (currentResult && currentResult.isFinal) {
        finishListening();
      }
    };

    recognition.onerror = (event: any) => {
      if (activeSiriRecRef.current !== recognition) return;
      
      if (event.error === 'aborted') {
        if (!isProcessing) {
          setLivaSiriActive(false);
        }
        return;
      }

      hasError = true;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setSiriText("Microphone access denied.");
      } else if (event.error === 'no-speech') {
        setSiriText("I didn't catch that. Tap me again.");
      } else {
        setSiriText(`Microphone error: ${event.error}`);
      }
      setTimeout(() => {
        if (activeSiriRecRef.current === recognition) {
          setLivaSiriActive(false);
        }
      }, 2500);
    };

    recognition.onend = () => {
      if (activeSiriRecRef.current !== recognition) return;
      if (!isProcessing && !hasError) {
        if (finalTranscript.trim()) {
          finishListening();
        } else {
          setLivaSiriActive(false);
        }
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn("Siri mic start issue:", e);
    }
  };

  const handleAuthSuccess = (newToken: string, user: any, isNew: boolean) => {
    localStorage.setItem("fitma_token", newToken);
    setToken(newToken);
    setUserName(user.name || user.username || "User");
    setUserEmail(user.email);
    setUserWeight(user.weight || 70.0);
    
    const loadedHistory = user.history || {};
    setHistory(loadedHistory);
    setGoals(user.goals || { weight: 70.0, calories: 2000, protein: 100, water: 2500 });
    setUserActivity(user.activity || "light");
    setUserPreferences(user.preferences || { veg: false, egg: false, nonveg: false, vegan: false, jain: false });
    setUserAllergies(user.allergies || { peanuts: false, gluten: false, dairy: false, shellfish: false });
    setMemories(user.memories || []);
    setUserPhone(user.phone || "");
    setUserGender(user.gender || "Male");
    setUserHeight(user.height || "178 cm");
    setUserUnits(user.units || "Metric (kg, cm)");
    setPrimaryGoal(user.primaryGoal || "Weight Loss");
    setLanguage(user.language || "English");
    setMotivationStyle(user.motivationStyle || "Friendly");
    setLoggedMeals(user.meals || []);
    setProteinLogged(user.protein || 0);

    if (isNew) {
      go("meet-liva");
    } else {
      go("home");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fitma_token");
    setToken(null);
    setUserName("");
    setUserEmail("");
    setUserWeight(70.0);
    setHistory({});
    setGoals({
      weight: 70.0,
      calories: 2000,
      protein: 100,
      water: 2500,
    });
    setUserActivity("light");
    setUserPreferences({ veg: false, egg: false, nonveg: false, vegan: false, jain: false });
    setUserAllergies({ peanuts: false, gluten: false, dairy: false, shellfish: false });
    setMemories([]);
    setUserPhone("");
    setUserGender("Male");
    setUserHeight("178 cm");
    setUserUnits("Metric (kg, cm)");
    go("splash");
  };

  const handleDeleteAccount = async (password: string): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) return false;
    try {
      await deleteUser(user);
      handleLogout();
      alert("Your account has been deleted permanently.");
      return true;
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete account. You may need to sign in again to complete this operation.");
      return false;
    }
  };

  useEffect(() => {
    if (!token) {
      setInactivityWarning(false);
      return;
    }

    let warningTimer: any;
    let logoutTimer: any;
    let countdownInterval: any;

    const resetInactivityTimers = () => {
      setInactivityWarning(false);
      setInactivityCountdown(30);
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownInterval);

      // Warning after 15 minutes of inactivity (900,000 milliseconds)
      warningTimer = setTimeout(() => {
        setInactivityWarning(true);
        let remaining = 30;
        countdownInterval = setInterval(() => {
          remaining--;
          setInactivityCountdown(remaining);
          if (remaining <= 0) {
            clearInterval(countdownInterval);
          }
        }, 1000);

        logoutTimer = setTimeout(() => {
          handleLogout();
          alert("Session timed out due to inactivity.");
        }, 30000); // 30 second grace period
      }, 15 * 60 * 1000);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    const handleReset = () => {
      if (!inactivityWarning) {
        resetInactivityTimers();
      }
    };

    events.forEach((event) => window.addEventListener(event, handleReset));
    resetInactivityTimers();

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownInterval);
      events.forEach((event) => window.removeEventListener(event, handleReset));
    };
  }, [token, inactivityWarning]);

  const go = (next: Screen) => {
    if (next === "liva-home" || next === "progress-dashboard" || next === "reminder-center") {
      setLivaFlowActive(true);
    } else if (next === "home" || next === "splash" || next === "welcome") {
      setLivaFlowActive(false);
    }
    setScreen(next);
  };

  const startProcessing = (mode: EntryMode) => {
    if (mode === "voice") {
      triggerSiri();
      return;
    }
    if (mode === "text") {
      setIsTextDrawerOpen(true);
      return;
    }
    setEntryMode(mode);
    go("camera-log");
  };

  const processingTarget = useMemo(() => (entryMode === "text" ? "search-food" : "meal-confirmation"), [entryMode]);

  const content = () => {
    switch (screen) {
      case "splash":
        return <SplashScreen onNext={() => go("welcome")} />;
      case "welcome":
        return <WelcomeScreen onNext={() => go("login")} onLogin={() => go("login")} />;
      case "login":
        return (
          <LoginScreen
            onAuthSuccess={handleAuthSuccess}
            initialView={loginInitialView}
            initialResetToken={loginInitialResetToken}
          />
        );
      case "meet-liva":
        return <MeetLivaScreen onNext={() => go("goals")} />;
      case "goals":
        return (
          <GoalsScreen
            onNext={(selectedGoal) => {
              setPrimaryGoal(selectedGoal);
              syncProfile({ primaryGoal: selectedGoal });
              go("permissions");
            }}
            onSkip={() => go("permissions")}
          />
        );
      case "permissions":
        return <PermissionsScreen onNext={() => go("onboarding-success")} />;
      case "onboarding-success":
        return <OnboardingSuccessScreen onFinish={() => go("home")} />;
      case "home": {
        const targetStart = new Date().setHours(0,0,0,0);
        const targetEnd = new Date().setHours(23,59,59,999);
        const todayMeals = loggedMeals.filter(m => {
          const time = parseInt(m.id);
          return time >= targetStart && time <= targetEnd;
        });

        return (
          <HomeScreen
            onNavigate={go}
            onStartLog={startProcessing}
            userName={userName}
            caloriesLogged={caloriesLogged}
            proteinLogged={proteinLogged}
            loggedMeals={todayMeals}
            waterLogged={waterLogged}
            completedHabits={completedHabits}
            goals={goals}
            onLogWater={(amount) => setWaterLogged((w: number) => Math.max(0, w + amount))}
            onDeleteMeal={deleteLivaMeal}
          />
        );
      }
      case "my-plan":
        return (
          <MyPlanScreen
            onNavigate={go}
            loggedMeals={loggedMeals}
            goals={goals}
            history={history}
            syncDailyData={syncDailyData}
          />
        );
      case "quick-log":
        return (
          <QuickLogScreen
            onBack={() => go(livaFlowActive ? "liva-home" : "home")}
            onSelect={startProcessing}
            onNavigate={go}
          />
        );
      case "voice-log":
        return <VoiceLoggingScreen onCancel={() => go(livaFlowActive ? "liva-home" : "quick-log")} onDone={() => go(livaFlowActive ? "liva-thinking" : "ai-processing")} />;
      case "camera-log":
        return <CameraLoggingScreen onBack={() => go(livaFlowActive ? "liva-home" : "quick-log")} onCapture={(base64) => { setCapturedImageBase64(base64); go("camera-meal-select"); }} />;
      case "camera-meal-select":
        return <CameraMealSelectionScreen image={capturedImageBase64 || ""} onBack={() => go("camera-log")} onSelect={(mealType) => { setProcessingTargetMeal(mealType); go("camera-ai-processing"); }} />;
      case "camera-ai-processing":
        return (
          <CameraAIProcessingScreen 
            image={capturedImageBase64 || ""} 
            mealType={processingTargetMeal} 
            loggedMeals={loggedMeals}
            onDone={(mealData) => { 
              logLivaMeal(mealData);
              go("meal-success"); 
            }}
            onError={(err) => {
              console.error(err);
              go("home"); // Fallback on error
            }}
          />
        );
      case "ai-processing":
        return <AIProcessingScreen onDone={() => go(processingTarget)} />;
      case "text-log":
        return (
          <TextLoggingScreen 
            onBack={() => go(livaFlowActive ? "liva-home" : "quick-log")} 
            onLogMeal={(meal) => {
              logLivaMeal(meal);
              go("meal-success");
            }} 
          />
        );
      case "search-food":
        return <SearchFoodScreen onBack={() => go("text-log")} onContinue={() => go("meal-confirmation")} />;
      case "meal-confirmation":
        return <MealConfirmationScreen onBack={() => go(livaFlowActive ? "liva-home" : "quick-log")} onContinue={() => go("portion-selection")} />;
      case "portion-selection":
        return <PortionSelectionScreen onBack={() => go("meal-confirmation")} onContinue={() => go("nutrition-breakdown")} />;
      case "nutrition-breakdown":
        return <NutritionBreakdownScreen onBack={() => go("portion-selection")} onContinue={() => go("save-meal")} />;
      case "save-meal":
        return (
          <SaveMealScreen
            onBack={() => go("nutrition-breakdown")}
            onSave={() => {
              setCaloriesLogged((c) => {
                const next = c + 610;
                syncProfile({ calories: next });
                return next;
              });
              go(livaFlowActive ? "liva-home" : "meal-success");
            }}
          />
        );
      case "meal-success":
        return <MealSuccessScreen onDashboard={() => go(livaFlowActive ? "liva-home" : "home")} onLogAnother={() => go("quick-log")} />;
      
      // LIVA AI ASSISTANT SCREENS
      case "liva-home":
        return (
          <LivaHomeScreen
            onNavigate={go}
            onStartLog={(mode) => {
              setEntryMode(mode);
              if (mode === "camera") {
                go("camera-log");
              } else if (mode === "voice") {
                go("liva-voice");
              } else {
                go("liva-chat");
              }
            }}
            userName={userName}
            userProfile={{
              name: userName || "Amish",
              goal: primaryGoal,
              diet: getDietString(),
              dailyCalories: goals.calories || 1800,
              motivationStyle: motivationStyle,
              language: language
            }}
            onMealLogged={(mealData) => {
              logLivaMeal(mealData);
            }}
            onWaterLogged={(waterData) => {
              logLivaWater(waterData);
            }}
            onMealDeleted={(deleteData) => {
              if (deleteData.mealType) {
                deleteLivaMealByType(deleteData.mealType);
              }
            }}
            remainingCalories={Math.max(0, goals.calories - caloriesLogged)}
          />
        );
      case "liva-chat":
        return (
          <LivaChatScreen
            initialMessage={chatInitialMsg}
            onBack={() => {
              setChatInitialMsg("");
              go("liva-home");
            }}
            onNavigate={go}
            userName={userName}
            userProfile={{
              name: userName || "Amish",
              goal: primaryGoal,
              diet: getDietString(),
              dailyCalories: goals.calories || 1800,
              motivationStyle: motivationStyle,
              language: language
            }}
            onMealLogged={(mealData) => {
              logLivaMeal(mealData);
            }}
            onWaterLogged={(waterData) => {
              logLivaWater(waterData);
            }}
            onMealDeleted={(deleteData) => {
              if (deleteData.mealType) {
                deleteLivaMealByType(deleteData.mealType);
              }
            }}
          />
        );
      case "liva-voice":
        return (
          <LivaVoiceScreen
            onCancel={() => go("liva-home")}
            onDone={(spoken) => {
              setChatInitialMsg(spoken);
              go("liva-chat");
            }}
          />
        );
      case "liva-thinking":
        return <LivaThinkingScreen onDone={() => go("liva-response")} />;
      case "liva-response":
        return (
          <LivaResponseScreen
            onBack={() => go("liva-home")}
            onNavigate={go}
          />
        );
      case "liva-recommendations":
        return (
          <LivaRecommendationsScreen
            onBack={() => go("liva-home")}
            onSelectRecipe={(id) => {
              setSelectedRecipeId(id);
              go("liva-recipe-detail");
            }}
          />
        );
      case "liva-recipe-detail":
        return (
          <LivaRecipeDetailScreen
            onBack={() => go("liva-recommendations")}
            onSave={() => go("liva-home")}
          />
        );
      case "liva-recipe-swiper":
        return <LivaRecipeSwiperScreen onBack={() => go("liva-home")} onNavigate={go} />;
      case "liva-water":
        return (
          <LivaWaterScreen
            onBack={() => go("liva-home")}
            waterLogged={waterLogged}
            goals={goals}
            onLogWater={(amount) => setWaterLogged((w: number) => Math.max(0, w + amount))}
          />
        );
      case "liva-weekly-coach":
        return (
          <LivaWeeklyCoachScreen
            onBack={() => go("liva-home")}
            onFinish={() => go("liva-home")}
            userName={userName}
          />
        );

      // PROGRESS & INSIGHTS ROUTING SCREENS
      case "progress-dashboard":
        return (
          <ProgressDashboardScreen
            onNavigate={go}
            userWeight={userWeight}
            waterLogged={waterLogged}
            completedHabits={completedHabits}
            goals={goals}
            caloriesLogged={caloriesLogged}
            loggedMealsCount={todaysLoggedMeals.filter(m => m.mealType !== "snack").length}
          />
        );
      case "progress-weekly":
        return <ProgressWeeklyScreen onBack={() => go("progress-dashboard")} onNavigate={go} />;
      case "progress-monthly":
        return <ProgressMonthlyScreen onBack={() => go("progress-dashboard")} onNavigate={go} />;
      case "progress-nutrition":
        return <ProgressNutritionScreen onBack={() => go("progress-dashboard")} />;
      case "progress-weight":
        return (
          <ProgressWeightScreen
            onBack={() => go("progress-dashboard")}
            userWeight={userWeight}
            onLogWeight={(w) => {
              setUserWeight(w);
              syncProfile({ weight: w });
            }}
          />
        );
      case "progress-habits":
        return (
          <ProgressHabitsScreen
            onBack={() => go("progress-dashboard")}
            habits={completedHabits}
            onToggleHabit={(key) =>
              setCompletedHabits((prev) => {
                const next = { ...prev, [key]: !prev[key] };
                syncProfile({ completedHabits: next });
                return next;
              })
            }
          />
        );
      case "progress-insights":
        return <ProgressInsightsScreen onBack={() => go("progress-dashboard")} onNavigate={go} />;
      case "progress-achievements":
        return <ProgressAchievementsScreen onBack={() => go("progress-dashboard")} />;
      case "progress-goals":
        return (
          <ProgressGoalsScreen
            onBack={() => go("progress-dashboard")}
            goals={goals}
            onUpdateGoals={(updated) => {
              setGoals(updated);
              syncProfile({ goals: updated });
            }}
          />
        );

      // NOTIFICATIONS & SMART REMINDERS ROUTING SCREENS
      case "reminder-center":
        return <ReminderCenterScreen onBack={() => go("home")} onNavigate={go} />;
      case "reminder-settings":
        return <ReminderSettingsScreen onBack={() => go("reminder-center")} onNavigate={go} />;
      case "reminder-preview":
        return <ReminderPreviewScreen onBack={() => go("reminder-settings")} onNavigate={go} />;
      case "reminder-meal-flow":
        return (
          <ReminderMealFlowScreen
            onBack={() => go("reminder-center")}
            onLogCalories={(kcal) => setCaloriesLogged((c: number) => c + kcal)}
            userName={userName}
          />
        );
      case "reminder-hydration":
        return (
          <ReminderHydrationScreen
            onBack={() => go("reminder-center")}
            waterLogged={waterLogged}
            goals={goals}
            onLogWater={(amount) => setWaterLogged((w: number) => Math.max(0, w + amount))}
          />
        );
      case "reminder-celebration":
        return <ReminderCelebrationScreen onBack={() => go("reminder-center")} onNavigate={go} userName={userName} />;
      case "reminder-weekly-summary":
        return <ReminderWeeklySummaryScreen onBack={() => go("reminder-center")} />;
      case "reminder-preferences":
        return <ReminderPreferencesScreen onBack={() => go("reminder-center")} />;

      // PROFILE & SETTINGS ROUTING SCREENS
      case "profile-home":
        return (
          <ProfileHomeScreen
            onNavigate={go}
            userWeight={userWeight}
            goals={goals}
            userName={userName}
            caloriesLogged={caloriesLogged}
            waterLogged={waterLogged}
            completedHabits={completedHabits}
          />
        );
      case "profile-personal":
        return (
          <ProfilePersonalScreen
            onBack={() => go("profile-home")}
            name={userName}
            email={userEmail}
            phone={userPhone}
            gender={userGender}
            height={userHeight}
            units={userUnits}
            onUpdatePersonal={(name, email, phone, gender, height, units) => {
              setUserName(name);
              setUserEmail(email);
              setUserPhone(phone);
              setUserGender(gender);
              setUserHeight(height);
              setUserUnits(units);
              syncProfile({ name, email, phone, gender, height, units });
            }}
          />
        );
      case "profile-health":
        return (
          <ProfileHealthScreen
            onBack={() => go("profile-home")}
            activity={userActivity}
            preferences={userPreferences}
            allergies={userAllergies}
            onUpdateHealth={(activity, preferences, allergies) => {
              setUserActivity(activity);
              setUserPreferences(preferences);
              setUserAllergies(allergies);
              syncProfile({ activity, preferences, allergies });
            }}
          />
        );
      case "profile-goals":
        return (
          <ProfileGoalsScreen
            onBack={() => go("profile-home")}
            goals={goals}
            onUpdateGoals={(updated) => {
              setGoals(updated);
              syncProfile({ goals: updated });
            }}
          />
        );
      case "profile-liva":
        return (
          <ProfileLivaScreen
            onBack={() => go("profile-home")}
            memories={memories}
            onUpdateMemories={(updated) => {
              setMemories(updated);
              syncProfile({ memories: updated });
            }}
          />
        );
      case "profile-devices":
        return <ProfileDevicesScreen onBack={() => go("profile-home")} />;
      case "profile-premium":
        return <ProfilePremiumScreen onBack={() => go("profile-home")} />;
      case "profile-privacy":
        return (
          <ProfilePrivacyScreen
            onBack={() => go("profile-home")}
            onDeleteAccount={handleDeleteAccount}
          />
        );
      case "profile-help":
        return <ProfileHelpScreen onBack={() => go("profile-home")} />;
      case "profile-settings":
        return (
          <ProfileSettingsScreen
            onBack={() => go("profile-home")}
            onLogout={handleLogout}
          />
        );
      default:
        return <HomeScreen onNavigate={go} onStartLog={startProcessing} />;
    }
  };

  return (
    <PhoneFrame>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden w-full h-full">
        {dbError && (
          <div className="absolute top-12 left-4 right-4 z-50 rounded-2xl p-3 bg-red-50 border border-red-200 shadow-lg text-[10px] font-bold text-red-700 flex justify-between items-start gap-2">
            <span>⚠️ {dbError}</span>
            <button onClick={() => setDbError(null)} className="text-red-500 hover:text-red-700 text-xs font-black select-none">×</button>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-0 flex-1 flex-col"
          >
            {content()}
          </motion.div>
        </AnimatePresence>

        {showFloatingLiva && (
          <>
            <AnimatePresence>
              {showHeyLivaTip && (
                <motion.div
                  initial={{ opacity: 0, x: 8, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 4, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-[104px] right-[72px] z-20 bg-white/40 text-[#10201a] text-[9px] font-extrabold px-3.5 py-1.5 rounded-full shadow-lg whitespace-nowrap"
                  style={{
                    boxShadow: "0 4px 12px rgba(16,32,26,0.06)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  }}
                >
                  Say "Hey Liva"
                  {/* Arrow pointing right to the floating Liva bubble */}
                  <span
                    className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-b-[4px] border-l-[4px] border-t-transparent border-b-transparent border-l-white/40"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <FloatingLiva onClick={triggerSiri} />
          </>
        )}

        {livaSiriActive && (
          <LivaSiriOverlay
            text={siriText}
            onClose={() => {
              setLivaSiriActive(false);
              setPendingMealData(null);
            }}
            cueCard={
              pendingMealData ? (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="flex flex-col items-start w-full space-y-2 pointer-events-auto"
                >
                  {/* Chat Bubble Style Prompt */}
                  <div className="bg-white px-4 py-2.5 rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 max-w-[85%] backdrop-blur-sm">
                    <p className="text-slate-800 font-extrabold text-[13px] tracking-tight">Which meal is this?</p>
                  </div>

                  {/* Single Line Horizontally Scrollable Chips */}
                  <div className="flex flex-nowrap overflow-x-auto gap-2 w-full pb-2 hide-scrollbar">
                    {["Breakfast", "Lunch", "Dinner", "Snack"].map(section => (
                      <button
                        key={section}
                        onClick={() => {
                          logLivaMeal({ ...pendingMealData, mealType: section.toLowerCase() });
                          setPendingMealData(null);
                          setLivaSiriActive(false);
                          setLivaFlowActive(false);
                          setToastMessage(`Meal saved in ${section}!`);
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="bg-white/95 hover:bg-emerald-50 text-emerald-600 font-bold py-2 px-4 rounded-lg shadow-sm border border-emerald-100 text-[12px] whitespace-nowrap transition-all backdrop-blur-md"
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : null
            }
          />
        )}

        <AnimatePresence>
          {isTextDrawerOpen && (
            <TextLoggingDrawer 
              onClose={() => setIsTextDrawerOpen(false)} 
              onLogMeal={(meal) => {
                logLivaMeal(meal);
                setToastMessage(`Meal saved in ${meal.mealType}!`);
                setTimeout(() => setToastMessage(null), 3000);
              }} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-slate-800/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[11px] font-medium shadow-2xl pointer-events-none whitespace-nowrap flex items-center gap-1.5 border border-slate-600/50"
            >
              <Check size={12} className="text-emerald-400" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Missing Meal Section Que Card (Standalone fallback) */}
        <AnimatePresence>
          {pendingMealData && !livaSiriActive && (
            <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="flex flex-col items-start w-full space-y-2 pointer-events-auto absolute bottom-[260px] px-6"
              >
                {/* Chat Bubble Style Prompt */}
                <div className="bg-white px-4 py-2.5 rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 max-w-[85%] backdrop-blur-sm">
                  <p className="text-slate-800 font-extrabold text-[13px] tracking-tight">Which meal is this?</p>
                </div>

                {/* Single Line Horizontally Scrollable Chips */}
                <div className="flex flex-nowrap overflow-x-auto gap-2 w-full pb-2 hide-scrollbar">
                  {["Breakfast", "Lunch", "Dinner", "Snack"].map(section => (
                    <button
                      key={section}
                      onClick={() => {
                        logLivaMeal({ ...pendingMealData, mealType: section.toLowerCase() });
                        setPendingMealData(null);
                        setToastMessage(`Meal saved in ${section}!`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="bg-white/95 hover:bg-emerald-50 text-emerald-600 font-bold py-2 px-4 rounded-lg shadow-sm border border-emerald-100 text-[12px] whitespace-nowrap transition-all backdrop-blur-md"
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Inactivity Warning Modal */}
        {inactivityWarning && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
            <div className="bg-white rounded-[28px] p-6 text-center space-y-4 max-w-[280px]" style={{ boxShadow: "0 20px 48px rgba(16,32,26,0.16)" }}>
              <span className="text-4xl block">⏱️</span>
              <div>
                <h3 className="text-base font-bold text-slate-700">Are you still there?</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  You will be logged out automatically due to inactivity in <span className="font-extrabold text-rose-500">{inactivityCountdown} seconds</span>.
                </p>
              </div>
              <button
                onClick={() => {
                  setInactivityWarning(false);
                  setInactivityCountdown(30);
                  window.dispatchEvent(new Event("click"));
                }}
                className="w-full bg-[#34c759] hover:bg-[#25ad48] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Keep Me Logged In
              </button>
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
