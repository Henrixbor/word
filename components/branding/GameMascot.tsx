import React from "react";
import { Image } from "react-native";

type GameMascotProps = {
  size?: number;
};

const approvedMascot = require("../../assets/branding/mascot-approved.png");

export const GameMascot: React.FC<GameMascotProps> = ({ size = 132 }) => {
  return (
    <Image
      source={approvedMascot}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};
