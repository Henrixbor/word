import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type BounceProps = {
  children: React.ReactNode;
  bouncing?: boolean;
  style?: ViewStyle;
};

export const Bounce: React.FC<BounceProps> = ({
  children,
  bouncing = true,
  style,
}) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (bouncing) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        true
      );
    } else {
      translateY.value = withTiming(0, { duration: 300 });
    }
  }, [bouncing, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};
