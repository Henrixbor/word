import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { surfaceShadow } from "./surfaceStyles";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...surfaceShadow,
  },
});
