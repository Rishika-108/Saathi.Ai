import PeerRequest from "../model/PeerRequestModel.js";
import axios from "axios";
import {
  activeChats,
  userToRoom,
  createSession,
  endSession,
} from "./sessionManager.js";

const MAX_MESSAGES = 30;
const MAX_DURATION = 15 * 60 * 1000;

export const userSockets = new Map(); // userId -> socket.id

export default function socketServer(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register_user", (userId) => {
      console.log(`Registering socket ${socket.id} for user ${userId}`);
      userSockets.set(userId, socket.id);
    });

    socket.on("join_chat", async ({ userId, roomId }) => {
      userSockets.set(userId, socket.id); // Also register on join
      console.log("JOIN REQUEST FROM:", userId, "ROOM:", roomId);
      try {
        let actualRoomId = roomId;

        if (!actualRoomId) {
          // Fallback if no roomId provided (shouldn't happen with updated client)
          const match = await PeerRequest.findOne({
            status: "matched",
            $or: [{ fromUser: userId }, { toUser: userId }],
          });

          if (!match) {
            socket.emit("error", "No active match found");
            return;
          }
          actualRoomId = match.roomId;
        }

        if (userToRoom.has(userId)) {
          // Might need to handle reconnecting vs already active
          // socket.emit("error", "User already in chat");
          // return;
        }

        const users = actualRoomId.split("_").slice(1);

        if (!activeChats.has(actualRoomId)) {
          createSession(actualRoomId, users[0], users[1]);
        }

        socket.join(actualRoomId);

        io.to(actualRoomId).emit("joined_room", actualRoomId);

        console.log(`Users joined room ${actualRoomId}`);

        const roomSize = io.sockets.adapter.rooms.get(actualRoomId)?.size || 0;

        if (roomSize === 2) {
          console.log(`Chat session started: ${actualRoomId}`);

          setTimeout(() => {
            io.to(actualRoomId).emit("chat_ended");
            endSession(actualRoomId);
          }, MAX_DURATION);
        }
      } catch (err) {
        console.error(err);
        socket.emit("error", "Join failed");
      }
    });

    socket.on("send_message",(data)=>{

  const { roomId, userId, message } = data

  let session = activeChats.get(roomId)

  // Ensure session exists
  if(!session){

    console.log("Session missing, creating session for:", roomId)

    const users = roomId.split("_").slice(1)

    createSession(roomId, users[0], users[1])

    session = activeChats.get(roomId)
  }

  session.messages.push({ userId, message })
  session.messageCount++

  console.log("MESSAGE:", message)

  socket.to(roomId).emit("receive_message",{
    userId,
    message
  })

  // 1️⃣ Safety Analysis (Async)
  axios.post(`${process.env.PYTHON_SERVICE_URL}/chat/analyze`, { text: message })
    .then(response => {
      const { analysis } = response.data;
      if (analysis.risk_score > 0.8 || analysis.safety_flags.length > 0) {
        console.log("SAFETY ESCALATION IN ROOM:", roomId);
        io.to(roomId).emit("chat_ended", { 
          reason: "safety_escalation", 
          riskLevel: "HIGH" 
        });
        endSession(roomId);
      }
    })
    .catch(err => console.error("Chat safety analysis failed:", err.message));

  if(session.messageCount >= MAX_MESSAGES){
    io.to(roomId).emit("chat_ended", { reason: "message_limit" });
    endSession(roomId);
  }

})

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Clean up mapping
      for (const [uid, sid] of userSockets.entries()) {
        if (sid === socket.id) {
          userSockets.delete(uid);
          break;
        }
      }
    });
  });
}
