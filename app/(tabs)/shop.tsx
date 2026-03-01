import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { pointsService } from "../../services/points";
import { usePointsStore } from "../../stores/pointsStore";

export default function ShopScreen() {
  const addPoints = usePointsStore((state) => state.addPoints);
  const { data: bundles } = useQuery({
    queryKey: ["bundles"],
    queryFn: pointsService.getBundles,
  });
  const { data: vip } = useQuery({
    queryKey: ["vip"],
    queryFn: pointsService.getVipOffer,
  });

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#FFF7ED", "#FFFFFF"]} style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <Text style={styles.subtitle}>Boost your points and go VIP.</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Point Bundles</Text>
        <View style={styles.list}>
          {bundles?.map((bundle) => (
            <Card key={bundle.id} style={styles.card}>
              <View>
                <Text style={styles.cardTitle}>{bundle.points} Points</Text>
                <Text style={styles.cardSubtitle}>{bundle.price}</Text>
              </View>
              <Button
                title="Buy"
                onPress={() => addPoints(bundle.points)}
              />
            </Card>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VIP Subscription</Text>
        <Card style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>VIP Access</Text>
            <Text style={styles.cardSubtitle}>{vip?.price}</Text>
            <Text style={styles.cardPerks}>{vip?.perks?.join(" • ")}</Text>
          </View>
          <Button title="Subscribe" onPress={() => {}} />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.xl,
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
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  list: {
    gap: Spacing.md,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.md,
  },
  cardTitle: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.md,
    color: Colors.text,
  },
  cardSubtitle: {
    color: Colors.muted,
    fontFamily: Typography.fontFamily,
  },
  cardPerks: {
    marginTop: Spacing.xs,
    color: Colors.primary,
    fontFamily: Typography.fontFamilyMedium,
  },
});
