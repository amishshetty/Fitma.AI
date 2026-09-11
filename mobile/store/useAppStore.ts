import { create } from 'zustand';
import { auth, db } from '../firebase';
import { ref, set, get, update } from 'firebase/database';

interface UserGoals {
  calories: number;
  protein: number;
  water: number;
}

interface AppState {
  isAuthenticated: boolean;
  userName: string;
  goals: UserGoals;
  caloriesLogged: number;
  proteinLogged: number;
  waterLogged: number;
  meals: any[];
  appTheme: 'light' | 'dark' | 'system';
  
  // Actions
  login: (name: string) => void;
  setProfile: (data: any) => void;
  logout: () => void;
  updateGoals: (goals: Partial<UserGoals>) => void;
  setAppTheme: (theme: 'light' | 'dark' | 'system') => void;
  deleteMeal: (id: string) => void;
  logMeal: (meal: any) => void;
  logWater: (amount: number) => void;
  resetDailyLogs: () => void;
}

export const useAppStore = create<AppState>()((set, getStore) => ({
  isAuthenticated: false,
  userName: '',
  goals: {
    calories: 2000,
    protein: 120,
    water: 2500, // ml
  },
  caloriesLogged: 0,
  proteinLogged: 0,
  waterLogged: 0,
  meals: [],
  history: {},
  appTheme: 'system',

  login: (name) => set({ isAuthenticated: true, userName: name }),
  setAppTheme: (theme) => set({ appTheme: theme }),
  setProfile: (data) => set((state) => {
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const historyData = data.history || {};
    const todayData = historyData[today] || {};
    
    return {
      userName: data.name || data.firstName || state.userName,
      goals: {
        ...state.goals,
        ...(data.goals || {})
      },
      caloriesLogged: todayData.calories || 0,
      waterLogged: todayData.water || 0,
      meals: data.meals || [],
      history: historyData,
    };
  }),
  
  logout: () => set({ isAuthenticated: false, userName: '', caloriesLogged: 0, proteinLogged: 0, waterLogged: 0, history: {} }),
  
  updateGoals: (newGoals) => set((state) => ({ 
    goals: { ...state.goals, ...newGoals } 
  })),

  deleteMeal: async (id: string) => {
    let deletedCal = 0;
    let deletedPro = 0;
    
    set((state) => {
      const mealToDelete = state.meals.find(m => m.id === id);
      if (mealToDelete) {
        deletedCal = mealToDelete.calories || 0;
        deletedPro = mealToDelete.protein || 0;
      }
      const newMeals = state.meals.filter(m => m.id !== id);
      const newCal = Math.max(0, state.caloriesLogged - deletedCal);
      const newPro = Math.max(0, state.proteinLogged - deletedPro);
      
      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const todayHistory = state.history[today] || {};
      
      return {
        caloriesLogged: newCal,
        proteinLogged: newPro,
        meals: newMeals,
        history: {
          ...state.history,
          [today]: {
            ...todayHistory,
            calories: newCal,
            protein: newPro,
            meals: newMeals
          }
        }
      };
    });

    const user = auth.currentUser;
    if (user) {
      const state = getStore();
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        calories: state.caloriesLogged,
        protein: state.proteinLogged,
        meals: state.meals,
      });

      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const historyRef = ref(db, `users/${user.uid}/history/${today}`);
      await update(historyRef, {
        calories: state.caloriesLogged,
        protein: state.proteinLogged,
        meals: state.meals
      });
    }
  },
  
  logMeal: async (meal: any) => {
    const cal = meal.calories || 0;
    const pro = meal.protein || 0;
    
    set((state) => {
      // Use provided timestamp or current time
      const mealTime = meal.timestamp ? new Date(meal.timestamp) : new Date();
      const mealDateStr = new Date(mealTime.getTime() - mealTime.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
      
      const isToday = mealDateStr === today;
      
      // Clean undefined values to prevent Firebase errors
      const cleanMeal = { ...meal };
      Object.keys(cleanMeal).forEach(key => cleanMeal[key] === undefined && delete cleanMeal[key]);
      
      const targetHistory = state.history[mealDateStr] || { calories: 0, protein: 0, water: 0, meals: [] };
      const newHistoryMeals = [...(targetHistory.meals || []), { ...cleanMeal, id: mealTime.getTime().toString(), time: mealTime.toISOString() }];
      
      const newMealsList = isToday ? [...state.meals, { ...cleanMeal, id: mealTime.getTime().toString(), time: mealTime.toISOString() }] : state.meals;
      
      return {
        caloriesLogged: isToday ? state.caloriesLogged + cal : state.caloriesLogged,
        proteinLogged: isToday ? state.proteinLogged + pro : state.proteinLogged,
        meals: newMealsList,
        history: {
          ...state.history,
          [mealDateStr]: {
            ...targetHistory,
            calories: (targetHistory.calories || 0) + cal,
            protein: (targetHistory.protein || 0) + pro,
            meals: newHistoryMeals
          }
        }
      };
    });

    // Sync to Firebase
    const user = auth.currentUser;
    if (user) {
      const state = getStore();
      
      // Sync to the root user profile to perfectly match the Web App schema
      const userRef = ref(db, `users/${user.uid}`);
      
      // Only sync the root calories/protein if we updated today's logs
      const mealTime = meal.timestamp ? new Date(meal.timestamp) : new Date();
      const mealDateStr = new Date(mealTime.getTime() - mealTime.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
      
      if (mealDateStr === today) {
        await update(userRef, {
          calories: state.caloriesLogged,
          protein: state.proteinLogged,
          meals: state.meals,
          history: state.history
        });
      } else {
        // Just sync history
        await update(userRef, { history: state.history });
      }
    }
  },
  
  logWater: async (amount) => {
    set((state) => {
      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const todayHistory = state.history[today] || {};
      
      // Calculate daily water rather than all-time water
      const currentDailyWater = todayHistory.water || 0;
      const newDailyWater = currentDailyWater + amount;
      
      return {
        waterLogged: newDailyWater,
        history: {
          ...state.history,
          [today]: {
            ...todayHistory,
            water: newDailyWater
          }
        }
      };
    });
    
    const user = auth.currentUser;
    if (user) {
      const state = getStore();
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        water: state.waterLogged
      });

      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const historyRef = ref(db, `users/${user.uid}/history/${today}`);
      await update(historyRef, { water: state.waterLogged });
    }
  },
  
  resetDailyLogs: () => set({ caloriesLogged: 0, proteinLogged: 0, waterLogged: 0 }),
}));
