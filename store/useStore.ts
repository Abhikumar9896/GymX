import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  timestamp: number;
}

export interface ActiveExercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  duration: number; 
  calories: number;
  exercises: ActiveExercise[];
}

export interface WaterLog {
  date: string; // yyyy-mm-dd
  amount: number; // ml
}

interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  weight: number;
  height: number;
  goal: string;
  points: number;
}

export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

interface GymXState {
  user: UserProfile;
  authToken: string | null;
  workoutHistory: WorkoutSession[];
  activeWorkout: WorkoutSession | null;
  weeklyPlan: Record<WeekDay, string[]>; 
  notificationTime: { hour: number; minute: number };
  notificationsEnabled: boolean;
  lastModalShown: string | null; 
  isLoggedIn: boolean;

  // Water Intake
  waterGoal: number; // ml
  waterIntakeHistory: WaterLog[]; // Full history
  
  // Theme
  themePreference: 'system' | 'light' | 'dark';
  
  // Actions
  setAuth: (user: Partial<UserProfile>, token: string) => void;
  setUser: (user: Partial<UserProfile>) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setThemePreference: (theme: 'system' | 'light' | 'dark') => void;
  logout: () => void;


  startWorkout: (name: string) => void;
  addExerciseToWorkout: (exerciseId: string, name: string) => void;
  addSetToExercise: (exerciseId: string, weight: number, reps: number) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  updateWeeklyPlan: (day: WeekDay, categories: string[]) => void;
  setNotificationTime: (hour: number, minute: number) => void;
  setLastModalShown: (date: string) => void;
  addPoints: (points: number) => void;

  // Water Actions
  setWaterGoal: (goal: number) => void;
  addWater: (amount: number) => void;
  resetWaterForDay: () => void;

  reset: () => void;
}

const initialUser: UserProfile = {
  name: 'GymX Athlete',
  weight: 75,
  height: 180,
  goal: 'Strength',
  points: 1250,
};

const initialPlan: Record<WeekDay, string[]> = {
  'Monday': ['Chest'],
  'Tuesday': ['Back'],
  'Wednesday': ['Legs'],
  'Thursday': ['Shoulders'],
  'Friday': ['Arms'],
  'Saturday': [],
  'Sunday': []
};

export const useGymXStore = create<GymXState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      authToken: null,
      workoutHistory: [],
      activeWorkout: null,
      weeklyPlan: initialPlan,
      notificationTime: { hour: 17, minute: 0 },
      notificationsEnabled: true,
      lastModalShown: null,
      isLoggedIn: false,
      waterGoal: 3000,
      waterIntakeHistory: [],
      themePreference: 'system',
      
      setAuth: (userData, token) => 
        set((state) => ({ 
          user: { ...state.user, ...userData }, 
          authToken: token, 
          isLoggedIn: true 
        })),

      setUser: (userData) => 
        set((state) => ({ user: { ...state.user, ...userData } })),

      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      
      setThemePreference: (theme) => set({ themePreference: theme }),

      logout: () => set({ authToken: null, isLoggedIn: false }),


        
      startWorkout: (name) => {
        const newSession: WorkoutSession = {
          id: Math.random().toString(36).substr(2, 9),
          name: name,
          date: new Date().toISOString(),
          duration: 0,
          calories: 0,
          exercises: []
        };
        set({ activeWorkout: newSession });
      },

      addExerciseToWorkout: (exerciseId, name) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;
        const alreadyExists = activeWorkout.exercises.find(e => e.id === exerciseId);
        if (alreadyExists) return;
        const newExercise: ActiveExercise = { id: exerciseId, name, sets: [] };
        set({ activeWorkout: { ...activeWorkout, exercises: [...activeWorkout.exercises, newExercise] } });
      },

      addSetToExercise: (exerciseId, weight, reps) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;
        const updatedExercises = activeWorkout.exercises.map(ex => {
          if (ex.id === exerciseId) {
            const newSet = { id: Math.random().toString(36).substr(2, 9), weight, reps, completed: true, timestamp: Date.now() };
            return { ...ex, sets: [...ex.sets, newSet] };
          }
          return ex;
        });
        set({ activeWorkout: { ...activeWorkout, exercises: updatedExercises } });
      },
        
      finishWorkout: () => {
        const { activeWorkout, workoutHistory, user } = get();
        if (!activeWorkout) return;
        const totalSets = activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
        const calories = totalSets * 12;
        const completedSession = {
          ...activeWorkout,
          calories,
          duration: Math.floor((Date.now() - new Date(activeWorkout.date).getTime()) / 1000)
        };
        set({ 
          workoutHistory: [completedSession, ...workoutHistory],
          activeWorkout: null,
          user: { ...user, points: user.points + (totalSets * 10) }
        });
      },

      cancelWorkout: () => set({ activeWorkout: null }),

      updateWeeklyPlan: (day, categories) => {
        set((state) => ({
          weeklyPlan: { ...state.weeklyPlan, [day]: categories }
        }));
      },

      setNotificationTime: (hour, minute) => set({ notificationTime: { hour, minute } }),
      setLastModalShown: (date) => set({ lastModalShown: date }),
      addPoints: (points) => set((state) => ({ user: { ...state.user, points: state.user.points + points } })),

      // Water Intake Actions
      setWaterGoal: (goal) => set({ waterGoal: goal }),
      addWater: (amount) => {
        const today = new Date().toISOString().split('T')[0];
        const { waterIntakeHistory } = get();
        const todayLog = waterIntakeHistory.find(l => l.date === today);

        if (todayLog) {
          const updatedHistory = waterIntakeHistory.map(l => 
            l.date === today ? { ...l, amount: Math.max(0, l.amount + amount) } : l
          );
          set({ waterIntakeHistory: updatedHistory });
        } else {
          set({ waterIntakeHistory: [...waterIntakeHistory, { date: today, amount: Math.max(0, amount) }] });
        }
      },

      resetWaterForDay: () => {
        const today = new Date().toISOString().split('T')[0];
        const updatedHistory = get().waterIntakeHistory.filter(l => l.date !== today);
        set({ waterIntakeHistory: updatedHistory });
      },

      reset: () => set({ user: initialUser, workoutHistory: [], activeWorkout: null, isLoggedIn: false }),
    }),
    {
      name: 'gymx-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
