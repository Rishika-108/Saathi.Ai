import { activeChats, userToRoom, createSession, endSession } from "./sessionManager.js"

const MAX_MESSAGES = 30
const MAX_DURATION = 15 * 60 * 1000

export default function socketServer(io){

    io.on("connection",(socket)=>{

        console.log("User connected:", socket.id)

        // Join room after match
        socket.on("join_chat",(data)=>{

            const { userId, peerId, roomId } = data

            // prevent multiple sessions
            if(userToRoom.has(userId)){
                socket.emit("error","User already in chat")
                return
            }

            createSession(roomId, userId, peerId)

            socket.join(roomId)

            socket.emit("joined_room", roomId)

            console.log(`User ${userId} joined ${roomId}`)

            // auto end session after time
            setTimeout(()=>{
                io.to(roomId).emit("chat_ended")
                endSession(roomId)
            }, MAX_DURATION)

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

            // message limit
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