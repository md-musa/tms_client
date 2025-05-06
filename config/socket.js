import { io } from "socket.io-client";

// Replace with your server URL
const LOCAL_API_URL = "http://192.168.1.4:4000";
const SOCKET_SERVER_URL = "https://tms-dcro.onrender.com";

// Initialize the socket connection
const socket = io(LOCAL_API_URL, {
  autoConnect: true, // Automatically connect when the socket is created
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts in milliseconds
  // transports: ["websocket"], // Use WebSocket transport only
});

// Socket event listeners for connection status
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;
