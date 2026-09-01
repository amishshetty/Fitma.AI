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
  history: any;
  
  // Actions
  login: (name: string) => void;
  setProfile: (data: any) => void;
  logout: () => void;
  updateGoals: (goals: Partial<UserGoals>) => void;
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

  login: (name) => set({ isAuthenticated: true, userName: name }),
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
      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const todayHistory = state.history[today] || {};
      const newCal = state.caloriesLogged + cal;
      const newPro = state.proteinLogged + pro;
      const newMeals = [...state.meals, { ...meal, id: Date.now().toString(), time: new Date().toISOString() }];
      
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

    // Sync to Firebase
    const user = auth.currentUser;
    if (user) {
      const state = getStore();
      
      // Sync to the root user profile to perfectly match the Web App schema
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        calories: state.caloriesLogged,
        protein: state.proteinLogged,
        meals: state.meals,
      });

      // Also push to history for historical tracking (web uses this for past days)
      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const historyRef = ref(db, `users/${user.uid}/history/${today}`);
      await update(historyRef, {
        calories: state.caloriesLogged,
        protein: state.proteinLogged,
        meals: state.meals
      });
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
