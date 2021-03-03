import { Animated } from "react-native";

export const animateOnToggle = (
  animation: Animated.Value,
  toggle: boolean,
  fromValue: number,
  toValue: number,
  duration: number = 500
) => {
  Animated.timing(animation, {
    toValue: !toggle ? toValue : fromValue,
    duration: duration,
    useNativeDriver: false,
  }).start();
};
