import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

type SlideInProps = {
  children: React.ReactNode;
  delay?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  style?: ViewStyle;
};

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  delay = 0,
  direction = 'bottom',
  style,
}) => {
  const translateX = useSharedValue(direction === 'left' ? -300 : direction === 'right' ? 300 : 0);
  const translateY = useSharedValue(direction === 'top' ? -300 : direction === 'bottom' ? 300 : 0);

  useEffect(() => {
    translateX.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 90 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 90 }));
  }, [delay, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};
