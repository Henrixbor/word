import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  return (
    <LinearGradient colors={["#F8FAFF", "#FFFFFF"]} style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Jump into daily word battles.</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Display name"
          placeholderTextColor={Colors.muted}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title="Sign Up"
          onPress={() => {
            login(email || "player@wordgame.com");
            router.replace("/(tabs)");
          }}
        />
      </View>

      <Button
        title="Already have an account?"
        variant="ghost"
        onPress={() => router.back()}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "center",
  },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
    color: Colors.text,
  },
  subtitle: {
    marginTop: 6,
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  form: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    fontFamily: Typography.fontFamily,
  },
});
