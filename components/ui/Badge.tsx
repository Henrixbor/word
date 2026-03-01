import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";

type BadgeProps = {
  label: string;
  color?: string;
  style?: ViewStyle;
};

export const Badge: React.FC<BadgeProps> = ({ label, color, style }) => {
  return (
    <View style={[styles.badge, { backgroundColor: color ?? Colors.primary }, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 999,
  },
  text: {
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
  },
});
