import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000"; // Adjust if needed

export default function useSocket(userId) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!userId) return; // Don't connect if user is not logged in

    const socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket"],
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket:", socket.id);
    });

    socket.on("newQuestion", (data) => {
      console.log("📡 New question received:", data);
      setQuestions((prevQuestions) => [data, ...prevQuestions]); // Add new question to the list
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from WebSocket");
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]); // Depend on userId

  return { questions, setQuestions };
}
