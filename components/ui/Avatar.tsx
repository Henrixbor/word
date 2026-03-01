import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";

type AvatarProps = {
  name: string;
  size?: number;
  style?: ViewStyle;
};

export const Avatar: React.FC<AvatarProps> = ({ name, size = 48, style }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={[styles.base, { width: size, height: size }, style]}>
      <Text style={[styles.text, { fontSize: size / 2.6 }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: Typography.fontFamilySemi,
    color: Colors.primaryDark,
  },
});
