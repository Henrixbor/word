import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PointsCounter } from "../animations/PointsCounter";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";

export const PointsDisplay: React.FC<{ value: number }> = ({ value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Points</Text>
      <PointsCounter value={value} />
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
});
