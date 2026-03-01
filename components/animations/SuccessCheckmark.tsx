import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

type SuccessCheckmarkProps = {
  visible: boolean;
  size?: number;
};

export const SuccessCheckmark: React.FC<SuccessCheckmarkProps> = ({
  visible,
  size = 80,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(100, withSpring(1.2, { damping: 10, stiffness: 100 })),
        withSpring(1, { damping: 15, stiffness: 150 })
      );
      opacity.value = withTiming(1, { duration: 300 });
      rotation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(200, withSpring(360, { damping: 15, stiffness: 100 }))
      );
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, scale, opacity, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[styles.checkmark, animatedStyle]}>
        <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]} />
        <View style={styles.checkIcon}>
          <View style={styles.checkLine1} />
          <View style={styles.checkLine2} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: Colors.success,
  },
  checkIcon: {
    position: 'absolute',
  },
  checkLine1: {
    width: 12,
    height: 3,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }, { translateX: -4 }, { translateY: 8 }],
    borderRadius: 2,
  },
  checkLine2: {
    width: 24,
    height: 3,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }, { translateX: 6 }, { translateY: 5 }],
    borderRadius: 2,
  },
});
