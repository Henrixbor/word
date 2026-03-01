import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Guess } from "../../stores/gameStore";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { SimilarityBar } from "./SimilarityBar";

type GuessListProps = {
  guesses: Guess[];
};

export const GuessList: React.FC<GuessListProps> = ({ guesses }) => {
  return (
    <FlatList
      data={guesses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => (
        <View style={styles.row}>
          <Text style={styles.rank}>{guesses.length - index}</Text>
          <Text style={styles.word}>{item.word}</Text>
          <View style={styles.bar}>
            <SimilarityBar similarity={item.similarity} />
          </View>
          <Text style={styles.score}>{Math.round(item.similarity * 100)}%</Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>No guesses yet. Start guessing!</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rank: {
    width: 32,
    textAlign: "center",
    fontFamily: Typography.fontFamilySemi,
    color: Colors.muted,
  },
  word: {
    flex: 1,
    fontFamily: Typography.fontFamilySemi,
    color: Colors.text,
  },
  bar: {
    flex: 1.2,
    paddingHorizontal: Spacing.sm,
  },
  score: {
    width: 50,
    textAlign: "right",
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.muted,
  },
  empty: {
    textAlign: "center",
    color: Colors.muted,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fontFamily,
  },
});
