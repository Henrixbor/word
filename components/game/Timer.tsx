import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";

type TimerProps = {
  seconds: number;
};

export const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return (
    <Text style={styles.text}>
      {mins}:{secs.toString().padStart(2, "0")}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Typography.fontFamilySemi,
    color: Colors.muted,
  },
});
