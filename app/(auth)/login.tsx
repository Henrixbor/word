import React, { useState } from "react";
import { ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../components/ui/Button";
import { GameMascot } from "../../components/branding/GameMascot";
import { strongSurfaceShadow } from "../../components/ui/surfaceStyles";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { useAuthStore } from "../../stores/authStore";

const authBackground = require("../../assets/branding/loading-hero-01.png");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  return (
    <ImageBackground source={authBackground} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.mascotWrap}>
        <GameMascot size={116} />
      </View>
      <View style={styles.panel}>
        <Text style={styles.eyebrow}>Return</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in and get back into the live arena.</Text>

        <View style={styles.form}>
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
            title="Log In"
            onPress={() => {
              void login(email || "player").then(() => router.replace("/(tabs)"));
            }}
          />
        </View>

        <Button
          title="Create Account"
          variant="secondary"
          onPress={() => router.push("/(auth)/register")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(24, 33, 50, 0.46)",
  },
  panel: {
    backgroundColor: "rgba(255,249,240,0.92)",
    borderRadius: 30,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
    ...strongSurfaceShadow,
  },
  mascotWrap: {
    position: "absolute",
    right: 28,
    top: 88,
  },
  eyebrow: {
    fontFamily: Typography.fontFamilySemi,
    color: Colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    fontSize: Typography.sizes.sm,
  },
  title: {
    marginTop: Spacing.xs,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xxl,
    color: Colors.text,
  },
  subtitle: {
    marginTop: Spacing.sm,
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
    lineHeight: 22,
  },
  form: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontFamily: Typography.fontFamily,
    color: Colors.text,
  },
});
