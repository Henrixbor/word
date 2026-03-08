const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://wordgame-production-79dc.up.railway.app";

export type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatarUrl?: string;
};

type ProfileStats = {
  gamesPlayed: number;
  winRate: number;
  bestStreak: number;
  currentStreak: number;
};

export type BackendIdentity = {
  success: boolean;
  token: string;
  player: {
    id: string;
    username: string;
    walletAddress?: string;
  };
};

export type FriendEntry = {
  id: string;
  username: string;
  walletAddress: string;
  source: string;
  externalHandle?: string | null;
  isOnline?: boolean;
  lastSeenAt?: number | null;
};

export type DuoLobbyResponse = {
  success: boolean;
  lobby: DuoLobby | null;
};

export type GameCenterFriendPayload = {
  gamePlayerId: string;
  teamPlayerId: string;
  displayName: string;
  alias: string;
};

export type DemoRoomResponse = {
  success: boolean;
  room: {
    roomCode: string;
    status: string;
    mode: string;
    phase: "lobby" | "countdown" | "active" | "intermission" | "finished" | string;
    playerCount: number;
    maxPlayers: number;
    teamSize: number;
    readyTeamCount: number;
    entryFee: number;
    prizePool: number;
    duration: number;
    startedAt: string | null;
    nextMatchStartsAt: string | null;
    currentRound: number;
    totalRounds: number;
    roundEndsAt: string | null;
    countdownEndsAt: string | null;
    intermissionEndsAt: string | null;
    lastRoundWinner: {
      playerId: string;
      playerName: string;
      word: string;
      position: number;
    } | null;
    leaderboard: {
      rank: number;
      teamId: string;
      teamName: string;
      points: number;
      roundBestPosition: number | null;
      players: {
        playerId: string;
        playerName: string;
        points: number;
      }[];
    }[];
    playerLeaderboard: {
      rank: number;
      playerId: string;
      playerName: string;
      points: number;
      roundBestPosition: number | null;
      bestPosition: number;
      guessCount: number;
      bestGuess: string | null;
    }[];
    topGuesses: {
      position: number;
      word: string;
      playerId?: string | null;
      playerName?: string | null;
      discovered?: boolean;
      pinned?: boolean;
    }[];
    players: {
      playerId: string;
      username: string;
      teamId: string | null;
      teamName: string | null;
      points: number;
      roundBestPosition: number | null;
      bestPosition: number | null;
      guessCount: number;
    }[];
  };
};

export type DemoJoinResponse = {
  success: boolean;
  token: string;
  player: {
    id: string;
    username: string;
  };
  teamId: string;
  teamName: string;
  roomCode: string;
  roomStatus: string;
};

export type DuoLobby = {
  lobbyId: string;
  status: "open" | "ready" | "queued" | "matched" | string;
  host: {
    playerId: string;
    playerName: string;
  };
  teammate: {
    playerId: string;
    playerName: string;
  } | null;
  invitedPlayer: {
    playerId: string;
    playerName: string;
  } | null;
  roomCode: string | null;
  queuedAt: string | null;
  matchedAt: string | null;
};

type ApiErrorPayload = {
  error?: string;
  details?: string;
};

const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

const mockLeaderboard = (seed: string): LeaderboardEntry[] =>
  Array.from({ length: 12 }).map((_, index) => ({
    id: `${seed}-${index}`,
    name: `${seed} Player ${index + 1}`,
    score: 12000 - index * 420,
    rank: index + 1,
  }));

