import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Confetti } from "../../components/animations/Confetti";
import { GameMascot } from "../../components/branding/GameMascot";
import { GuessList } from "../../components/game/GuessList";
import { WordInput } from "../../components/game/WordInput";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { useGameStore } from "../../stores/gameStore";

export default function DailyChallengeScreen() {
  const hydrateDaily = useGameStore((state) => state.hydrateDaily);
  const session = useGameStore((state) => state.dailySession);
  const stats = useGameStore((state) => state.stats);
  const submitGuess = useGameStore((state) => state.submitGuess);
  const resetMode = useGameStore((state) => state.resetMode);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    hydrateDaily();
  }, [hydrateDaily]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);

  const bestPosition = useMemo(
    () => session.guesses.reduce((best, guess) => Math.min(best, guess.position), Number.POSITIVE_INFINITY),
    [session.guesses]
  );
  const cooldownSeconds = Math.max(0, Math.ceil(((session.nextGuessAt ?? 0) - now) / 1000));
  const bestRankLabel = Number.isFinite(bestPosition) ? `#${bestPosition}` : "None";

  const handleSubmit = (value: string) => {
    const result = submitGuess("daily", value);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError(null);
    if (result.isWin) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1800);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0F172A", "#1D4ED8", "#7C3AED"]} style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.eyebrow}>Daily Challenge</Text>
            <Text style={styles.title}>{session.theme} Signal</Text>
            <Text style={styles.subtitle}>{session.clue}</Text>
          </View>
          <GameMascot size={84} />
        </View>

        <View style={styles.metrics}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Best rank</Text>
            <Text style={styles.metricValue}>{bestRankLabel}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Cooldown</Text>
            <Text style={styles.metricValue}>{cooldownSeconds > 0 ? `${cooldownSeconds}s` : "Ready"}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Streak</Text>
            <Text style={styles.metricValue}>{stats.currentStreak}</Text>
          </View>
        </View>

        <Text style={styles.flavor}>{session.flavor}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.surface}>
          <Text style={styles.sectionTitle}>Make your read</Text>
          <WordInput
            onSubmit={handleSubmit}
            placeholder={`${session.answer.length} letters`}
            helperText={
              error ??
              (session.status === "active"
                ? cooldownSeconds > 0
                  ? `Hold for ${cooldownSeconds}s. ${session.lastMessage}`
                  : session.lastMessage
                : session.status === "won"
                ? `Solved in ${session.guesses.length} guesses.`
                : `Round over. The answer was ${session.answer}.`)
            }
            disabled={session.status !== "active" || cooldownSeconds > 0}
            submitLabel={session.status === "active" ? "Lock Guess" : "Complete"}
          />
        </Card>

        <Card style={styles.surface}>
          <View style={styles.summaryRow}>
            <Text style={styles.sectionTitle}>Round Summary</Text>
            <Text style={styles.summaryScore}>{session.score} pts</Text>
          </View>
          <View style={styles.summaryMeta}>
            <Text style={styles.summaryText}>
              Status: {session.status === "active" ? "In Progress" : session.status.toUpperCase()}
            </Text>
            <Text style={styles.summaryText}>Word length: {session.answer.length}</Text>
            <Text style={styles.summaryText}>Closest guess so far: {bestRankLabel}</Text>
          </View>
          <Button title="Reset Today" variant="ghost" onPress={() => resetMode("daily")} />
        </Card>

        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Guess Feed</Text>
          <GuessList guesses={session.guesses} />
        </View>
      </ScrollView>
      <Confetti visible={showConfetti} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EEF9",
  },
  hero: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eyebrow: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: Typography.fontFamilySemi,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontSize: Typography.sizes.sm,
  },
  title: {
    marginTop: Spacing.xs,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xxl,
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: Spacing.sm,
    color: "rgba(255,255,255,0.82)",
    fontFamily: Typography.fontFamily,
    maxWidth: 260,
    lineHeight: 22,
  },
  metrics: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  metricLabel: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  metricValue: {
    marginTop: Spacing.xs,
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
  },
  flavor: {
    marginTop: Spacing.lg,
    color: "#DBEAFE",
    fontFamily: Typography.fontFamilyMedium,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  surface: {
    borderRadius: 24,
    gap: Spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryScore: {
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
  },
  summaryMeta: {
    gap: Spacing.xs,
  },
  summaryText: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  listSection: {
    gap: Spacing.xs,
    paddingBottom: Spacing.xl,
  },
  listTitle: {
    color: Colors.text,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
  },
});
