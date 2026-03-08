import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "../services/api";

export type UserProfile = {
  id: string;
  name: string;
  avatarId?: string;
  avatarUrl?: string;
  level: number;
  streak: number;
  backendToken?: string;
  walletAddress?: string;
};

type AuthState = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (name: string) => Promise<void>;
  setBackendIdentity: (token: string, player: { id: string; username: string; walletAddress?: string }) => void;
  setAvatar: (avatarId: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (name: string) => {
        const response = await api.loginGuest(name.split("@")[0] || name || "Player");
        set({
          user: {
            id: response.player.id,
            name: response.player.username,
            avatarId: "fox",
            level: 8,
            streak: 5,
            backendToken: response.token,
            walletAddress: response.player.walletAddress,
          },
          isAuthenticated: true,
        });
      },
      setBackendIdentity: (token, player) =>
        set((state) => ({
          user: {
            id: player.id,
            name: player.username,
            avatarId: state.user?.avatarId ?? "fox",
            level: state.user?.level ?? 8,
            streak: state.user?.streak ?? 5,
            avatarUrl: state.user?.avatarUrl,
            backendToken: token,
            walletAddress: player.walletAddress,
          },
          isAuthenticated: true,
        })),
      setAvatar: (avatarId) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                avatarId,
              }
            : state.user,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "wordgame-auth",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
