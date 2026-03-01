import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Typography } from "../../constants/Typography";
import { Colors } from "../../constants/Colors";

const AnimatedText = Animated.createAnimatedComponent(Text);

type PointsCounterProps = {
  value: number;
};

export const PointsCounter: React.FC<PointsCounterProps> = ({ value }) => {
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = withSequence(
      withTiming(1.08, { duration: 180 }),
      withTiming(1, { duration: 180 })
    );
  }, [value, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progress.value }],
  }));

  return (
    <AnimatedText style={[styles.text, animatedStyle]}>
      {value.toLocaleString()}
    </AnimatedText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: Typography.sizes.lg,
    color: Colors.primaryDark,
  },
});
