import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { FadeIn } from '../../components/animations/FadeIn';

interface ServerInfo {
  id: string;
  name: string;
  region: string;
  flag: string;
  url: string;
  latency: number;
  playerCount: number;
  status: 'online' | 'degraded' | 'offline';
}

const SERVERS: Omit<ServerInfo, 'latency' | 'playerCount' | 'status'>[] = [
  { id: 'us-east', name: 'US East', region: 'North America', flag: '🇺🇸', url: 'wss://us-east.wordgame.app' },
  { id: 'us-west', name: 'US West', region: 'North America', flag: '🇺🇸', url: 'wss://us-west.wordgame.app' },
  { id: 'eu-west', name: 'EU West', region: 'Europe', flag: '🇪🇺', url: 'wss://eu-west.wordgame.app' },
  { id: 'eu-central', name: 'EU Central', region: 'Europe', flag: '🇪🇺', url: 'wss://eu-central.wordgame.app' },
  { id: 'asia-east', name: 'Asia East', region: 'Asia', flag: '🇯🇵', url: 'wss://asia-east.wordgame.app' },
  { id: 'asia-se', name: 'Asia SE', region: 'Asia', flag: '🇸🇬', url: 'wss://asia-se.wordgame.app' },
];

export default function ServerSelectionScreen() {
  const [autoSelect, setAutoSelect] = useState(true);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [testing, setTesting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    void testServers();
    // testServers intentionally runs once on mount for this static diagnostics screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pingServer = async (url: string): Promise<number> => {
    const start = Date.now();
    try {
      // In production, this would be a real ping endpoint
      // For demo, simulate latency based on server
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 20));
      return Date.now() - start;
    } catch {
      return 9999;
    }
  };

  const testServers = async () => {
    setTesting(true);
    
    const tested = await Promise.all(
      SERVERS.map(async (server) => {
        const latency = await pingServer(server.url);
        return {
          ...server,
          latency,
          playerCount: Math.floor(Math.random() * 5000) + 500, // Mock data
          status: latency < 300 ? 'online' : latency < 600 ? 'degraded' : 'offline',
        } as ServerInfo;
      })
    );

    setServers(tested);
    setTesting(false);

    // Auto-select best server
    if (autoSelect) {
      const best = tested.reduce((prev, curr) =>
        curr.latency < prev.latency ? curr : prev
      );
      setSelectedServer(best.id);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await testServers();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return Colors.success;
      case 'degraded':
        return Colors.warning;
      case 'offline':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return Colors.success;
    if (latency < 100) return '#10B981';
    if (latency < 150) return Colors.warning;
    return Colors.error;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <FadeIn>
        <View style={styles.header}>
          <Text style={styles.title}>Server Selection</Text>
          <Text style={styles.subtitle}>
            Choose your preferred server region
          </Text>
        </View>

        {/* Auto-Select Toggle */}
        <TouchableOpacity
          style={styles.autoSelectCard}
          onPress={() => {
            setAutoSelect(!autoSelect);
            if (!autoSelect) {
              testServers();
            }
          }}
        >
          <View style={styles.autoSelectLeft}>
            <View
              style={[
                styles.checkbox,
                autoSelect && styles.checkboxSelected,
              ]}
            >
              {autoSelect && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View>
              <Text style={styles.autoSelectTitle}>
                Auto-Select Server
              </Text>
              <Text style={styles.autoSelectSubtitle}>
                Recommended for best performance
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Server List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Servers</Text>
            {testing && <ActivityIndicator size="small" color={Colors.primary} />}
          </View>

          {servers.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Testing servers...</Text>
            </View>
          ) : (
            servers.map((server, index) => (
              <FadeIn key={server.id} delay={index * 50}>
                <TouchableOpacity
                  style={[
                    styles.serverCard,
                    selectedServer === server.id && styles.serverCardSelected,
                    autoSelect && styles.serverCardDisabled,
                  ]}
                  onPress={() => {
                    if (!autoSelect) {
                      setSelectedServer(server.id);
                    }
                  }}
                  disabled={autoSelect}
                >
                  {/* Selection Indicator */}
                  <View
                    style={[
                      styles.selectionIndicator,
                      selectedServer === server.id &&
                        styles.selectionIndicatorActive,
                    ]}
                  />

                  {/* Server Info */}
                  <View style={styles.serverContent}>
                    <View style={styles.serverLeft}>
                      <Text style={styles.serverFlag}>{server.flag}</Text>
                      <View style={styles.serverInfo}>
                        <Text style={styles.serverName}>{server.name}</Text>
                        <Text style={styles.serverRegion}>
                          {server.region}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.serverRight}>
                      <Text
                        style={[
                          styles.latency,
                          { color: getLatencyColor(server.latency) },
                        ]}
                      >
                        {server.latency}ms
                      </Text>
                      {server.latency < 50 && (
                        <Text style={styles.badge}>✅ Best</Text>
                      )}
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(server.status) },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Player Count */}
                  <View style={styles.serverFooter}>
                    <Text style={styles.playerCount}>
                      👥 {server.playerCount.toLocaleString()} players online
                    </Text>
                  </View>
                </TouchableOpacity>
              </FadeIn>
            ))
          )}
        </View>

        {/* Selected Server Info */}
        {selectedServer && !autoSelect && (
          <FadeIn delay={200}>
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedTitle}>Selected Server</Text>
              <Text style={styles.selectedServer}>
                {servers.find((s) => s.id === selectedServer)?.name}
              </Text>
              <Text style={styles.selectedLatency}>
                Latency:{' '}
                {servers.find((s) => s.id === selectedServer)?.latency}ms
              </Text>
              <Text style={styles.warningText}>
                ⚠️ Changing server will disconnect any active game
              </Text>
            </View>
          </FadeIn>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 About Server Selection</Text>
          <Text style={styles.infoText}>
            • Auto-select chooses the fastest server for you
          </Text>
          <Text style={styles.infoText}>
            • Lower latency = smoother gameplay
          </Text>
          <Text style={styles.infoText}>
            • You can join tournaments in other regions
          </Text>
          <Text style={styles.infoText}>
            • Pull down to refresh server status
          </Text>
        </View>
      </FadeIn>
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
    backgroundColor: Colors.backgroundStrong,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  autoSelectCard: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  autoSelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  autoSelectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  autoSelectSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  serverCard: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  serverCardSelected: {
    borderColor: Colors.primary,
  },
  serverCardDisabled: {
    opacity: 0.7,
  },
  selectionIndicator: {
    width: 4,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
  selectionIndicatorActive: {
    backgroundColor: Colors.primary,
  },
  serverContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    paddingLeft: Spacing.md + 8,
  },
  serverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  serverFlag: {
    fontSize: 32,
  },
  serverInfo: {
    gap: 4,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  serverRegion: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  serverRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  latency: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  serverFooter: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    paddingLeft: Spacing.md + 8,
  },
  playerCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectedInfo: {
    backgroundColor: Colors.primary + '16',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  selectedTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  selectedServer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  selectedLatency: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  warningText: {
    fontSize: 14,
    color: Colors.warning,
    marginTop: Spacing.md,
  },
  infoCard: {
    backgroundColor: Colors.surfaceMuted,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    padding: Spacing.md,
    borderRadius: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
});
