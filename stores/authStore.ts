import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserProfile = {
  id: string;
  name: string;
  avatarUrl?: string;
  level: number;
  streak: number;
};

type AuthState = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string) =>
        set({
          user: {
            id: "user-1",
            name: email.split("@")[0] || "Player",
            level: 8,
            streak: 5,
          },
          isAuthenticated: true,
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "wordgame-auth",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
