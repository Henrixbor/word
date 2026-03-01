import { create } from "zustand";

export type Guess = {
  id: string;
  word: string;
  similarity: number;
};

type GameState = {
  dailyWord: string;
  guesses: Guess[];
  addGuess: (word: string, similarity: number) => void;
  reset: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  dailyWord: "EMBER",
  guesses: [],
  addGuess: (word, similarity) =>
    set((state) => ({
      guesses: [
        { id: `${Date.now()}`, word: word.toUpperCase(), similarity },
        ...state.guesses,
      ],
    })),
  reset: () => set({ guesses: [] }),
}));
