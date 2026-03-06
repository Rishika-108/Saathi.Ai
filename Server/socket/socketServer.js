import PeerRequest from "../model/PeerRequestModel.js";
import {
  activeChats,
  userToRoom,
  createSession,
  endSession,
} from "./sessionManager.js";

const MAX_MESSAGES = 30;
const MAX_DURATION = 15 * 60 * 1000;

export default function socketServer(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_chat", async ({ userId }) => {
      console.log("JOIN REQUEST FROM:", userId);
      try {
        const match = await PeerRequest.findOne({
          status: "matched",
          $or: [{ fromUser: userId }, { toUser: userId }],
        });

        console.log("MATCH RESULT:", match);

        if (!match) {
          socket.emit("error", "No active match found");
          return;
        }

        const roomId = match.roomId;

        const users = [match.fromUser.toString(), match.toUser.toString()];

        if (userToRoom.has(userId)) {
          socket.emit("error", "User already in chat");
          return;
        }
        if (!activeChats.has(roomId)) {
  createSession(roomId, users[0], users[1]);
}

        socket.join(roomId);

        io.to(roomId).emit("joined_room", roomId);

        console.log(`Users joined room ${roomId}`);

        const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;

        if (roomSize === 2) {
          console.log(`Chat session started: ${roomId}`);

          setTimeout(() => {
            io.to(roomId).emit("chat_ended");
            endSession(roomId);
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

  io.to(roomId).emit("receive_message",{
    userId,
    message
  })

  if(session.messageCount >= MAX_MESSAGES){
    io.to(roomId).emit("chat_ended")
    endSession(roomId)
  }

})

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
