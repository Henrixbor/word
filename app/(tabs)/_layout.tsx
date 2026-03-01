import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: "#FFFFFF",
          height: 64,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          const name =
            route.name === "index"
              ? "home"
              : route.name === "battle"
              ? "flash"
              : route.name === "leaderboard"
              ? "trophy"
              : route.name === "profile"
              ? "person"
              : "cart";
          return <Ionicons name={name} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="battle" options={{ title: "Battle" }} />
      <Tabs.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="shop" options={{ title: "Shop" }} />
    </Tabs>
  );
}
