import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

type AnimatedProgressBarProps = {
  progress: number; // 0-1
  color?: string;
  height?: number;
  style?: ViewStyle;
};

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  color = Colors.primary,
  height = 8,
  style,
}) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(Math.max(progress, 0), 1) * 100, {
      duration: 500,
    });
  }, [progress, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={[styles.track, { height }, style]}>
      <Animated.View
        style={[styles.fill, { backgroundColor: color, height }, animatedStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
  },
});
