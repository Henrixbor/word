import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { GameMascot } from "../../components/branding/GameMascot";
import { WordInput } from "../../components/game/WordInput";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Colors } from "../../constants/Colors";
import { getAvatarIdForKey } from "../../constants/multiplayerAvatars";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { api, DemoRoomResponse, DuoLobby, FriendEntry } from "../../services/api";
import { getSocket } from "../../services/socket";
import { useAuthStore } from "../../stores/authStore";

const battleArenaHero = require("../../assets/branding/battle-arena-hero.png");

type LastGuessFeedback = {
  word: string;
  position: number;
  enteredTopTen: boolean;
  isNewBest?: boolean;
};

export default function BattleScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [room, setRoom] = useState<DemoRoomResponse["room"] | null>(null);
  const [joinState, setJoinState] = useState<"idle" | "joining" | "joined">("idle");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [duoLobby, setDuoLobby] = useState<DuoLobby | null>(null);
  const [duoInvites, setDuoInvites] = useState<DuoLobby[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<FriendEntry[]>([]);
  const [showDuoLobbyView, setShowDuoLobbyView] = useState(false);
  const [inviteQuery, setInviteQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [lastGuessFeedback, setLastGuessFeedback] = useState<LastGuessFeedback | null>(null);
  const [now, setNow] = useState(Date.now());
  const boardPulse = useRef(new Animated.Value(0)).current;
  const user = useAuthStore((state) => state.user);
  const setBackendIdentity = useAuthStore((state) => state.setBackendIdentity);
  const currentAvatarId = useAuthStore((state) => state.user?.avatarId);

  const loadRoom = async () => {
    try {
      const response = await api.getDemoRoom();
      setRoom(response.room);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load battle arena.");
    }
  };

  useEffect(() => {
    void loadRoom();
  }, []);

  useEffect(() => {
    if (user?.id) {
      setPlayerId(user.id);
    }
    if (user?.name) {
      setPlayerName(user.name);
    }
  }, [user?.id, user?.name]);

  const ensureBackendIdentity = useCallback(async () => {
    const currentToken = useAuthStore.getState().user?.backendToken;
    if (currentToken) {
      return {
        token: currentToken,
        player: useAuthStore.getState().user,
      };
    }

    const alias = user?.name ?? `Scout${Math.floor(Math.random() * 900 + 100)}`;
    const response = await api.loginGuest(alias);
    setBackendIdentity(response.token, response.player);
    setPlayerId(response.player.id);
    setPlayerName(response.player.username);
    return {
      token: response.token,
      player: {
        id: response.player.id,
        name: response.player.username,
      },
    };
  }, [setBackendIdentity, user?.name]);

  const connectToArena = useCallback(async (roomCode: string, token: string, nextPlayerName?: string) => {
    setJoinState("joined");
    setStatusNote(null);
    setError(null);
    if (nextPlayerName) {
      setPlayerName(nextPlayerName);
    }
    const socket = getSocket();
    socket.auth = { token };
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("subscribe_player", { token });
    socket.emit("join_room", { roomCode, token });
    await loadRoom();
  }, []);

  useEffect(() => {
    const backendToken = user?.backendToken;
    const roomCode = room?.roomCode;
    if (!backendToken || joinState !== "joined" || !roomCode) {
      return;
    }

    const socket = getSocket();
    const resubscribeArena = () => {
      socket.emit("subscribe_player", { token: backendToken });
      socket.emit("join_room", { roomCode, token: backendToken });
    };

    socket.on("connect", resubscribeArena);
    return () => {
      socket.off("connect", resubscribeArena);
    };
  }, [joinState, room?.roomCode, user?.backendToken]);

  const loadDuoState = useCallback(async (tokenOverride?: string) => {
    const token = tokenOverride ?? useAuthStore.getState().user?.backendToken;
    if (!token) return;

    const [lobbyResponse, inviteResponse, onlineFriendsResponse] = await Promise.all([
      api.getDuoLobby(token),
      api.getDuoInvites(token),
      api.getOnlineFriends(token),
    ]);
    setDuoLobby(lobbyResponse.lobby);
    setDuoInvites(inviteResponse.invites);
    setOnlineFriends(onlineFriendsResponse.friends);
    if (lobbyResponse.lobby || inviteResponse.invites.length > 0) {
      setShowDuoLobbyView(true);
    } else if (joinState !== "joined") {
      setShowDuoLobbyView(false);
    }

    if (lobbyResponse.lobby?.status === "matched" && lobbyResponse.lobby.roomCode && joinState !== "joined") {
      const currentName = useAuthStore.getState().user?.name ?? playerName ?? undefined;
      await connectToArena(lobbyResponse.lobby.roomCode, token, currentName);
    }
  }, [connectToArena, joinState, playerName]);

  useEffect(() => {
    const interval = setInterval(() => {
      void loadRoom();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.backendToken) return;
    void loadDuoState(user.backendToken);

    const interval = setInterval(() => {
      void loadDuoState(user.backendToken);
    }, 12000);

    return () => clearInterval(interval);
  }, [joinState, loadDuoState, user?.backendToken]);

  useEffect(() => {
    const backendToken = user?.backendToken;
    if (!backendToken) return;

    const socket = getSocket();
    socket.auth = { token: backendToken };
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("subscribe_player", { token: backendToken });

    const syncLobby = async (payload?: { lobby?: DuoLobby | null }) => {
      if (payload?.lobby !== undefined) {
        setDuoLobby(payload.lobby);
        if (payload.lobby || duoInvites.length > 0) {
          setShowDuoLobbyView(true);
        }
        if (payload.lobby?.status === "matched" && payload.lobby.roomCode && joinState !== "joined") {
          const currentName = useAuthStore.getState().user?.name ?? playerName ?? undefined;
          await connectToArena(payload.lobby.roomCode, backendToken, currentName);
        }
      }
      await loadDuoState(backendToken);
    };

    const clearLobby = async () => {
      setDuoLobby(null);
      setShowDuoLobbyView(false);
      await loadDuoState(backendToken);
    };

    socket.on("duo_lobby_created", syncLobby);
    socket.on("duo_invite_sent", syncLobby);
    socket.on("duo_invite_accepted", syncLobby);
    socket.on("duo_invite_declined", syncLobby);
    socket.on("duo_invite_cleared", syncLobby);
    socket.on("duo_queued", syncLobby);
    socket.on("duo_matched", syncLobby);
    socket.on("duo_member_left", syncLobby);
    socket.on("duo_lobby_updated", syncLobby);
    socket.on("duo_lobby_cancelled", clearLobby);

    return () => {
      socket.off("duo_lobby_created", syncLobby);
      socket.off("duo_invite_sent", syncLobby);
      socket.off("duo_invite_accepted", syncLobby);
      socket.off("duo_invite_declined", syncLobby);
      socket.off("duo_invite_cleared", syncLobby);
      socket.off("duo_queued", syncLobby);
      socket.off("duo_matched", syncLobby);
      socket.off("duo_member_left", syncLobby);
      socket.off("duo_lobby_updated", syncLobby);
      socket.off("duo_lobby_cancelled", clearLobby);
    };
  }, [connectToArena, duoInvites.length, joinState, loadDuoState, playerName, user?.backendToken]);

  useEffect(() => {
    const socket = getSocket();

    const onRoomUpdate = (payload: { room: DemoRoomResponse["room"] }) => {
      setRoom(payload.room);
      if (payload.room.phase === "active" || payload.room.phase === "countdown" || payload.room.phase === "intermission") {
        setStatusNote(null);
      }
    };
    const onRoundStarted = (payload: { room: DemoRoomResponse["room"]; currentRound: number }) => {
      setRoom(payload.room);
      setLastGuessFeedback(null);
      setStatusNote(`Round ${payload.currentRound} live.`);
    };
    const onRoundCountdown = (payload: { room: DemoRoomResponse["room"]; currentRound: number }) => {
      setRoom(payload.room);
      setStatusNote(`Round ${payload.currentRound} in 3.`);
    };
    const onRoundEnded = (payload: { room: DemoRoomResponse["room"]; completedRound: number; targetWord: string }) => {
      setRoom(payload.room);
      setLastGuessFeedback(null);
      setStatusNote(`${payload.targetWord.toUpperCase()} was the word.`);
    };
    const onGuessResult = (payload: { guess: { word: string; position: number }; currentRound: number; isNewBest?: boolean }) => {
      setLastGuessFeedback({
        word: payload.guess.word,
        position: payload.guess.position,
        enteredTopTen: payload.guess.position <= 10,
        isNewBest: payload.isNewBest,
      });
      if (payload.guess.position <= 10) {
        setStatusNote(`${payload.guess.word.toUpperCase()} hit #${payload.guess.position}.`);
      }
    };
    const onNewGuess = (payload: { playerName: string; word: string; position: number; currentRound: number }) => {
      if (payload.playerName === playerName || payload.position > 10) {
        return;
      }
      setStatusNote(`${payload.playerName} hit #${payload.position}.`);
    };
    const onLeaderboardUpdate = (nextLeaderboard: DemoRoomResponse["room"]["leaderboard"]) => {
      setRoom((current) => (current ? { ...current, leaderboard: nextLeaderboard } : current));
    };
    const onGuessError = (payload: { error: string }) => {
      setError(payload.error);
    };
    const onGameEnded = () => {
      setStatusNote("Ten rounds complete. Lobby resetting for the next match.");
      void loadRoom();
    };

    socket.on("room_update", onRoomUpdate);
    socket.on("round_countdown", onRoundCountdown);
    socket.on("round_started", onRoundStarted);
    socket.on("round_ended", onRoundEnded);
    socket.on("guess_result", onGuessResult);
    socket.on("new_guess", onNewGuess);
    socket.on("leaderboard_update", onLeaderboardUpdate);
    socket.on("guess_error", onGuessError);
    socket.on("game_ended", onGameEnded);

    return () => {
      socket.off("room_update", onRoomUpdate);
      socket.off("round_countdown", onRoundCountdown);
      socket.off("round_started", onRoundStarted);
      socket.off("round_ended", onRoundEnded);
      socket.off("guess_result", onGuessResult);
      socket.off("new_guess", onNewGuess);
      socket.off("leaderboard_update", onLeaderboardUpdate);
      socket.off("guess_error", onGuessError);
      socket.off("game_ended", onGameEnded);
    };
  }, [playerName]);

  const leaderboard = useMemo(() => room?.leaderboard ?? [], [room]);
  const isDuoHost = duoLobby?.host.playerId === (playerId ?? useAuthStore.getState().user?.id);
  const hasReadyTeammate = Boolean(duoLobby?.teammate);
  const hasPendingInvite = Boolean(duoLobby?.invitedPlayer);
  const inDuoLobbyView = joinState !== "joined" && showDuoLobbyView;
  const topGuesses = useMemo(
    () => {
      const winningEntry = room?.topGuesses?.find((entry) => entry.position === 1);
      const discovered = [...(room?.topGuesses ?? [])]
        .filter((entry) => entry.position > 1)
        .sort((left, right) => left.position - right.position)
        .slice(0, 9);

      return [
        {
          position: 1,
          word: winningEntry?.discovered ? winningEntry.word : "guess the word?",
          discovered: Boolean(winningEntry?.discovered),
          playerName: winningEntry?.playerName,
        },
        ...discovered,
      ];
    },
    [room]
  );
  const topGuessSignature = useMemo(
    () => topGuesses.map((entry) => `${entry.position}:${entry.word}:${entry.playerName ?? ""}`).join("|"),
    [topGuesses]
  );
  const onlineInvitableFriends = useMemo(
    () => onlineFriends.filter((friend) => friend.id !== playerId),
    [onlineFriends, playerId]
  );

  useEffect(() => {
    if (topGuesses.length <= 1) {
      boardPulse.setValue(0);
      return;
    }

    boardPulse.setValue(0);
    Animated.sequence([
      Animated.timing(boardPulse, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(boardPulse, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [boardPulse, topGuessSignature, topGuesses.length]);

  const handleJoin = async () => {
    try {
      setJoinState("joining");
      const alias = user?.name ?? `Scout${Math.floor(Math.random() * 900 + 100)}`;
      const response = await api.joinDemoRoom(alias);
      setPlayerId(response.player.id);
      setPlayerName(response.player.username);
      setBackendIdentity(response.token, response.player);
      setJoinState("joined");
      const socket = getSocket();
      socket.auth = { token: response.token };
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("join_room", { roomCode: response.roomCode, token: response.token });
      await loadRoom();
    } catch (joinError) {
      setJoinState("idle");
      setError(joinError instanceof Error ? joinError.message : "Failed to join battle.");
    }
  };

  const handleCreateDuoLobby = async () => {
    try {
      const auth = await ensureBackendIdentity();
      const response = await api.createDuoLobby(auth.token);
      setDuoLobby(response.lobby);
      setShowDuoLobbyView(true);
      setStatusNote("Lobby ready.");
      setError(null);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create team lobby.");
    }
  };

  const handleInviteTeammate = async () => {
    if (!duoLobby || !inviteQuery.trim()) return;
    try {
      const auth = await ensureBackendIdentity();
      const response = await api.inviteToDuoLobby(auth.token, duoLobby.lobbyId, inviteQuery.trim());
      setInviteQuery("");
      setDuoLobby(response.lobby);
      setStatusNote(`Invited ${response.lobby?.invitedPlayer?.playerName ?? inviteQuery.trim()}.`);
      setError(null);
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Failed to invite teammate.");
    }
  };

  const handleInviteOnlineFriend = async (friend: FriendEntry) => {
    if (!duoLobby) return;
    try {
      const auth = await ensureBackendIdentity();
      const response = await api.inviteToDuoLobby(auth.token, duoLobby.lobbyId, friend.username);
      setDuoLobby(response.lobby);
      setStatusNote(`Invited ${friend.username}.`);
      setError(null);
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Failed to invite online friend.");
    }
  };

  const handleAcceptInvite = async (lobbyId: string) => {
    try {
      const auth = await ensureBackendIdentity();
      const response = await api.acceptDuoInvite(auth.token, lobbyId);
      setDuoLobby(response.lobby);
      setShowDuoLobbyView(true);
      setStatusNote(`Joined ${response.lobby?.host.playerName ?? "team"}.`);
      await loadDuoState(auth.token);
      setError(null);
    } catch (acceptError) {
      setError(acceptError instanceof Error ? acceptError.message : "Failed to accept team invite.");
    }
  };

  const handleDeclineInvite = async (lobbyId: string) => {
    try {
      const auth = await ensureBackendIdentity();
      await api.declineDuoInvite(auth.token, lobbyId);
      setStatusNote("Invite declined.");
      await loadDuoState(auth.token);
      setError(null);
    } catch (declineError) {
      setError(declineError instanceof Error ? declineError.message : "Failed to decline team invite.");
    }
  };

  const handleQueueDuoLobby = async () => {
    if (!duoLobby) return;
    try {
      const auth = await ensureBackendIdentity();
      const response = await api.queueDuoLobby(auth.token, duoLobby.lobbyId);
      setDuoLobby(response.lobby);
      setStatusNote(
        response.lobby?.status === "matched"
          ? "Match found."
          : "Queued."
      );
      await loadDuoState(auth.token);
      setError(null);
    } catch (queueError) {
      setError(queueError instanceof Error ? queueError.message : "Failed to queue duo lobby.");
    }
  };

  const handleLeaveDuoLobby = async () => {
    if (!duoLobby) return;
    try {
      const auth = await ensureBackendIdentity();
      const response = await api.leaveDuoLobby(auth.token, duoLobby.lobbyId);
      setDuoLobby(response.lobby);
      if (!response.lobby) {
        setShowDuoLobbyView(false);
      }
      setStatusNote("Left lobby.");
      await loadDuoState(auth.token);
      setError(null);
    } catch (leaveError) {
      setError(leaveError instanceof Error ? leaveError.message : "Failed to leave duo lobby.");
    }
  };

  const handleCancelDuoLobby = async () => {
    if (!duoLobby) return;
    try {
      const auth = await ensureBackendIdentity();
      await api.cancelDuoLobby(auth.token, duoLobby.lobbyId);
      setDuoLobby(null);
      setShowDuoLobbyView(false);
      setStatusNote("Lobby cancelled.");
      await loadDuoState(auth.token);
      setError(null);
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Failed to cancel duo lobby.");
    }
  };

  const handleClearInvite = async () => {
    if (!duoLobby) return;
    try {
      const auth = await ensureBackendIdentity();
      const response = await api.clearDuoInvite(auth.token, duoLobby.lobbyId);
      setDuoLobby(response.lobby);
      setStatusNote("Invite cleared.");
      setError(null);
    } catch (clearError) {
      setError(clearError instanceof Error ? clearError.message : "Failed to clear invite.");
    }
  };

  const handleGuess = (value: string) => {
    const socket = getSocket();
    const backendToken = useAuthStore.getState().user?.backendToken;
    const roomCode = room?.roomCode;

    if (!backendToken || joinState !== "joined" || !roomCode) {
      setError("Join the arena before guessing.");
      return;
    }

    const sendGuess = () => {
      socket.emit("submit_guess", { guess: value });
    };

    if (!socket.connected) {
      socket.auth = { token: backendToken };
      socket.connect();
      socket.once("connect", () => {
        socket.emit("subscribe_player", { token: backendToken });
        socket.emit("join_room", { roomCode, token: backendToken });
        sendGuess();
      });
    } else {
      socket.emit("subscribe_player", { token: backendToken });
      socket.emit("join_room", { roomCode, token: backendToken });
      sendGuess();
    }
    setError(null);
  };

  const nextStartCountdown = room?.nextMatchStartsAt
    ? Math.max(0, Math.ceil((new Date(room.nextMatchStartsAt).getTime() - now) / 1000))
    : null;
  const roundCountdown = room?.roundEndsAt
    ? Math.max(0, Math.ceil((new Date(room.roundEndsAt).getTime() - now) / 1000))
    : null;
  const phaseCountdown = room?.countdownEndsAt
    ? Math.max(0, Math.ceil((new Date(room.countdownEndsAt).getTime() - now) / 1000))
    : null;
  const intermissionCountdown = room?.intermissionEndsAt
    ? Math.max(0, Math.ceil((new Date(room.intermissionEndsAt).getTime() - now) / 1000))
    : null;
  const isRoundActive = room?.phase === "active";
  const liveStatusLabel =
    room?.phase === "active"
      ? `${roundCountdown ?? 0}s left`
      : room?.phase === "countdown"
      ? `${phaseCountdown ?? 0}`
      : room?.phase === "intermission"
      ? `${intermissionCountdown ?? 0}s`
      : nextStartCountdown !== null
      ? `${nextStartCountdown}s`
      : "loading";
  const phaseLabel =
    room?.phase === "active"
      ? "Round live"
      : room?.phase === "countdown"
      ? "Starting"
      : room?.phase === "intermission"
      ? "Round over"
      : "Waiting";
  const isArenaView = joinState === "joined";

  if (isArenaView) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.arenaContent, { paddingBottom: tabBarHeight + Spacing.xl }]}
      >
        <LinearGradient colors={["#10283D", "#183A4A", "#A84A30"]} style={styles.arenaHeader}>
          <View style={styles.arenaHeaderTop}>
            <View style={styles.arenaHeaderCopy}>
              <Text style={styles.arenaTitle}>Guess The Right Word</Text>
              <Text style={styles.arenaSubtitle}>{playerName}</Text>
            </View>
            <View style={styles.roundBadge}>
              <Text style={styles.roundBadgeLabel}>Round</Text>
              <Text style={styles.roundBadgeValue}>
                {room?.currentRound ?? 0}/{room?.totalRounds ?? 10}
              </Text>
            </View>
          </View>
          <View style={styles.arenaStatsRow}>
            <View style={styles.arenaStatPill}>
              <Text style={styles.arenaStatLabel}>Word</Text>
              <Text style={styles.arenaStatValue}>
                {room?.phase === "intermission" && room?.lastRoundWinner?.word
                  ? room.lastRoundWinner.word.toUpperCase()
                  : "???"}
              </Text>
            </View>
            <View style={styles.arenaStatPill}>
              <Text style={styles.arenaStatLabel}>Clock</Text>
              <Text style={styles.arenaStatValue}>{liveStatusLabel}</Text>
            </View>
          </View>
          <View style={styles.compactStatusRow}>
            <View style={styles.phaseChip}>
              <Text style={styles.phaseChipText}>{phaseLabel}</Text>
            </View>
            {lastGuessFeedback ? (
              <Text style={styles.personalStatus}>Best this round: #{lastGuessFeedback.position}</Text>
            ) : null}
          </View>
          {statusNote ? <Text style={styles.arenaStatus}>{statusNote}</Text> : null}
          {error ? <Text style={styles.arenaError}>{error}</Text> : null}
        </LinearGradient>

        <View style={styles.section}>
          {room?.phase === "intermission" && room.lastRoundWinner ? (
            <LinearGradient colors={["#D96C47", "#F4C95D"]} style={styles.winnerBanner}>
              <Text style={styles.winnerLabel}>Round won by {room.lastRoundWinner.playerName}</Text>
              <Text style={styles.winnerWord}>{(room.lastRoundWinner.word || "").toUpperCase()}</Text>
              <View style={styles.intermissionScoreRow}>
                {leaderboard.slice(0, 2).map((entry) => (
                  <View key={entry.teamId} style={styles.intermissionScoreCard}>
                    <Text style={styles.intermissionScoreName}>{entry.teamName}</Text>
                    <Text style={styles.intermissionScoreValue}>{entry.points}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          ) : null}

          <Animated.View
            style={[
              styles.topGuessBoard,
              {
                transform: [
                  {
                    scale: boardPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.015],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.boardHeader}>
              <Text style={styles.boardTitle}>Top 10 Guesses</Text>
              <Text style={styles.boardMeta}>
                {room?.phase === "active"
                  ? "Live"
                  : room?.phase === "countdown"
                  ? "Starting"
                  : room?.phase === "intermission"
                  ? "Scoring"
                  : "Waiting"}
              </Text>
            </View>
            {topGuesses.length === 1 ? (
              <View style={styles.emptyGuessState}>
                <Text style={styles.emptyGuessTitle}>No guesses yet</Text>
                <Text style={styles.emptyGuessMeta}>Be first to break into the top 10.</Text>
              </View>
            ) : null}
            {topGuesses.map((entry, index) => {
              const isPrimarySlot = entry.position === 1;
              const compactMeta =
                entry.playerName ? `found by ${entry.playerName}` : "open slot";

              return (
                <View
                  key={`${entry.position}-${entry.word}-${index}`}
                  style={[styles.topGuessRow, !isPrimarySlot && styles.topGuessRowCompact]}
                >
                  <View style={[styles.topGuessPosition, !isPrimarySlot && styles.topGuessPositionCompact]}>
                    <Text style={styles.topGuessPositionText}>#{entry.position}</Text>
                  </View>
                  <View style={styles.topGuessBody}>
                    {isPrimarySlot ? (
                      <>
                        <Text style={styles.topGuessWord}>{entry.word.toUpperCase()}</Text>
                        <Text style={styles.topGuessMeta}>
                          {entry.position === 1 && !entry.discovered
                            ? "Hidden until solved."
                            : entry.playerName
                            ? `Found by ${entry.playerName}`
                            : "Open slot."}
                        </Text>
                      </>
                    ) : (
                      <Text numberOfLines={1} style={styles.topGuessCompactLine}>
                        <Text style={styles.topGuessWordCompact}>{entry.word.toUpperCase()}</Text>
                        <Text style={styles.topGuessCompactMeta}>  •  {compactMeta}</Text>
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </Animated.View>

          {lastGuessFeedback ? (
            <View style={styles.lastGuessCard}>
              <Text style={styles.lastGuessLabel}>Your last guess</Text>
              <View style={styles.lastGuessRow}>
                <Text style={styles.lastGuessWord}>{lastGuessFeedback.word.toUpperCase()}</Text>
                <Text style={styles.lastGuessRank}>#{lastGuessFeedback.position}</Text>
              </View>
              <Text style={styles.lastGuessMeta}>
                {lastGuessFeedback.enteredTopTen
                  ? "Made the live top 10."
                  : lastGuessFeedback.isNewBest
                  ? "New personal best."
                  : "Not in the top 10 yet."}
              </Text>
            </View>
          ) : null}

          <WordInput
            onSubmit={handleGuess}
            placeholder="Guess any word"
            helperText={
              error ??
              (isRoundActive ? "One guess every 3 seconds." : room?.phase === "countdown" ? "3, 2, 1..." : room?.phase === "intermission" ? "Next round soon." : "Waiting for the next round.")
            }
            disabled={!isRoundActive || joinState !== "joined"}
            submitLabel="Send Guess"
            autoFocus={isRoundActive && joinState === "joined"}
          />
        </View>
      </ScrollView>
    );
  }

  if (inDuoLobbyView) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + Spacing.xxl }]}
      >
        <LinearGradient colors={["#183A4A", "#A84A30", "#F4C95D"]} style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>Duo Queue</Text>
              <Text style={styles.subtitle}>
                Invite one friend and queue together.
              </Text>
            </View>
            <GameMascot size={90} />
          </View>
        </LinearGradient>

        <View style={styles.section}>
          {duoLobby ? (
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>{duoLobby.host.playerName}&apos;s Duo Lobby</Text>
              <Text style={styles.cardText}>
                {duoLobby.status === "queued"
                  ? "Finding another team."
                  : duoLobby.status === "matched"
                  ? "Match found."
                  : "Add one teammate to start."}
              </Text>

              <View style={styles.teamRosterCard}>
                <View style={styles.teamRosterRow}>
                  <Avatar
                    name={duoLobby.host.playerName}
                    size={54}
                    avatarId={
                      duoLobby.host.playerId === playerId
                        ? currentAvatarId ?? getAvatarIdForKey(duoLobby.host.playerId)
                        : getAvatarIdForKey(duoLobby.host.playerId)
                    }
                  />
                  <View style={styles.teamRosterCopy}>
                    <Text style={styles.teamRosterName}>{duoLobby.host.playerName}</Text>
                    <Text style={styles.teamRosterMeta}>Host</Text>
                  </View>
                </View>

                {duoLobby.teammate ? (
                  <View style={styles.teamRosterRow}>
                    <Avatar
                      name={duoLobby.teammate.playerName}
                      size={54}
                      avatarId={
                        duoLobby.teammate.playerId === playerId
                          ? currentAvatarId ?? getAvatarIdForKey(duoLobby.teammate.playerId)
                          : getAvatarIdForKey(duoLobby.teammate.playerId)
                      }
                    />
                    <View style={styles.teamRosterCopy}>
                      <Text style={styles.teamRosterName}>{duoLobby.teammate.playerName}</Text>
                      <Text style={styles.teamRosterMeta}>Teammate</Text>
                    </View>
                  </View>
                ) : duoLobby.invitedPlayer ? (
                  <View style={styles.teamRosterRow}>
                    <Avatar
                      name={duoLobby.invitedPlayer.playerName}
                      size={54}
                      avatarId={getAvatarIdForKey(duoLobby.invitedPlayer.playerId)}
                    />
                    <View style={styles.teamRosterCopy}>
                    <Text style={styles.teamRosterName}>{duoLobby.invitedPlayer.playerName}</Text>
                      <Text style={styles.teamRosterMeta}>Invited</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.teamRosterEmpty}>
                    <Text style={styles.teamRosterEmptyText}>Waiting for teammate.</Text>
                  </View>
                )}
              </View>

              <View style={styles.lobbyBadgeRow}>
                <View style={styles.lobbyBadge}>
                  <Text style={styles.lobbyBadgeLabel}>Status</Text>
                  <Text style={styles.lobbyBadgeValue}>{duoLobby.status}</Text>
                </View>
                <View style={styles.lobbyBadge}>
                  <Text style={styles.lobbyBadgeLabel}>Mode</Text>
                  <Text style={styles.lobbyBadgeValue}>Duo queue</Text>
                </View>
              </View>

              {isDuoHost && !duoLobby.teammate && (
                <>
                  <TextInput
                    value={inviteQuery}
                    onChangeText={setInviteQuery}
                    placeholder="Invite by username or player ID"
                    placeholderTextColor={Colors.muted}
                    style={styles.teamInput}
                  />
                  <Button title="Invite Teammate" onPress={() => void handleInviteTeammate()} />
                  {hasPendingInvite ? (
                    <Button title="Clear Pending Invite" variant="secondary" onPress={() => void handleClearInvite()} />
                  ) : null}
                  {onlineInvitableFriends.length > 0 ? (
                    <View style={styles.onlineFriendsWrap}>
                      <Text style={styles.onlineFriendsTitle}>Online friends</Text>
                      <View style={styles.onlineFriendList}>
                        {onlineInvitableFriends.map((friend) => (
                          <Pressable
                            key={friend.id}
                            onPress={() => void handleInviteOnlineFriend(friend)}
                            style={styles.onlineFriendChip}
                          >
                            <View style={styles.onlineDot} />
                            <Avatar name={friend.username} size={28} avatarId={getAvatarIdForKey(friend.id)} />
                            <Text style={styles.onlineFriendName}>{friend.username}</Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  ) : null}
                </>
              )}

              {isDuoHost && duoLobby.teammate && duoLobby.status !== "queued" && duoLobby.status !== "matched" ? (
                <Button title="Join Duo Queue" onPress={() => void handleQueueDuoLobby()} />
              ) : null}

              <View style={styles.lobbyActionRow}>
                <Button title="Back to Queue Hub" variant="secondary" onPress={() => setShowDuoLobbyView(false)} />
                {isDuoHost ? (
                  <Button title="Cancel Lobby" variant="ghost" onPress={() => void handleCancelDuoLobby()} />
                ) : (
                  <Button title="Leave Lobby" variant="ghost" onPress={() => void handleLeaveDuoLobby()} />
                )}
              </View>

              {statusNote ? <Text style={styles.statusText}>{statusNote}</Text> : null}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </Card>
          ) : null}

          {duoInvites.length > 0 ? (
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Incoming Invites</Text>
              <Text style={styles.cardText}>Join a friend or pass.</Text>
              {duoInvites.map((invite) => (
                <View key={invite.lobbyId} style={styles.inviteRow}>
                  <Avatar name={invite.host.playerName} size={44} avatarId={getAvatarIdForKey(invite.host.playerId)} />
                  <View style={styles.inviteCopy}>
                    <Text style={styles.inviteHost}>{invite.host.playerName}</Text>
                    <Text style={styles.inviteMeta}>invited you</Text>
                  </View>
                  <View style={styles.inviteButtonRow}>
                    <Button title="Decline" variant="secondary" onPress={() => void handleDeclineInvite(invite.lobbyId)} />
                    <Button title="Accept" onPress={() => void handleAcceptInvite(invite.lobbyId)} />
                  </View>
                </View>
              ))}
            </Card>
          ) : null}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + Spacing.xxl }]}
    >
      <LinearGradient colors={["#183A4A", "#A84A30", "#F4C95D"]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Battle Arena</Text>
            <Text style={styles.subtitle}>Team up and chase the closest word.</Text>
          </View>
          <GameMascot size={90} />
        </View>

        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatLabel}>Room</Text>
            <Text style={styles.headerStatValue}>{room?.roomCode ?? "..."}</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatLabel}>Players</Text>
            <Text style={styles.headerStatValue}>{room?.playerCount ?? 0}</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatLabel}>
              {room?.phase === "active"
                ? "Round"
                : room?.phase === "countdown"
                ? "Starts in"
                : room?.phase === "intermission"
                ? "Next in"
                : "Starts in"}
            </Text>
            <Text style={styles.headerStatValue}>
              {room?.phase === "active"
                ? `${room.currentRound}/${room.totalRounds}`
                : liveStatusLabel}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Arena Leaders</Text>
          {leaderboard.length > 0 ? (
            leaderboard.map((team) => (
              <View key={`${team.teamId}-${team.rank}`} style={styles.leaderRow}>
                <Text style={styles.leaderRank}>#{team.rank}</Text>
                <View style={styles.leaderAvatarStack}>
                  {team.players.slice(0, 2).map((player, index) => (
                    <Avatar
                      key={`${team.teamId}-${player.playerId}`}
                      name={player.playerName}
                      size={index === 0 ? 34 : 30}
                      avatarId={
                        player.playerId === playerId
                          ? currentAvatarId ?? getAvatarIdForKey(player.playerId)
                          : getAvatarIdForKey(player.playerId)
                      }
                      style={index === 1 ? styles.leaderAvatarOverlap : undefined}
                    />
                  ))}
                </View>
                <View style={styles.leaderNameWrap}>
                  <Text style={styles.leaderName}>{team.teamName}</Text>
                  <Text style={styles.leaderRoster}>
                    {team.players.map((player) => player.playerName).join(" + ")}
                  </Text>
                </View>
                <View style={styles.leaderScoreWrap}>
                  <Text style={styles.leaderScore}>{team.points} pts</Text>
                  <Text style={styles.leaderMeta}>
                    {team.roundBestPosition ? `Best this round #${team.roundBestPosition}` : "No top 10 yet"}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.cardText}>No scores yet.</Text>
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Solo Queue</Text>
          <Text style={styles.cardText}>Join solo and get paired.</Text>
          <Image source={battleArenaHero} style={styles.joinHero} resizeMode="cover" />
          <Text style={styles.queueMeta}>
            {room?.readyTeamCount ?? 0} teams ready • {room?.playerCount ?? 0}/{room?.maxPlayers ?? 0} players queued
          </Text>
          <Button
            title={joinState === "joining" ? "Joining..." : "Join Solo Queue"}
            onPress={() => void handleJoin()}
            style={styles.button}
            disabled={hasReadyTeammate}
          />
          {hasReadyTeammate ? <Text style={styles.queueLockText}>Solo queue is off while your duo is ready.</Text> : null}
          <Button title="Refresh Arena" variant="secondary" onPress={() => void loadRoom()} />
          {joinState === "joining" ? <ActivityIndicator color={Colors.primaryDark} /> : null}
          {statusNote ? <Text style={styles.statusText}>{statusNote}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Card>
      </View>

      <View style={styles.section}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Duo Queue</Text>
          <Text style={styles.cardText}>Bring a friend and queue as a pair.</Text>
          <View style={styles.teamLobbyCard}>
            <Text style={styles.teamLobbyTitle}>
              {duoLobby
                ? `${duoLobby.host.playerName}'s lobby is ready`
                : duoInvites.length > 0
                ? `You have ${duoInvites.length} invite${duoInvites.length > 1 ? "s" : ""}`
                : "Start a duo lobby"}
            </Text>
            <Text style={styles.teamLobbyMeta}>
              {duoLobby
                ? duoLobby.teammate
                  ? `${duoLobby.host.playerName} + ${duoLobby.teammate.playerName}`
                  : duoLobby.invitedPlayer
                  ? `Invite pending for ${duoLobby.invitedPlayer.playerName}`
                  : "Waiting for teammate"
                : duoInvites.length > 0
                ? "Open your invites."
                : "Create a lobby and invite a friend."}
            </Text>
            <Button
              title={duoLobby ? "Open Duo Lobby" : duoInvites.length > 0 ? "View Invites" : "Create Duo Lobby"}
              variant="secondary"
              onPress={() => {
                if (duoLobby || duoInvites.length > 0) {
                  setShowDuoLobbyView(true);
                } else {
                  void handleCreateDuoLobby();
                }
              }}
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  arenaContent: {
    paddingBottom: Spacing.xl,
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xxl,
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: Spacing.sm,
    color: "rgba(255,255,255,0.82)",
    fontFamily: Typography.fontFamily,
    lineHeight: 22,
  },
  headerStats: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  headerStat: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  headerStatLabel: {
    color: "rgba(255,255,255,0.76)",
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  headerStatValue: {
    marginTop: Spacing.xs,
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  arenaHeader: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  arenaHeaderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  arenaHeaderCopy: {
    flex: 1,
  },
  arenaTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xxl,
    color: "#FFFFFF",
  },
  arenaSubtitle: {
    marginTop: Spacing.sm,
    color: "rgba(255,255,255,0.82)",
    fontFamily: Typography.fontFamily,
    lineHeight: 20,
  },
  roundBadge: {
    minWidth: 78,
    borderRadius: 18,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
  },
  roundBadgeLabel: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  roundBadgeValue: {
    marginTop: 2,
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
  },
  arenaStatsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  arenaStatPill: {
    flex: 1,
    borderRadius: 18,
    padding: Spacing.md,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  arenaStatLabel: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  arenaStatValue: {
    marginTop: Spacing.xs,
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.sm,
  },
  compactStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  phaseChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  phaseChipText: {
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.sm,
  },
  personalStatus: {
    flex: 1,
    textAlign: "right",
    color: "#F9D780",
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.sm,
  },
  arenaStatus: {
    marginTop: Spacing.md,
    color: "#F9D780",
    fontFamily: Typography.fontFamilySemi,
  },
  arenaError: {
    marginTop: Spacing.sm,
    color: "#FFD2CC",
    fontFamily: Typography.fontFamilySemi,
  },
  card: {
    borderRadius: 24,
    gap: Spacing.sm,
  },
  cardTitle: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
  },
  cardText: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    lineHeight: 22,
  },
  button: {
    marginBottom: Spacing.xs,
  },
  joinHero: {
    width: "100%",
    height: 150,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  queueMeta: {
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilySemi,
  },
  queueLockText: {
    color: Colors.warning,
    fontFamily: Typography.fontFamilySemi,
    lineHeight: 20,
  },
  teamLobbyCard: {
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceMuted,
  },
  teamLobbyTitle: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.md,
  },
  teamLobbyMeta: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    lineHeight: 20,
  },
  teamLobbyStatus: {
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilySemi,
  },
  teamLobbyHint: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    lineHeight: 20,
  },
  teamInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.text,
    fontFamily: Typography.fontFamily,
  },
  onlineFriendsWrap: {
    gap: Spacing.sm,
  },
  onlineFriendsTitle: {
    color: Colors.text,
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.sm,
  },
  onlineFriendList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  onlineFriendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#FFF4EA",
    borderWidth: 1,
    borderColor: "#F2C8AF",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.success,
  },
  onlineFriendName: {
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilySemi,
  },
  inviteList: {
    gap: Spacing.sm,
  },
  inviteTitle: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.md,
  },
  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceMuted,
  },
  inviteCopy: {
    flex: 1,
  },
  inviteHost: {
    color: Colors.text,
    fontFamily: Typography.fontFamilySemi,
  },
  inviteMeta: {
    marginTop: 2,
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  joinedText: {
    color: Colors.success,
    fontFamily: Typography.fontFamilySemi,
  },
  errorText: {
    color: Colors.error,
    fontFamily: Typography.fontFamily,
  },
  statusText: {
    color: Colors.secondary,
    fontFamily: Typography.fontFamilySemi,
  },
  phaseBanner: {
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  duoStatusRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  duoStatusCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: 4,
  },
  duoStatusEyebrow: {
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.xs,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  duoStatusTitle: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.md,
  },
  duoStatusMeta: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  duoRosterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: 2,
  },
  duoStatusValue: {
    color: Colors.secondary,
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.sm,
  },
  phaseEyebrow: {
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.xs,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  phaseTitle: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
  },
  winnerBanner: {
    borderRadius: 22,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  winnerLabel: {
    color: "rgba(24,58,74,0.7)",
    fontFamily: Typography.fontFamilySemi,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: Typography.sizes.xs,
  },
  winnerName: {
    color: "#183A4A",
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
  },
  winnerWord: {
    color: "#183A4A",
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
  },
  intermissionScoreRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  intermissionScoreCard: {
    flex: 1,
    borderRadius: 18,
    padding: Spacing.md,
    backgroundColor: "rgba(255,255,255,0.32)",
  },
  intermissionScoreName: {
    color: "#183A4A",
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.sm,
  },
  intermissionScoreValue: {
    marginTop: 4,
    color: "#183A4A",
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
  },
  topGuessBoard: {
    backgroundColor: "#FFF7EE",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 22,
    padding: Spacing.sm,
    gap: 6,
  },
  boardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  streamWrap: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  boardTitle: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.md,
  },
  boardMeta: {
    color: Colors.muted,
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emptyGuessState: {
    borderRadius: 18,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    gap: 2,
  },
  emptyGuessTitle: {
    color: Colors.text,
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.sm,
  },
  emptyGuessMeta: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  lastGuessCard: {
    borderRadius: 20,
    padding: Spacing.md,
    backgroundColor: "#FFF4EA",
    borderWidth: 1,
    borderColor: "#F2C8AF",
    gap: 4,
  },
  lastGuessLabel: {
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  lastGuessRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  lastGuessWord: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    flex: 1,
  },
  lastGuessRank: {
    color: Colors.secondary,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
  },
  lastGuessMeta: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  topGuessRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topGuessRowCompact: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    minHeight: 30,
  },
  topGuessPosition: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  topGuessPositionCompact: {
    width: 28,
    height: 28,
    borderRadius: 10,
  },
  topGuessPositionText: {
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.md,
  },
  topGuessBody: {
    flex: 1,
    gap: 3,
  },
  topGuessWord: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    letterSpacing: 1,
  },
  topGuessMeta: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  topGuessMetaCompact: {
    fontSize: Typography.sizes.xs,
    lineHeight: 14,
  },
  topGuessCompactLine: {
    color: Colors.text,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  topGuessWordCompact: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.sm,
    letterSpacing: 0.4,
  },
  topGuessCompactMeta: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
  },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leaderAvatarStack: {
    width: 58,
    flexDirection: "row",
    alignItems: "center",
  },
  leaderAvatarOverlap: {
    marginLeft: -10,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  leaderNameWrap: {
    flex: 1,
  },
  leaderRank: {
    width: 28,
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilyBold,
  },
  leaderName: {
    color: Colors.text,
    fontFamily: Typography.fontFamilySemi,
  },
  leaderRoster: {
    marginTop: 2,
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
  },
  leaderScoreWrap: {
    alignItems: "flex-end",
  },
  leaderScore: {
    color: Colors.secondary,
    fontFamily: Typography.fontFamilyBold,
  },
  leaderMeta: {
    marginTop: 2,
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
  },
  teamRosterCard: {
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teamRosterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  teamRosterCopy: {
    flex: 1,
    gap: 2,
  },
  teamRosterName: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.md,
  },
  teamRosterMeta: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  teamRosterEmpty: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: Spacing.md,
    backgroundColor: Colors.card,
  },
  teamRosterEmptyText: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  lobbyBadgeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  lobbyBadge: {
    flex: 1,
    borderRadius: 18,
    padding: Spacing.md,
    backgroundColor: "#FFF7EE",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lobbyBadgeLabel: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  lobbyBadgeValue: {
    marginTop: Spacing.xs,
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilyBold,
  },
  lobbyActionRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  inviteButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
});
