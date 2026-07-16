
export const green = "#34C759";
export const ink = "#10201a";
export const muted = "#6d8779";
export const softGreen = "#eefaf2";

export const mealItems = [
  { name: "2 Rotis", serving: "2 medium", calories: 220, protein: 7, carbs: 44, fat: 3, confidence: 96 },
  { name: "Dal", serving: "1 bowl", calories: 180, protein: 11, carbs: 26, fat: 4, confidence: 93 },
  { name: "Rice", serving: "1 cup", calories: 210, protein: 4, carbs: 45, fat: 1, confidence: 91 },
];

export const rotatingFacts = ["Estimating portions...", "Identifying ingredients...", "Calculating nutrition..."];

export const screenVariants = {
  enter: { x: 32, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -32, opacity: 0 },
};
  
export const screens = ["splash", "welcome", "login", "meet-liva", "goals", "permissions", "onboarding-success", "home", "quick-log", "voice-log", "camera-log", "ai-processing", "text-log", "search-food", "meal-confirmation", "portion-selection", "nutrition-breakdown", "save-meal", "meal-success", "liva-home", "liva-chat", "liva-voice", "liva-thinking", "liva-response", "liva-recommendations", "liva-recipe-detail", "liva-weekly-coach", "liva-recipe-swiper", "liva-water", "progress-dashboard", "progress-weekly", "progress-monthly", "progress-nutrition", "progress-weight", "progress-habits", "progress-insights", "progress-achievements", "progress-goals", "reminder-center", "reminder-settings", "reminder-preview", "reminder-meal-flow", "reminder-hydration", "reminder-celebration", "reminder-weekly-summary", "reminder-preferences", "profile-home", "profile-personal", "profile-health", "profile-goals", "profile-liva", "profile-devices", "profile-premium", "profile-privacy", "profile-help", "profile-settings"] as const;

import { Mic, Camera, Search } from 'lucide-react';

export const quickOptions = [
  { mode: "voice", title: "Voice", description: "Just tell Liva what you ate.", icon: Mic, tint: "#34C759", bg: "#ecfbf1" },
  { mode: "camera", title: "Camera", description: "Snap a photo and let AI identify your meal.", icon: Camera, tint: "#0EA5E9", bg: "#e9f7ff" },
  { mode: "text", title: "Type", description: "Type your meal naturally.", icon: Search, tint: "#7C3AED", bg: "#f3edff" }
];
