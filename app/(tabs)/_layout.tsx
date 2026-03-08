import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { surfaceShadow } from "../../components/ui/surfaceStyles";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryDark,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 16,
          height: 72,
          borderTopWidth: 0,
          backgroundColor: Colors.tabBar,
          borderRadius: 28,
          paddingTop: 10,
          paddingBottom: 10,
          borderWidth: 1,
          borderColor: Colors.tabBarBorder,
          ...surfaceShadow,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const name =
            route.name === "index"
              ? focused
                ? "home"
                : "home-outline"
              : route.name === "battle"
              ? focused
                ? "flash"
                : "flash-outline"
              : route.name === "leaderboard"
              ? focused
                ? "trophy"
                : "trophy-outline"
              : route.name === "profile"
              ? focused
                ? "person"
                : "person-outline"
              : focused
              ? "diamond"
              : "diamond-outline";
          return <Ionicons name={name} color={color} size={size + (focused ? 2 : 0)} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="battle" options={{ title: "Battle" }} />
      <Tabs.Screen name="leaderboard" options={{ title: "Ranks" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="shop" options={{ href: null }} />
    </Tabs>
  );
}
