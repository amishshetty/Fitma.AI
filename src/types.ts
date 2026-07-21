
export type EntryMode = "voice" | "camera" | "text" | "search";
export type Screen = "splash" | "welcome" | "login" | "meet-liva" | "goals" | "permissions" | "onboarding-success" | "home" | "quick-log" | "voice-log" | "camera-log" | "ai-processing" | "text-log" | "search-food" | "meal-confirmation" | "portion-selection" | "nutrition-breakdown" | "save-meal" | "meal-success" | "liva-home" | "liva-chat" | "liva-voice" | "liva-thinking" | "liva-response" | "liva-recommendations" | "liva-recipe-detail" | "liva-weekly-coach" | "liva-recipe-swiper" | "liva-water" | "progress-dashboard" | "progress-weekly" | "progress-monthly" | "progress-nutrition" | "progress-weight" | "progress-habits" | "progress-insights" | "progress-achievements" | "progress-goals" | "reminder-center" | "reminder-settings" | "reminder-preview" | "reminder-meal-flow" | "reminder-hydration" | "reminder-celebration" | "reminder-weekly-summary" | "reminder-preferences" | "profile-home" | "profile-personal" | "profile-health" | "profile-goals" | "profile-liva" | "profile-devices" | "profile-premium" | "profile-privacy" | "profile-help" | "profile-settings";
  
export interface ChatMessage {
  id: string;
  sender: "user" | "liva";
  text: string;
  greeting?: string;
  motivation?: string;
  timestamp: string;
  nutritionSummary?: {
    calories: number;
    protein: number;
    carbs?: number;
    fat?: number;
  };
  recommendationData?: {
    meal: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    why: string[];
    alternatives: string[];
    tip: string;
  }[];
}

export interface GoalConfig {
  weight: number;
  calories: number;
  protein: number;
  water: number;
}

export interface NotificationItem {
  id: number;
  icon: string;
  category: string;
  time: string;
  text: string;
  read: boolean;
  screen?: Screen;
}

export interface MemoryItem {
  id: number;
  text: string;
  category: string;
}

export interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
  timestamp: string;
  mealType: string;
}
