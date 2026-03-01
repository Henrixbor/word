export type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatarUrl?: string;
};

export const api = {
  getDailyChallenge: async () => {
    return {
      wordLength: 5,
      clue: "A warm glow from fire.",
      bonus: 250,
    };
  },
  getLeaderboards: async () => {
    return {
      lifetime: mockLeaderboard("Lifetime"),
      monthly: mockLeaderboard("Monthly"),
      friends: mockLeaderboard("Friends"),
    };
  },
  getProfileStats: async () => {
    return {
      gamesPlayed: 132,
      winRate: 0.62,
      bestStreak: 14,
      currentStreak: 5,
    };
  },
};

const mockLeaderboard = (seed: string): LeaderboardEntry[] => {
  return Array.from({ length: 12 }).map((_, index) => ({
    id: `${seed}-${index}`,
    name: `${seed} Player ${index + 1}`,
    score: 12000 - index * 420,
    rank: index + 1,
  }));
};
