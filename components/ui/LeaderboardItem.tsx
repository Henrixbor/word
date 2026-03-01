import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LeaderboardEntry } from "../../services/api";
import { Avatar } from "./Avatar";
import { RankBadge } from "./RankBadge";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";

export const LeaderboardItem: React.FC<{ entry: LeaderboardEntry }> = ({ entry }) => {
  return (
    <View style={styles.container}>
      <RankBadge rank={entry.rank} />
      <Avatar name={entry.name} size={40} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{entry.name}</Text>
        <Text style={styles.score}>{entry.score.toLocaleString()} pts</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
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
  },
  score: {
    color: Colors.muted,
    fontFamily: Typography.fontFamilyMedium,
    marginTop: 2,
  },
});
