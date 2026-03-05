import { Server as SocketIOServer } from "socket.io";
import { redisClient } from "../config/redisClient.js";

// In-memory session store
export const sessions = {}; // shared across routes

// Export a function to initialize Socket.IO with the server
export const initWebSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a session
    socket.on("join_room", ({ roomId, userId }) => {
      const session = sessions[roomId];
      if (!session) return socket.emit("error", "Session not found");
      if (!session.users.includes(userId)) return socket.emit("error", "Unauthorized");

      socket.join(roomId);
      socket.emit("joined", { roomId });
      console.log(`${userId} joined room ${roomId}`);
    });

    // Send a message
    socket.on("send_message", async ({ roomId, userId, message }) => {
      const session = sessions[roomId];
      if (!session || session.state !== "ACTIVE") return;

      // Increment message count
      session.messageCount += 1;

      // Store temporarily in Redis
      await redisClient.rPush(
        `messages:${roomId}`,
        JSON.stringify({ userId, message })
      );

      // Emit message to others
      socket.to(roomId).emit("receive_message", { userId, message });

      // Check message limit
      if (session.messageCount >= session.messageLimit) {
        endSession(io, roomId);
      }
    });
  });
};

// End session function
export async function endSession(io, roomId) {
  const session = sessions[roomId];
  if (!session) return;

  session.state = "ENDED";

  const messages = await redisClient.lRange(`messages:${roomId}`, 0, -1);
  await redisClient.del(`messages:${roomId}`); // delete messages

  io.to(roomId).emit("session_ended", { messageCount: session.messageCount });

  const sessionSummary = {
    roomId,
    messageCount: session.messageCount,
    escalationTriggered: session.escalationTriggered || false,
  };
  console.log("Session summary:", sessionSummary);
}