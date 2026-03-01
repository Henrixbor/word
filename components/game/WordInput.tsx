import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { useSettingsStore } from "../../stores/settingsStore";

type WordInputProps = {
  onSubmit: (value: string) => void;
  placeholder?: string;
};

export const WordInput: React.FC<WordInputProps> = ({ onSubmit, placeholder }) => {
  const [value, setValue] = useState("");
  const hapticsEnabled = useSettingsStore((state) => state.hapticsEnabled);

  const handleSubmit = () => {
    if (!value.trim()) return;
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    }
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder ?? "Type your guess"}
        placeholderTextColor={Colors.muted}
        style={styles.input}
        autoCapitalize="characters"
        onSubmitEditing={handleSubmit}
      />
      <Pressable onPress={handleSubmit} style={styles.submit} hitSlop={8}>
        <Text style={styles.submitText}>Guess</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    color: Colors.text,
    paddingHorizontal: Spacing.sm,
  },
  submit: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilySemi,
  },
});
