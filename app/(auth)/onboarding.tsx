import React, { useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../components/ui/Button";
import { strongSurfaceShadow } from "../../components/ui/surfaceStyles";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";

const slides = [
  {
    title: "How to Play",
    description: "Guess the secret word with smart hints and color feedback.",
  },
  {
    title: "Earn Points",
    description: "Chain perfect guesses to stack multipliers and rewards.",
  },
  {
    title: "Compete & Win",
    description: "Join battles, refine your reads, and climb live rankings.",
  },
];

const onboardingBackground = require("../../assets/branding/loading-hero-02.png");
const mascotWave = require("../../assets/branding/mascot-wave.png");

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const slide = slides[index];

  const handleNext = () => {
    if (index < slides.length - 1) {
      setIndex((current) => current + 1);
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <ImageBackground source={onboardingBackground} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.slide}>
        <View style={styles.card}>
          <View style={styles.mascotWrap}>
            <Image source={mascotWave} style={styles.mascotImage} resizeMode="contain" />
          </View>
          <Text style={styles.eyebrow}>Welcome To Word!</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, dotIndex) => (
            <View
              key={String(dotIndex)}
              style={[styles.dot, dotIndex === index && styles.activeDot]}
            />
          ))}
        </View>
        <Button
          title={index === slides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 34, 49, 0.38)",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,252,247,0.9)",
    borderRadius: 28,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    ...strongSurfaceShadow,
  },
  mascotWrap: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  mascotImage: {
    width: 116,
    height: 116,
  },
  eyebrow: {
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamilySemi,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontSize: Typography.sizes.sm,
  },
  title: {
    marginTop: Spacing.sm,
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xxl,
    color: Colors.text,
  },
  description: {
    marginTop: Spacing.md,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    color: Colors.muted,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 26,
    backgroundColor: Colors.primary,
  },
});
