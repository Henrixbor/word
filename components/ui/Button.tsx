import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { surfaceShadow } from "./surfaceStyles";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}) => {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      hitSlop={8}
    >
      <Text
        style={[
          styles.text,
          variant === "ghost" && styles.ghostText,
          variant === "secondary" && styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.lg,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    ...surfaceShadow,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.tabBarBorder,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.md,
    letterSpacing: 0.2,
  },
  secondaryText: {
    color: Colors.text,
  },
  ghostText: {
    color: Colors.primaryDark,
  },
});
