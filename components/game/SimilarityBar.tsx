import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../../constants/Colors";

const similarityToColor = (value: number) => {
  if (value >= 0.95) return Colors.perfect;
  if (value >= 0.75) return Colors.hot;
  if (value >= 0.5) return Colors.warm;
  return Colors.cold;
};

type SimilarityBarProps = {
  similarity: number;
};

export const SimilarityBar: React.FC<SimilarityBarProps> = ({ similarity }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(similarity, { duration: 500 });
  }, [similarity, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(progress.value, 1) * 100}%`,
  }));

  return (
    <View style={styles.track}>
      <Animated.View
        style={[styles.fill, animatedStyle, { backgroundColor: similarityToColor(similarity) }]}
      />
      <View style={styles.gloss} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "#D9E3F1",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  gloss: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
});
