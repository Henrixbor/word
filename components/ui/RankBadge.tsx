import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";

type RankBadgeProps = {
  rank: number;
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank }) => {
  const color =
    rank === 1
      ? "#F59E0B"
      : rank === 2
      ? "#94A3B8"
      : rank === 3
      ? "#D97706"
      : Colors.primary;
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>#{rank}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    minWidth: 44,
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilySemi,
  },
});
