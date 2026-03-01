import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

type ConfettiProps = {
  visible: boolean;
};

export const Confetti: React.FC<ConfettiProps> = ({ visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.container} pointerEvents="none">
      <LottieView
        source={require("../../assets/confetti.json")}
        autoPlay
        loop={false}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 320,
    height: 320,
  },
});
