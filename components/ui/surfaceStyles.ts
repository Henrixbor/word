import { Platform } from "react-native";
import { Colors } from "../../constants/Colors";

export const surfaceShadow = Platform.select({
  web: {},
  default: {
    shadowColor: Colors.shadowStrong,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 5,
  },
});

export const strongSurfaceShadow = Platform.select({
  web: {},
  default: {
    shadowColor: Colors.shadowStrong,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 6,
  },
});
