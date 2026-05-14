import { io } from "socket.io-client";

let socket = null;

// create socket connection
export const createSocket = () => {
  if (!socket) {
    socket = io("http://127.0.0.1:3001", {
      transports: ["websocket"], // optional but stable
      autoConnect: true
    });
  }
  return socket;
};

// disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};