import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  "https://wordgame-production-79dc.up.railway.app";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
      timeout: 10000,
    });
  }
  return socket;
};
