import { NativeModules, Platform } from "react-native";
import { api, GameCenterFriendPayload } from "./api";

type GameCenterPlayer = GameCenterFriendPayload;

type LoadFriendsResult = {
  authorizationStatus: "authorized" | "denied" | "restricted" | "not_determined" | string;
  friends: GameCenterPlayer[];
};

type GameCenterNativeModule = {
  isAvailable(): Promise<boolean>;
  authenticate(): Promise<GameCenterPlayer>;
  getLocalPlayer(): Promise<GameCenterPlayer>;
  loadFriends(): Promise<LoadFriendsResult>;
};

const nativeModule = NativeModules.GameCenterModule as GameCenterNativeModule | undefined;

export const gameCenter = {
  isSupported() {
    return Platform.OS === "ios" && !!nativeModule;
  },

  async authenticate() {
    if (!nativeModule) {
      throw new Error("Game Center native module is unavailable.");
    }
    return nativeModule.authenticate();
  },

  async loadFriends() {
    if (!nativeModule) {
      throw new Error("Game Center native module is unavailable.");
    }
    return nativeModule.loadFriends();
  },

  async syncFriends(token: string) {
    const player = await this.authenticate();
    const result = await this.loadFriends();

    return {
      player,
      authorizationStatus: result.authorizationStatus,
      synced: await api.syncGameCenterFriends(token, player.gamePlayerId, result.friends),
      friends: result.friends,
    };
  },
};
