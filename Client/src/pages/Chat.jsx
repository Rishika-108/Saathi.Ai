import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
const MESSAGE_CAP = 20;
import { socket } from "../socket";

const Chat = ({ roomId: initialRoom }) => {
  const [messages, setMessages] = useState([]);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const [roomId, setRoomId] = useState(initialRoom ?? null);
  const [chatEnded, setChatEnded] = useState(false);
  const bottomRef = useRef(null);
  const userId = localStorage.getItem("userId");
  console.log("CHAT USER:", userId);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
    /* ========================= JOIN CHAT ========================= */ 
    useEffect(() => {
  if (!userId) return;

  console.log("Attempting to join chat...");
  socket.emit("join_chat", { userId });

  socket.on("joined_room", (room) => {
    console.log("Joined room:", room);

    setRoomId(room);
    localStorage.setItem("roomId", room);
  });

  socket.on("receive_message", ({ userId: sender, message }) => {
    console.log("RECEIVED MESSAGE EVENT:", sender, message);

    if (sender === userId) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "peer",
        text: message,
        timestamp: new Date(),
      },
    ]);
  });

  socket.on("chat_ended", () => {
    setChatEnded(true);
  });

  socket.on("error", (msg) => {
    console.error(msg);
  });

  return () => {
    socket.off("joined_room");
    socket.off("receive_message");
    socket.off("chat_ended");
    socket.off("error");
  };
}, []);
  /* ========================= SEND MESSAGE ========================= */
  const handleSend = (text) => {
    console.log("SEND BUTTON CLICKED");
    console.log("Text:", text);
    console.log("RoomID:", roomId);
    console.log("UserID:", userId);
    console.log("Disclaimer accepted:", hasAcceptedDisclaimer);
    console.log("First message sent:", hasSentFirstMessage);
    console.log("Chat ended:", chatEnded);
    if (!text.trim()) return;
    if (!hasAcceptedDisclaimer && !hasSentFirstMessage) return;
    if (!roomId) return;
    if (chatEnded) return;
    const messageObj = {
      id: Date.now(),
      sender: "me",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, messageObj]);
    socket.emit("send_message", { roomId, userId, message: text });
    setHasSentFirstMessage(true);
  };
  const isCapReached = messages.length >= MESSAGE_CAP || chatEnded;
  return (
    <div className="flex flex-col h-screen bg-background">
      {" "}
      <ChatHeader /> <MessageList
        messages={messages}
        bottomRef={bottomRef}
      />{" "}
      <MessageInput
        onSend={handleSend}
        hasAcceptedDisclaimer={hasAcceptedDisclaimer}
        setHasAcceptedDisclaimer={setHasAcceptedDisclaimer}
        hasSentFirstMessage={hasSentFirstMessage}
        isCapReached={isCapReached}
        messageCount={messages.length}
        messageCap={MESSAGE_CAP}
      />{" "}
      {chatEnded && (
        <div className="text-center text-sm text-textSecondary p-3 border-t border-borderColor">
          {" "}
          This peer session has ended. Take time to reflect before your next
          connection.{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default Chat;
