import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";
import { LeaderboardEntry } from "../../services/api";
import { Avatar } from "./Avatar";
import { RankBadge } from "./RankBadge";
import { surfaceShadow } from "./surfaceStyles";

export const LeaderboardItem: React.FC<{ entry: LeaderboardEntry }> = ({ entry }) => {
  const isTopThree = entry.rank <= 3;

  return (
    <View style={[styles.container, isTopThree && styles.topContainer]}>
      <RankBadge rank={entry.rank} />
      <Avatar name={entry.name} size={44} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{entry.name}</Text>
        <Text style={styles.score}>{entry.score.toLocaleString()} pts</Text>
      </View>
      <View style={[styles.pill, isTopThree && styles.topPill]}>
        <Text style={[styles.pillText, isTopThree && styles.topPillText]}>
          #{entry.rank}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    ...surfaceShadow,
  },
  topContainer: {
    backgroundColor: "#FFF6E7",
    borderColor: "#F3D7A1",
  },
  avatar: {
    marginHorizontal: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: Typography.fontFamilySemi,
    color: Colors.text,
    fontSize: Typography.sizes.md,
  },
  score: {
    color: Colors.muted,
    fontFamily: Typography.fontFamilyMedium,
    marginTop: 4,
  },
  pill: {
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: Colors.surfaceMuted,
  },
  topPill: {
    backgroundColor: Colors.accent,
  },
  pillText: {
    color: Colors.muted,
    fontFamily: Typography.fontFamilyBold,
  },
  topPillText: {
    color: "#5A3E00",
  },
});
