import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../../constants/Typography";
import { getSocket } from "../../services/socket";

const mockLive = Array.from({ length: 8 }).map((_, index) => ({
  id: `live-${index}`,
  name: `Rival ${index + 1}`,
  score: 1200 - index * 90,
}));

export default function BattleScreen() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#FFE4E6", "#FFFFFF"]} style={styles.header}>
        <Text style={styles.title}>Battle Royale</Text>
        <Text style={styles.subtitle}>Live rankings update in real-time.</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Socket</Text>
          <Text style={[styles.statusValue, connected ? styles.online : styles.offline]}>
            {connected ? "Connected" : "Offline"}
          </Text>
        </View>
        <Button title="Find Match" onPress={() => getSocket().connect()} />
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Live Rankings</Text>
        <View style={styles.list}>
          {mockLive.map((player, index) => (
            <Card key={player.id} style={styles.card}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <View style={styles.playerInfo}>
                <Text style={styles.name}>{player.name}</Text>
                <Text style={styles.score}>{player.score} pts</Text>
              </View>
            </Card>
          ))}
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
  statusRow: {
    marginTop: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    color: Colors.muted,
    fontFamily: Typography.fontFamilyMedium,
  },
  statusValue: {
    fontFamily: Typography.fontFamilyBold,
  },
  online: {
    color: Colors.success,
  },
  offline: {
    color: Colors.danger,
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
    alignItems: "center",
    gap: Spacing.md,
  },
  rank: {
    fontFamily: Typography.fontFamilyBold,
    color: Colors.primary,
  },
  playerInfo: {
    flex: 1,
  },
  name: {
    fontFamily: Typography.fontFamilySemi,
    color: Colors.text,
  },
  score: {
    color: Colors.muted,
    fontFamily: Typography.fontFamilyMedium,
  },
});
