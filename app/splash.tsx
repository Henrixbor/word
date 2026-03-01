import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";
import { Typography } from "../constants/Typography";
import { useAuthStore } from "../stores/authStore";

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
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={styles.container}
    >
      <Animated.View style={[styles.logo, animatedStyle]}>
        <Text style={styles.logoText}>WORDGAME</Text>
      </Animated.View>
      <Text style={styles.tagline}>Daily word battles, anytime.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  logoText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 32,
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 24,
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilyMedium,
  },
});
