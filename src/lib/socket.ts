import { io } from "socket.io-client";

// Connect to the same origin where the app is hosted
const URL = import.meta.env.PROD || process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL as string, {
  autoConnect: true
});
