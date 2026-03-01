import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { api } from "../../services/api";
import { useAuthStore } from "../../stores/authStore";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user) || {
    name: "Player One",
    level: 8,
    streak: 5,
  };
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: api.getProfileStats,
  });

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#ECFEFF", "#FFFFFF"]} style={styles.header}>
        <View style={styles.headerRow}>
          <Avatar name={user.name} size={64} />
          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.level}>Level {user.level}</Text>
          </View>
        </View>
        <View style={styles.streak}>
          <Text style={styles.streakLabel}>Current streak</Text>
          <Text style={styles.streakValue}>{user.streak} days</Text>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Games</Text>
            <Text style={styles.statValue}>{data?.gamesPlayed ?? 0}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Win rate</Text>
            <Text style={styles.statValue}>
              {Math.round((data?.winRate ?? 0) * 100)}%
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Best streak</Text>
            <Text style={styles.statValue}>{data?.bestStreak ?? 0}</Text>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.badges}>
          <Badge label="Hot Streak" color="#F97316" />
          <Badge label="Top 10%" color="#6366F1" />
          <Badge label="Perfect 5" color="#22C55E" />
        </View>
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
    padding: Spacing.xl,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  name: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
  },
  level: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  streak: {
    marginTop: Spacing.lg,
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    borderRadius: 12,
    padding: Spacing.md,
  },
  streakLabel: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  streakValue: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: Colors.primaryDark,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    gap: Spacing.md,
  },
  statCard: {
    gap: Spacing.xs,
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
});
