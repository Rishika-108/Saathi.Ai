export const activeChats = new Map()
export const userToRoom = new Map()

export const createSession = (roomId, userA, userB) => {

    activeChats.set(roomId, {
        users: [userA, userB],
        messages: [],
        messageCount: 0,
        startedAt: Date.now()
    })

    userToRoom.set(userA, roomId)
    userToRoom.set(userB, roomId)

}

export const endSession = (roomId) => {

    const session = activeChats.get(roomId)

    if(!session) return

    session.users.forEach(user=>{
        userToRoom.delete(user)
    })

    activeChats.delete(roomId)
}