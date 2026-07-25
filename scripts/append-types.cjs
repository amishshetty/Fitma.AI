const fs = require('fs');

const typesAppend = `
export interface ChatMessage {
  id: string;
  sender: "user" | "liva";
  text: string;
  timestamp: string;
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
  timestamp: string;
  mealType: string;
}
`;

fs.appendFileSync('src/types.ts', typesAppend);
