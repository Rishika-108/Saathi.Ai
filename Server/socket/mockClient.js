import { io } from "socket.io-client";
import { generateRoomId } from "../utils/room.js";
import readline from "readline";

const SERVER_URL = "http://localhost:5000";

const userA = "userA123";
const userB = "userB456";

const roomId = generateRoomId(userA, userB);

const socketA = io(SERVER_URL);
const socketB = io(SERVER_URL);

// Setup terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

socketA.on("connect", () => {
  console.log("User A connected");
  socketA.emit("join_chat", { userId: userA, peerId: userB, roomId });
});

socketB.on("connect", () => {
  console.log("User B connected");
  socketB.emit("join_chat", { userId: userB, peerId: userA, roomId });
});

socketA.on("joined_room", () => console.log("User A joined room"));
socketB.on("joined_room", () => console.log("User B joined room"));

socketA.on("receive_message", (data) => {
  console.log("A received:", data);
});

socketB.on("receive_message", (data) => {
  console.log("B received:", data);
});

socketA.on("chat_ended", () => {
  console.log("Chat ended");
  process.exit();
});

// 🔥 Interactive input
rl.on("line", (input) => {
  if (input.startsWith("A:")) {
    socketA.emit("send_message", {
      roomId,
      userId: userA,
      message: input.replace("A:", "").trim()
    });
  }

  if (input.startsWith("B:")) {
    socketB.emit("send_message", {
      roomId,
      userId: userB,
      message: input.replace("B:", "").trim()
    });
  }
});