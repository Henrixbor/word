import React, { useEffect } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Typography } from "../constants/Typography";
import { useAuthStore } from "../stores/authStore";

const splashBackground = require("../assets/branding/loading-hero-01.png");
const splashLogo = require("../assets/branding/logo-hero.png");

export default function SplashScreen() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.4, { duration: 600 })
      ),
      -1
    );

    const timeout = setTimeout(() => {
      router.replace(isAuthenticated ? "/(tabs)" : "/(auth)/onboarding");
    }, 1600);

    return () => clearTimeout(timeout);
  }, [opacity, router, scale, isAuthenticated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ImageBackground source={splashBackground} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <Animated.View style={[styles.logo, animatedStyle]}>
        <Image source={splashLogo} style={styles.logoImage} resizeMode="contain" />
      </Animated.View>
      <View style={styles.taglineBadge}>
        <Text style={styles.tagline}>Live word battles with a smiling dachshund guide.</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(24, 34, 56, 0.35)",
  },
  logo: {
    width: 320,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  taglineBadge: {
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(16, 40, 61, 0.58)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  tagline: {
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 28,
  },
});
