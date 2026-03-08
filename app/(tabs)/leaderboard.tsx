import React, { useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { Shimmer } from "../../components/animations/Shimmer";
import { Button } from "../../components/ui/Button";
import { LeaderboardItem } from "../../components/ui/LeaderboardItem";
import { surfaceShadow } from "../../components/ui/surfaceStyles";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { api } from "../../services/api";

const tabs = ["lifetime", "monthly", "friends"] as const;

type TabKey = (typeof tabs)[number];

const leaderboardHero = require("../../assets/branding/leaderboard-hero.png");

export default function LeaderboardScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [active, setActive] = useState<TabKey>("lifetime");
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["leaderboards"],
    queryFn: api.getLeaderboards,
  });

  const list = data?.[active] ?? [];
  const leader = list[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + Spacing.xxl }]}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
    >
      <LinearGradient colors={["#17313A", "#245A63", "#D96C47"]} style={styles.header}>
        <Text style={styles.eyebrow}>Leaderboards</Text>
        <Text style={styles.title}>Competitive Pulse</Text>
        <Text style={styles.subtitle}>
          Track who is hottest across the global, seasonal, and social ladders.
        </Text>

        <Image source={leaderboardHero} style={styles.heroImage} resizeMode="cover" />

        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <Button
              key={tab}
              title={tab.charAt(0).toUpperCase() + tab.slice(1)}
              variant={active === tab ? "primary" : "secondary"}
              onPress={() => setActive(tab)}
              style={styles.tabButton}
            />
          ))}
        </View>
      </LinearGradient>

      {leader ? (
        <View style={styles.spotlight}>
          <Text style={styles.spotlightLabel}>Current leader</Text>
          <Text style={styles.spotlightName}>{leader.name}</Text>
          <Text style={styles.spotlightScore}>{leader.score.toLocaleString()} points</Text>
        </View>
      ) : null}

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
  content: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  eyebrow: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: Typography.fontFamilySemi,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontSize: Typography.sizes.sm,
  },
  title: {
    marginTop: Spacing.xs,
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xxl,
  },
  subtitle: {
    marginTop: Spacing.sm,
    color: "rgba(255,255,255,0.82)",
    fontFamily: Typography.fontFamily,
    lineHeight: 22,
    maxWidth: 290,
  },
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  heroImage: {
    width: "100%",
    height: 180,
    marginTop: Spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  tabButton: {
    flexGrow: 1,
  },
  spotlight: {
    marginTop: -18,
    marginHorizontal: Spacing.lg,
    backgroundColor: "#FFF7EB",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F0D5A6",
    padding: Spacing.lg,
    ...surfaceShadow,
  },
  spotlightLabel: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  spotlightName: {
    marginTop: Spacing.xs,
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
  },
  spotlightScore: {
    marginTop: Spacing.xs,
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilySemi,
  },
  list: {
    padding: Spacing.lg,
  },
  skeleton: {
    height: 82,
    borderRadius: 22,
    marginBottom: 12,
  },
});
