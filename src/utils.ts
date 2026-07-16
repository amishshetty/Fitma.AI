import { auth } from './app/firebase';

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 16) return "Good Afternoon";
  return "Good Evening";
};

export const getHealthScore = (calories: number, water: number, goals: any, habits: { [key: string]: boolean }) => {
  let score = 50;

  // 1. Water intake (max +15)
  if (goals && goals.water > 0) {
    const waterRatio = Math.min(1.2, water / goals.water);
    if (waterRatio >= 1.0) score += 15;
    else score += Math.round(waterRatio * 15);
  }

  // 2. Habits (max +20)
  if (habits) {
    const habitKeys = Object.keys(habits);
    if (habitKeys.length > 0) {
      const completedCount = habitKeys.filter(k => habits[k]).length;
      score += Math.round((completedCount / habitKeys.length) * 20);
    }
  }

  // 3. Calorie alignment (max +15)
  if (goals && goals.calories > 0) {
    const calRatio = calories / goals.calories;
    if (calRatio >= 0.8 && calRatio <= 1.1) {
      score += 15;
    } else if (calRatio > 0 && calRatio < 0.8) {
      score += Math.round((calRatio / 0.8) * 15);
    } else if (calRatio > 1.1) {
      score += Math.max(0, 15 - Math.round((calRatio - 1.1) * 10));
    }
  }

  return Math.min(100, Math.max(0, score));
};

export const isPlaceholderConfig = () => {
  return !auth.app.options.apiKey || auth.app.options.apiKey.includes("PLACEHOLDER");
};

export const withFirebaseTimeout = <T,>(promise: Promise<T>, operationName: string = "Firebase operation"): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${operationName} timed out after 10s. Please check your connection or Firebase config.`)), 10000))
  ]);
};
