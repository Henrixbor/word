import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GameMascot } from "../../components/branding/GameMascot";
import { GuessList } from "../../components/game/GuessList";
import { Timer } from "../../components/game/Timer";
import { WordInput } from "../../components/game/WordInput";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { useGameStore } from "../../stores/gameStore";

export default function PracticeScreen() {
  const session = useGameStore((state) => state.practiceSession);
  const submitGuess = useGameStore((state) => state.submitGuess);
  const startPractice = useGameStore((state) => state.startPractice);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  React.useEffect(() => {
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
    const result = submitGuess("practice", value);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#082F49", "#0F766E", "#34D399"]} style={styles.hero}>
        <Text style={styles.eyebrow}>Practice Lab</Text>
        <View style={styles.heroHeader}>
          <View style={styles.heroCopy}>
            <Text style={styles.title}>{session.theme} Drill</Text>
            <Text style={styles.subtitle}>{session.clue}</Text>
          </View>
          <GameMascot size={82} />
        </View>
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Best rank</Text>
            <Text style={styles.metricValue}>{bestRankLabel}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Round clock</Text>
            <Timer seconds={session.maxAttempts * 30} color="#FFFFFF" />
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Cooldown</Text>
            <Text style={styles.metricValue}>{cooldownSeconds > 0 ? `${cooldownSeconds}s` : "Ready"}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.surface}>
          <Text style={styles.sectionTitle}>Rapid-fire guessing</Text>
          <WordInput
            onSubmit={handleSubmit}
            placeholder={`${session.answer.length} letters`}
            helperText={error ?? (cooldownSeconds > 0 ? `Hold for ${cooldownSeconds}s. ${session.lastMessage}` : session.lastMessage)}
            disabled={session.status !== "active" || cooldownSeconds > 0}
            submitLabel="Fire"
          />
          <View style={styles.buttonRow}>
            <Button title="Next Puzzle" onPress={startPractice} />
            <Button title="Restart" variant="ghost" onPress={startPractice} />
          </View>
        </Card>

        <Card style={styles.surface}>
          <View style={styles.summaryHeader}>
            <Text style={styles.sectionTitle}>Session Readout</Text>
            <Text style={styles.score}>{session.score} pts</Text>
          </View>
          <Text style={styles.summaryText}>Attempts used: {session.guesses.length}</Text>
          <Text style={styles.summaryText}>Best closeness: {bestRankLabel}</Text>
          <Text style={styles.summaryText}>Pace limit: 1 guess every 3 seconds</Text>
          <Text style={styles.summaryText}>
            State: {session.status === "active" ? "Sharpening" : session.status.toUpperCase()}
          </Text>
          {session.status !== "active" ? (
            <Text style={styles.answerText}>Answer: {session.answer}</Text>
          ) : null}
        </Card>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Attempt Log</Text>
          <GuessList guesses={session.guesses} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F6F2",
  },
  hero: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  eyebrow: {
    color: "rgba(255,255,255,0.76)",
    fontFamily: Typography.fontFamilySemi,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    fontSize: Typography.sizes.sm,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xxl,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  heroCopy: {
    flex: 1,
  },
  subtitle: {
    marginTop: Spacing.sm,
    color: "rgba(255,255,255,0.82)",
    fontFamily: Typography.fontFamily,
    maxWidth: 280,
    lineHeight: 22,
  },
  metrics: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  metric: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: Spacing.md,
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
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  score: {
    color: "#0F766E",
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
  },
  summaryText: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  answerText: {
    color: Colors.text,
    fontFamily: Typography.fontFamilySemi,
  },
  listSection: {
    gap: Spacing.xs,
    paddingBottom: Spacing.xl,
  },
});
