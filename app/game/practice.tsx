import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { WordInput } from "../../components/game/WordInput";
import { GuessList } from "../../components/game/GuessList";
import { Card } from "../../components/ui/Card";
import { Timer } from "../../components/game/Timer";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { useGameStore } from "../../stores/gameStore";

export default function PracticeScreen() {
  const guesses = useGameStore((state) => state.guesses);
  const addGuess = useGameStore((state) => state.addGuess);
  const [rounds, setRounds] = useState(1);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#E0F2FE", "#FFFFFF"]} style={styles.header}>
        <Text style={styles.title}>Practice Mode</Text>
        <Text style={styles.subtitle}>Unlimited warmups. Go as long as you like.</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Round</Text>
          <Text style={styles.metaValue}>{rounds}</Text>
          <Timer seconds={120} />
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.inputCard}>
          <WordInput
            onSubmit={(value) => {
              addGuess(value, 0.2 + Math.random() * 0.8);
              setRounds((prev) => prev + 1);
            }}
            placeholder="Try any word"
          />
          <Text style={styles.helper}>Practice guesses refresh instantly.</Text>
        </Card>
        <GuessList guesses={guesses} />
      </ScrollView>
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
  metaRow: {
    marginTop: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaLabel: {
    color: Colors.muted,
    fontFamily: Typography.fontFamilyMedium,
  },
  metaValue: {
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
