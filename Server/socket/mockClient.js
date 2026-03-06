import { io } from "socket.io-client";
import readline from "readline";

const SERVER_URL = "http://localhost:5000";

const userA = "69a71ee14af1d1b0d69d26c9";
const userB = "69a86535c22c6aba885e85fc";

let roomId = null;

const socketA = io(SERVER_URL);
const socketB = io(SERVER_URL);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ----------------------
// USER A CONNECTION
// ----------------------
socketA.on("connect", () => {

  console.log("User A connected:", socketA.id);

  socketA.emit("join_chat", {
    userId: userA
  });

});

socketA.on("joined_room", (room) => {

  roomId = room;
  console.log(`User A joined room -> ${room}`);

});

socketA.on("receive_message", (data) => {

  console.log(`A received from ${data.userId}: ${data.message}`);

});

// ----------------------
// USER B CONNECTION
// ----------------------
socketB.on("connect", () => {

  console.log("User B connected:", socketB.id);

  socketB.emit("join_chat", {
    userId: userB
  });

});

socketB.on("joined_room", (room) => {

  roomId = room;
  console.log(`User B joined room -> ${room}`);

});

socketB.on("receive_message", (data) => {

  console.log(`B received from ${data.userId}: ${data.message}`);

});

// ----------------------
// CHAT END
// ----------------------
function endChat() {

  console.log("\nSession finished.");

  socketA.disconnect();
  socketB.disconnect();

  rl.close();
  process.exit();

}

socketA.on("chat_ended", endChat);
socketB.on("chat_ended", endChat);

// ----------------------
// TERMINAL INPUT
// ----------------------
console.log("\nType messages:");
console.log("A: hello");
console.log("B: hi\n");

rl.on("line", (input) => {

  if (!roomId) {
    console.log("Room not ready yet.");
    return;
  }

  if (input.startsWith("A:")) {

    const message = input.replace("A:", "").trim();

    socketA.emit("send_message", {
      roomId,
      userId: userA,
      message
    });

  }

  else if (input.startsWith("B:")) {

    const message = input.replace("B:", "").trim();

    socketB.emit("send_message", {
      roomId,
      userId: userB,
      message
    });

  }

  else {

    console.log("Use format:");
    console.log("A: your message");
    console.log("B: your message");

  }

});