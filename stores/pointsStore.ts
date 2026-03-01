import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type PointsState = {
  points: number;
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => void;
};

export const usePointsStore = create<PointsState>()(
  persist(
    (set) => ({
      points: 1250,
      addPoints: (amount) =>
        set((state) => ({ points: state.points + amount })),
      spendPoints: (amount) =>
        set((state) => ({ points: Math.max(0, state.points - amount) })),
    }),
    {
      name: "wordgame-points",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
