import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GuessRecord } from "../../lib/gameEngine";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { SimilarityBar } from "./SimilarityBar";

type GuessListProps = {
  guesses: GuessRecord[];
};

export const GuessList: React.FC<GuessListProps> = ({ guesses }) => {
  const formatOrdinal = (value: number) => {
    const mod10 = value % 10;
    const mod100 = value % 100;
    if (mod10 === 1 && mod100 !== 11) return `${value}st`;
    if (mod10 === 2 && mod100 !== 12) return `${value}nd`;
    if (mod10 === 3 && mod100 !== 13) return `${value}rd`;
    return `${value}th`;
  };

  return (
    <View style={styles.container}>
      {guesses.length === 0 ? (
        <Text style={styles.empty}>No guesses yet. Start guessing!</Text>
      ) : (
        guesses.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowTop}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.score}>#{item.position}</Text>
            </View>
            <View style={styles.bar}>
              <SimilarityBar similarity={item.similarity} />
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>
                {formatOrdinal(item.position)} closest • {item.exactMatches} exact • {item.presentMatches} letters
              </Text>
              <Text style={[styles.badge, styles[item.temperature]]}>{item.temperature}</Text>
            </View>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  row: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  word: {
    flex: 1,
    fontFamily: Typography.fontFamilySemi,
    color: Colors.text,
    letterSpacing: 1.3,
  },
  bar: {
    width: "100%",
  },
  score: {
    width: 74,
    textAlign: "right",
    fontFamily: Typography.fontFamilyBold,
    color: Colors.text,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  badge: {
    textTransform: "uppercase",
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.xs,
    letterSpacing: 0.8,
  },
  cold: {
    color: Colors.cold,
  },
  warm: {
    color: Colors.warning,
  },
  hot: {
    color: Colors.hot,
  },
  perfect: {
    color: Colors.perfect,
  },
  message: {
    color: Colors.text,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
  },
  empty: {
    textAlign: "center",
    color: Colors.muted,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fontFamily,
  },
});