export const api = {
  loginGuest: async (name: string): Promise<BackendIdentity> => {
    const response = await fetch(`${API_URL}/api/auth/guest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`Guest login failed: ${response.status}`);
    }

    return response.json() as Promise<BackendIdentity>;
  },

  pingPresence: async (token: string) => {
    const response = await fetch(`${API_URL}/api/auth/presence/ping`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Presence ping failed: ${response.status}`);
    }

    return response.json() as Promise<{ success: boolean; online: boolean; lastSeenAt: string }>;
  },

  getDailyChallenge: async () => {
    return {
      wordLength: 5,
      clue: "A warm glow from fire.",
      bonus: 250,
    };
  },

  getLeaderboards: async () => {
    try {
      const data = await getJson<{ success: boolean; rooms: { roomCode: string; playerCount?: number }[] }>(
        "/api/games"
      );

      const derived = (data.rooms ?? []).slice(0, 12).map((room, index) => ({
        id: room.roomCode,
        name: `Room ${room.roomCode}`,
        score: Math.max(1000 - index * 55 + (room.playerCount ?? 0) * 10, 100),
        rank: index + 1,
      }));

      const leaderboard = derived.length > 0 ? derived : mockLeaderboard("Live");
      return {
        lifetime: leaderboard,
        monthly: leaderboard.map((entry) => ({ ...entry, id: `monthly-${entry.id}` })),
        friends: mockLeaderboard("Friends"),
      };
    } catch {
      return {
        lifetime: mockLeaderboard("Lifetime"),
        monthly: mockLeaderboard("Monthly"),
        friends: mockLeaderboard("Friends"),
      };
    }
  },

  getProfileStats: async (): Promise<ProfileStats> => {
    try {
      const health = await getJson<{ status: string; redis: boolean }>("/health");
      return {
        gamesPlayed: 12,
        winRate: health.redis ? 0.64 : 0.58,
        bestStreak: 6,
        currentStreak: 3,
      };
    } catch {
      return {
        gamesPlayed: 132,
        winRate: 0.62,
        bestStreak: 14,
        currentStreak: 5,
      };
    }
  },

  getDemoRoom: async (): Promise<DemoRoomResponse> => {
    return getJson<DemoRoomResponse>("/api/games/demo");
  },

  joinDemoRoom: async (playerName: string): Promise<DemoJoinResponse> => {
    const response = await fetch(`${API_URL}/api/games/demo/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerName }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
      throw new Error(payload?.details || payload?.error || `Demo join failed: ${response.status}`);
    }

    return response.json() as Promise<DemoJoinResponse>;
  },

  getDuoLobby: async (token: string): Promise<DuoLobbyResponse> => {
    const response = await fetch(`${API_URL}/api/games/team/lobby`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Duo lobby load failed: ${response.status}`);
    }

    return response.json() as Promise<DuoLobbyResponse>;
  },

  getDuoInvites: async (token: string): Promise<{ success: boolean; invites: DuoLobby[] }> => {
    const response = await fetch(`${API_URL}/api/games/team/invites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Duo invite load failed: ${response.status}`);
    }

    return response.json() as Promise<{ success: boolean; invites: DuoLobby[] }>;
  },

  createDuoLobby: async (token: string): Promise<DuoLobbyResponse> => {
    const response = await fetch(`${API_URL}/api/games/team/lobby`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
      throw new Error(payload?.details || payload?.error || `Create duo lobby failed: ${response.status}`);
    }

    return response.json() as Promise<DuoLobbyResponse>;
  },

  inviteToDuoLobby: async (token: string, lobbyId: string, query: string): Promise<DuoLobbyResponse> => {
    const response = await fetch(`${API_URL}/api/games/team/lobby/${lobbyId}/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
      throw new Error(payload?.details || payload?.error || `Invite teammate failed: ${response.status}`);
    }

    return response.json() as Promise<DuoLobbyResponse>;
  },

  acceptDuoInvite: async (token: string, lobbyId: string): Promise<DuoLobbyResponse> => {
    const response = await fetch(`${API_URL}/api/games/team/lobby/${lobbyId}/accept`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
      throw new Error(payload?.details || payload?.error || `Accept duo invite failed: ${response.status}`);
    }

    return response.json() as Promise<DuoLobbyResponse>;
  },

  queueDuoLobby: async (token: string, lobbyId: string): Promise<DuoLobbyResponse> => {
    const response = await fetch(`${API_URL}/api/games/team/lobby/${lobbyId}/queue`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
      throw new Error(payload?.details || payload?.error || `Queue duo lobby failed: ${response.status}`);
    }

    return response.json() as Promise<DuoLobbyResponse>;
  },

  declineDuoInvite: async (token: string, lobbyId: string): Promise<DuoLobbyResponse> => {
    const response = await fetch(`${API_URL}/api/games/team/lobby/${lobbyId}/decline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
      throw new Error(payload?.details || payload?.error || `Decline duo invite failed: ${response.status}`);
    }

    return response.json() as Promise<DuoLobbyResponse>;
  },

  leaveDuoLobby: async (token: string, lobbyId: string): Promise<DuoLobbyResponse> => {
    const response = await fetch(`${API_URL}/api/games/team/lobby/${lobbyId}/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
      throw new Error(payload?.details || payload?.error || `Leave duo lobby failed: ${response.status}`);
    }

    return response.json() as Promise<DuoLobbyResponse>;
  },

  cancelDuoLobby: async (token: string, lobbyId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_URL}/api/games/team/lobby/${lobbyId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
      throw new Error(payload?.details || payload?.error || `Cancel duo lobby failed: ${response.status}`);
    }

    return response.json() as Promise<{ success: boolean }>;
  },

  clearDuoInvite: async (token: string, lobbyId: string): Promise<DuoLobbyResponse> => {
    const response = await fetch(`${API_URL}/api/games/team/lobby/${lobbyId}/clear-invite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
      throw new Error(payload?.details || payload?.error || `Clear duo invite failed: ${response.status}`);
    }

    return response.json() as Promise<DuoLobbyResponse>;
  },

  getFriends: async (token: string): Promise<{ success: boolean; friends: FriendEntry[] }> => {
    const response = await fetch(`${API_URL}/api/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Friends load failed: ${response.status}`);
    }

    return response.json() as Promise<{ success: boolean; friends: FriendEntry[] }>;
  },

  getOnlineFriends: async (token: string): Promise<{ success: boolean; friends: FriendEntry[] }> => {
    const response = await fetch(`${API_URL}/api/friends/online`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Online friends load failed: ${response.status}`);
    }

    return response.json() as Promise<{ success: boolean; friends: FriendEntry[] }>;
  },

  addFriend: async (token: string, query: string) => {
    const response = await fetch(`${API_URL}/api/friends/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, source: "manual" }),
    });

    if (!response.ok) {
      throw new Error(`Add friend failed: ${response.status}`);
    }

    return response.json() as Promise<{ success: boolean; friend: FriendEntry }>;
  },

  syncGameCenterFriends: async (
    token: string,
    gameCenterPlayerId: string,
    friends: (string | GameCenterFriendPayload)[]
  ) => {
    const response = await fetch(`${API_URL}/api/friends/sync-game-center`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ gameCenterPlayerId, friends }),
    });

    if (!response.ok) {
      throw new Error(`Game Center sync failed: ${response.status}`);
    }

    return response.json() as Promise<{ success: boolean; imported: { id: string; username: string }[] }>;
  },
};
