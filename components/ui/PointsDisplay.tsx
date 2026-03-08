import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PointsCounter } from "../animations/PointsCounter";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";

export const PointsDisplay: React.FC<{ value: number; light?: boolean }> = ({
  value,
  light = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, light && styles.labelLight]}>Points</Text>
      <PointsCounter value={value} light={light} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  label: {
    color: Colors.muted,
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
  },
  labelLight: {
    color: "rgba(255,255,255,0.8)",
  },
});
