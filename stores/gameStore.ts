import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  GameMode,
  GameSession,
  SubmitGuessResult,
  createDailySession,
  createPracticeSession,
  formatDateKey,
  submitGuessToSession,
} from "../lib/gameEngine";

type GameStats = {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  totalGuesses: number;
  lastDailyCompleted: string | null;
};

type GameState = {
  todayKey: string;
  dailySession: GameSession;
  practiceSession: GameSession;
  practiceSeed: number;
  stats: GameStats;
  hydrateDaily: (date?: Date) => void;
  startPractice: () => void;
  submitGuess: (mode: GameMode, word: string) => SubmitGuessResult;
  resetMode: (mode: GameMode) => void;
};

const createInitialStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGuesses: 0,
  lastDailyCompleted: null,
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      todayKey: formatDateKey(),
      dailySession: createDailySession(formatDateKey()),
      practiceSession: createPracticeSession(0),
      practiceSeed: 0,
      stats: createInitialStats(),

      hydrateDaily: (date = new Date()) => {
        const nextDateKey = formatDateKey(date);
        const state = get();
        if (state.todayKey === nextDateKey) return;
        set({
          todayKey: nextDateKey,
          dailySession: createDailySession(nextDateKey),
        });
      },

      startPractice: () =>
        set((state) => {
          const nextSeed = state.practiceSeed + 1;
          return {
            practiceSeed: nextSeed,
            practiceSession: createPracticeSession(nextSeed),
          };
        }),

      submitGuess: (mode, word) => {
        const state = get();
        const session = mode === "daily" ? state.dailySession : state.practiceSession;
        const result = submitGuessToSession(session, word);

        if (!result.ok) return result;

        const completedBefore = session.status !== "active";
        const justCompleted = !completedBefore && result.session.status !== "active";
        const nextStats = { ...state.stats };
        nextStats.totalGuesses += 1;

        if (justCompleted) {
          nextStats.gamesPlayed += 1;
          if (result.isWin) {
            nextStats.gamesWon += 1;
            nextStats.currentStreak += 1;
            nextStats.bestStreak = Math.max(nextStats.bestStreak, nextStats.currentStreak);
            if (mode === "daily") {
              nextStats.lastDailyCompleted = state.todayKey;
            }
          } else {
            nextStats.currentStreak = 0;
          }
        }

        set({
          stats: nextStats,
          dailySession: mode === "daily" ? result.session : state.dailySession,
          practiceSession: mode === "practice" ? result.session : state.practiceSession,
        });

        return result;
      },

      resetMode: (mode) =>
        set((state) => {
          if (mode === "daily") {
            return { dailySession: createDailySession(state.todayKey) };
          }

          const nextSeed = state.practiceSeed + 1;
          return {
            practiceSeed: nextSeed,
            practiceSession: createPracticeSession(nextSeed),
          };
        }),
    }),
    {
      name: "wordgame-game",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        todayKey: state.todayKey,
        dailySession: state.dailySession,
        practiceSession: state.practiceSession,
        practiceSeed: state.practiceSeed,
        stats: state.stats,
      }),
    }
  )
);
