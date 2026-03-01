import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PointsDisplay } from "../../components/ui/PointsDisplay";
import { Shimmer } from "../../components/animations/Shimmer";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { usePointsStore } from "../../stores/pointsStore";

export default function HomeScreen() {
  const router = useRouter();
  const points = usePointsStore((state) => state.points);
  const [loading, setLoading] = useState(false);

  const onRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
    >
      <LinearGradient colors={["#EEF2FF", "#FFFFFF"]} style={styles.hero}>
        <View style={styles.heroHeader}>
          <Text style={styles.title}>Daily Wordgame</Text>
          <PointsDisplay value={points} />
        </View>
        <Text style={styles.subtitle}>Solve today's challenge and climb the ladder.</Text>
        <Button
          title="Play Daily Challenge"
          onPress={() => router.push("/game/daily-challenge")}
          style={styles.heroButton}
        />
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Modes</Text>
        <View style={styles.modeGrid}>
          {loading ? (
            <Shimmer style={styles.skeleton} />
          ) : (
            <Card style={styles.modeCard}>
              <Text style={styles.modeTitle}>Practice</Text>
              <Text style={styles.modeText}>Unlimited solo play.</Text>
              <Button
                title="Start"
                variant="secondary"
                onPress={() => router.push("/game/practice")}
              />
            </Card>
          )}
          <Card style={styles.modeCard}>
            <Text style={styles.modeTitle}>Battle</Text>
            <Text style={styles.modeText}>Real-time multiplayer.</Text>
            <Button
              title="Join"
              variant="secondary"
              onPress={() => router.push("/(tabs)/battle")}
            />
          </Card>
          <Card style={styles.modeCard}>
            <Text style={styles.modeTitle}>Tournament</Text>
            <Text style={styles.modeText}>Compete weekly.</Text>
            <Button title="Enter" variant="secondary" onPress={() => {}} />
          </Card>
          <Card style={styles.modeCard}>
            <Text style={styles.modeTitle}>Stats</Text>
            <Text style={styles.modeText}>Track your progress.</Text>
            <Button
              title="View"
              variant="secondary"
              onPress={() => router.push("/(tabs)/profile")}
            />
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    padding: Spacing.xl,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
    color: Colors.text,
  },
  subtitle: {
    marginTop: Spacing.sm,
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  heroButton: {
    marginTop: Spacing.lg,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.lg,
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  modeGrid: {
    gap: Spacing.md,
  },
  modeCard: {
    gap: Spacing.sm,
  },
  modeTitle: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.md,
    color: Colors.text,
  },
  modeText: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  skeleton: {
    height: 140,
    borderRadius: 16,
  },
});
