import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import { LeaderboardItem } from "../../components/ui/LeaderboardItem";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { api } from "../../services/api";
import { Shimmer } from "../../components/animations/Shimmer";

const tabs = ["lifetime", "monthly", "friends"] as const;

type TabKey = (typeof tabs)[number];

export default function LeaderboardScreen() {
  const [active, setActive] = useState<TabKey>("lifetime");
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["leaderboards"],
    queryFn: api.getLeaderboards,
  });

  const list = data?.[active] ?? [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
    >
      <LinearGradient colors={["#F5F3FF", "#FFFFFF"]} style={styles.header}>
        <Text style={styles.title}>Leaderboards</Text>
        <Text style={styles.subtitle}>Track your climb across seasons.</Text>
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <Button
              key={tab}
              title={tab.charAt(0).toUpperCase() + tab.slice(1)}
              variant={active === tab ? "primary" : "ghost"}
              onPress={() => setActive(tab)}
              style={styles.tabButton}
            />
          ))}
        </View>
      </LinearGradient>

      <View style={styles.list}>
        {isFetching && list.length === 0 ? (
          <>
            <Shimmer style={styles.skeleton} />
            <Shimmer style={styles.skeleton} />
            <Shimmer style={styles.skeleton} />
          </>
        ) : (
          list.map((entry) => <LeaderboardItem key={entry.id} entry={entry} />)
        )}
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
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
    color: Colors.text,
  },
  subtitle: {
    marginTop: Spacing.sm,
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  tabButton: {
    flexGrow: 1,
  },
  list: {
    padding: Spacing.lg,
  },
  skeleton: {
    height: 72,
    borderRadius: 12,
    marginBottom: 12,
  },
});
