import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { useSettingsStore } from "../../stores/settingsStore";

type WordInputProps = {
  onSubmit: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  submitLabel?: string;
  autoFocus?: boolean;
};

export const WordInput: React.FC<WordInputProps> = ({
  onSubmit,
  placeholder,
  helperText,
  disabled = false,
  submitLabel = "Guess",
  autoFocus = false,
}) => {
  const [value, setValue] = useState("");
  const hapticsEnabled = useSettingsStore((state) => state.hapticsEnabled);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputRef.current?.focus();
    }
  }, [autoFocus, disabled]);

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    }
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder ?? "Type your guess"}
        placeholderTextColor={Colors.muted}
        style={styles.input}
        autoCapitalize="characters"
        onSubmitEditing={handleSubmit}
        editable={!disabled}
        maxLength={20}
        autoFocus={autoFocus}
      />
      <Pressable
        onPress={handleSubmit}
        style={[styles.submit, disabled && styles.submitDisabled]}
        hitSlop={8}
        disabled={disabled}
      >
        <Text style={styles.submitText}>{submitLabel}</Text>
      </Pressable>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 18,
    padding: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 64,
  },
  input: {
    backgroundColor: "#FFFFFF",
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    color: Colors.text,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    letterSpacing: 1.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(24,58,74,0.12)",
  },
  submit: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.sm + 2,
    borderRadius: 12,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  submitDisabled: {
    backgroundColor: Colors.border,
  },
  submitText: {
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilySemi,
  },
  helper: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    paddingHorizontal: Spacing.xs,
  },
});
