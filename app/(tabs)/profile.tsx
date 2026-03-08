import React, { useEffect, useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { avatarOptions } from "../../constants/avatarOptions";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { api, FriendEntry } from "../../services/api";
import { gameCenter } from "../../services/gameCenter";
import { useAuthStore } from "../../stores/authStore";
import { useGameStore } from "../../stores/gameStore";

const friendsHero = require("../../assets/branding/profile-friends-hero.png");

export default function ProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const user = useAuthStore((state) => state.user) || {
    id: "guest-profile",
    name: "Player One",
    avatarId: "fox",
    level: 1,
    streak: 0,
    backendToken: undefined,
  };
  const setAvatar = useAuthStore((state) => state.setAvatar);
  const stats = useGameStore((state) => state.stats);
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [friendQuery, setFriendQuery] = useState("");
  const [friendError, setFriendError] = useState<string | null>(null);
  const [gameCenterStatus, setGameCenterStatus] = useState<string | null>(null);

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  const loadFriends = async () => {
    if (!user.backendToken) return;
    try {
      const response = await api.getFriends(user.backendToken);
      setFriends(response.friends);
      setFriendError(null);
    } catch (error) {
      setFriendError(error instanceof Error ? error.message : "Failed to load friends.");
    }
  };

  useEffect(() => {
    if (!user.backendToken) return;
    void api
      .getFriends(user.backendToken)
      .then((response) => {
        setFriends(response.friends);
        setFriendError(null);
      })
      .catch((error: unknown) => {
        setFriendError(error instanceof Error ? error.message : "Failed to load friends.");
      });
  }, [user.backendToken]);

  const handleAddFriend = async () => {
    if (!user.backendToken || !friendQuery.trim()) return;
    try {
      await api.addFriend(user.backendToken, friendQuery.trim());
      setFriendQuery("");
      await loadFriends();
    } catch (error) {
      setFriendError(error instanceof Error ? error.message : "Failed to add friend.");
    }
  };

  const handleGameCenterSync = async () => {
    if (!user.backendToken) {
      setFriendError("Sign in before syncing Game Center.");
      return;
    }

    if (!gameCenter.isSupported()) {
      setGameCenterStatus("Game Center sync is only available on iOS.");
      return;
    }

    try {
      const result = await gameCenter.syncFriends(user.backendToken);
      setGameCenterStatus(
        `Synced ${result.synced.imported.length} Game Center friends for ${result.player.alias || result.player.displayName}.`
      );
      await loadFriends();
    } catch (error) {
      setGameCenterStatus(error instanceof Error ? error.message : "Game Center sync failed.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: tabBarHeight + Spacing.xxl }}>
      <LinearGradient colors={["#183A4A", "#A84A30", "#F4C95D"]} style={styles.header}>
        <View style={styles.headerRow}>
          <Avatar name={user.name} avatarId={user.avatarId} size={68} style={styles.profileAvatar} />
          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.level}>Level {user.level}</Text>
          </View>
        </View>
        <View style={styles.streak}>
          <Text style={styles.streakLabel}>Current streak</Text>
          <Text style={styles.streakValue}>{stats.currentStreak} wins</Text>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player Icon</Text>
        <Card style={styles.avatarCard}>
          <Text style={styles.cardHelp}>
            Pick from the new animal roster. Every icon follows the same soft storybook mascot style as the dachshund.
          </Text>
          <View style={styles.avatarGrid}>
            {avatarOptions.map((option) => {
              const isSelected = option.id === user.avatarId;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => setAvatar(option.id)}
                  style={[styles.avatarOption, isSelected && styles.avatarOptionSelected]}
                >
                  <Avatar name={option.label} source={option.source} size={56} />
                  <Text style={[styles.avatarLabel, isSelected && styles.avatarLabelSelected]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Games</Text>
            <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Win rate</Text>
            <Text style={styles.statValue}>{winRate}%</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Best streak</Text>
            <Text style={styles.statValue}>{stats.bestStreak}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Total guesses</Text>
            <Text style={styles.statValue}>{stats.totalGuesses}</Text>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Milestones</Text>
        <View style={styles.badges}>
          <Badge label="Daily Hunter" color="#0EA5E9" />
          <Badge label="Perfect Read" color={Colors.success} />
          <Badge label="Win Streak" color={Colors.primary} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends</Text>
        <Card style={styles.friendCard}>
          <Image source={friendsHero} style={styles.friendHero} resizeMode="cover" />
          <Text style={styles.friendHelp}>
            Add friends by player ID, username, or wallet address. On iOS, Game Center friends can be imported into the same list.
          </Text>
          <TextInput
            value={friendQuery}
            onChangeText={setFriendQuery}
            placeholder="Player ID or username"
            placeholderTextColor={Colors.muted}
            style={styles.friendInput}
          />
          <Button title="Add Friend" onPress={() => void handleAddFriend()} />
          <Button title="Game Center Sync" variant="secondary" onPress={() => void handleGameCenterSync()} />
          {friendError ? <Text style={styles.friendError}>{friendError}</Text> : null}
          {gameCenterStatus ? <Text style={styles.friendStatus}>{gameCenterStatus}</Text> : null}
          <View style={styles.friendList}>
            {friends.length > 0 ? (
              friends.map((friend) => (
                <View key={friend.id} style={styles.friendRow}>
                  <Text style={styles.friendName}>{friend.username}</Text>
                  <Text style={styles.friendMeta}>{friend.id}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.friendEmpty}>
                {user.backendToken ? "No friends added yet." : "Sign in to unlock backend friends."}
              </Text>
            )}
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
  header: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  profileAvatar: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  name: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: "#FFFFFF",
  },
  level: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: Typography.fontFamily,
  },
  streak: {
    marginTop: Spacing.lg,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    padding: Spacing.md,
  },
  streakLabel: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: Typography.fontFamily,
  },
  streakValue: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: "#FFFFFF",
    marginTop: Spacing.xs,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  avatarCard: {
    gap: Spacing.md,
  },
  cardHelp: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    lineHeight: 21,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  avatarOption: {
    width: "22%",
    minWidth: 72,
    alignItems: "center",
    gap: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: Colors.surfaceMuted,
  },
  avatarOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#FFF4EA",
  },
  avatarLabel: {
    color: Colors.text,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    textAlign: "center",
  },
  avatarLabelSelected: {
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilySemi,
  },
  statsGrid: {
    gap: Spacing.md,
  },
  statCard: {
    gap: Spacing.xs,
    borderRadius: 22,
  },
  statLabel: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  statValue: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  friendCard: {
    gap: Spacing.sm,
  },
  friendHero: {
    width: "100%",
    height: 168,
    borderRadius: 20,
  },
  friendHelp: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    lineHeight: 22,
  },
  friendInput: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    color: Colors.text,
    fontFamily: Typography.fontFamily,
  },
  friendError: {
    color: Colors.error,
    fontFamily: Typography.fontFamily,
  },
  friendStatus: {
    color: Colors.secondary,
    fontFamily: Typography.fontFamily,
    lineHeight: 20,
  },
  friendList: {
    gap: Spacing.sm,
  },
  friendRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceMuted,
  },
  friendName: {
    color: Colors.text,
    fontFamily: Typography.fontFamilySemi,
  },
  friendMeta: {
    marginTop: Spacing.xs,
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  friendEmpty: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
});
