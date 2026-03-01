import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";

type ProgressBarProps = {
  progress: number;
  color?: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(progress, 1) * 100}%`, backgroundColor: color ?? Colors.primary }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
