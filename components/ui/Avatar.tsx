import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Colors } from "../../constants/Colors";
import { avatarOptionMap } from "../../constants/avatarOptions";
import { Typography } from "../../constants/Typography";

type AvatarProps = {
  name: string;
  size?: number;
  avatarId?: string;
  source?: ImageSourcePropType;
  style?: ViewStyle;
};

export const Avatar: React.FC<AvatarProps> = ({ name, size = 48, avatarId, source, style }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const resolvedSource = source ?? (avatarId ? avatarOptionMap.get(avatarId)?.source : undefined);

  return (
    <View style={[styles.base, { width: size, height: size }, style]}>
      {resolvedSource ? (
        <Image source={resolvedSource} style={{ width: size, height: size, borderRadius: 999 }} resizeMode="cover" />
      ) : (
        <Text style={[styles.text, { fontSize: size / 2.6 }]}>{initials}</Text>
      )}
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
