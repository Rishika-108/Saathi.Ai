import PeerRequest from "../model/PeerRequestModel.js"
import { activeChats, userToRoom, createSession, endSession } from "./sessionManager.js"

const MAX_MESSAGES = 30
const MAX_DURATION = 15 * 60 * 1000

export default function socketServer(io){

  io.on("connection",(socket)=>{

    console.log("User connected:", socket.id)

    socket.on("join_chat", async ({ userId }) => {

      try {

        const match = await PeerRequest.findOne({
          $or: [
            { fromUser: userId },
            { toUser: userId }
          ],
          status: "matched"
        })

        if(!match){
          socket.emit("error","No active match found")
          return
        }

        const roomId = match.roomId

        const users = [
          match.fromUser.toString(),
          match.toUser.toString()
        ]

        if(userToRoom.has(users[0]) || userToRoom.has(users[1])){
          socket.emit("error","User already in chat")
          return
        }

        if(!activeChats.has(roomId)){
          createSession(roomId, users[0], users[1])
        }

        socket.join(roomId)

        socket.emit("joined_room", roomId)

        console.log(`Users joined room ${roomId}`)

        const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0

        if(roomSize === 2){

          console.log(`Chat session started: ${roomId}`)

          setTimeout(()=>{
            io.to(roomId).emit("chat_ended")
            endSession(roomId)
          }, MAX_DURATION)

        }

      } catch(err){
        console.error(err)
        socket.emit("error","Join failed")
      }

    })

    socket.on("send_message",(data)=>{

      const { roomId, userId, message } = data

      const session = activeChats.get(roomId)

      if(!session) return

      session.messages.push({ userId, message })
      session.messageCount++

      io.to(roomId).emit("receive_message",{
        userId,
        message
      })

      if(session.messageCount >= MAX_MESSAGES){
        io.to(roomId).emit("chat_ended")
        endSession(roomId)
      }

    })

    socket.on("disconnect",()=>{
      console.log("User disconnected:", socket.id)
    })

  })

}