import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { WordInput } from "../../components/game/WordInput";
import { GuessList } from "../../components/game/GuessList";
import { Confetti } from "../../components/animations/Confetti";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { useGameStore } from "../../stores/gameStore";

export default function DailyChallengeScreen() {
  const guesses = useGameStore((state) => state.guesses);
  const addGuess = useGameStore((state) => state.addGuess);
  const reset = useGameStore((state) => state.reset);
  const [showConfetti, setShowConfetti] = useState(false);

  const bestGuess = useMemo(
    () => guesses.reduce((best, guess) => (guess.similarity > best ? guess.similarity : best), 0),
    [guesses]
  );

  const handleSubmit = (value: string) => {
    const similarity = Math.min(1, 0.2 + Math.random() * 0.8);
    addGuess(value, similarity);
    if (similarity >= 0.95) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#EEF2FF", "#FFFFFF"]} style={styles.header}>
        <Text style={styles.title}>Daily Challenge</Text>
        <Text style={styles.subtitle}>Warm glow from fire. 5 letters.</Text>
        <View style={styles.stats}>
          <Text style={styles.statLabel}>Best similarity</Text>
          <Text style={styles.statValue}>{Math.round(bestGuess * 100)}%</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.inputCard}>
          <WordInput onSubmit={handleSubmit} />
          <Text style={styles.helper}>Higher is hotter. Find the perfect green.</Text>
        </Card>

        <GuessList guesses={guesses} />

        <Button title="Reset" variant="ghost" onPress={reset} />
      </ScrollView>
      <Confetti visible={showConfetti} />
    </View>
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
  stats: {
    marginTop: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statLabel: {
    color: Colors.muted,
    fontFamily: Typography.fontFamilyMedium,
  },
  statValue: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: Colors.primaryDark,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  inputCard: {
    gap: Spacing.sm,
  },
  helper: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
});
