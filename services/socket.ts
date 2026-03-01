import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://example.com", {
      autoConnect: false,
      transports: ["websocket"],
    });
  }
  return socket;
};
