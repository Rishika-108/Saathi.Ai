import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
const MESSAGE_CAP = 30;
const SOCKET_URL = "http://localhost:5000";

const Chat = ({ roomId: initialRoom }) => {
  const params = useParams();
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const [roomId, setRoomId] = useState(initialRoom ?? params.roomId ?? null);
  const [chatEnded, setChatEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isHighRisk, setIsHighRisk] = useState(false);
  const bottomRef = useRef(null);
  const userId = localStorage.getItem("userId");
  
  console.log("CHAT USER:", userId);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ========================= TIMER LOGIC ========================= */
  useEffect(() => {
    if (chatEnded || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [chatEnded, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  /* ========================= JOIN CHAT ========================= */
  useEffect(() => {
    if (!userId) return;

    console.log("Attempting to connect to socket...");
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected, joining chat...");
      socket.emit("join_chat", { userId });
    });

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

    socket.on("chat_ended", ({ reason, riskLevel } = {}) => {
      console.log("Chat ended event:", reason);
      setChatEnded(true);
      if (riskLevel === "HIGH" || reason === "safety_escalation") {
        setIsHighRisk(true);
      }
    });

    socket.on("error", (msg) => {
      console.error("Socket Error:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

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
    socketRef.current?.emit("send_message", { roomId, userId, message: text });
    setHasSentFirstMessage(true);
  };
  const isCapReached = messages.length >= MESSAGE_CAP || chatEnded;
  return (
    <div className="flex flex-col h-screen bg-background relative">
      <ChatHeader timeLeft={formatTime(timeLeft)} />

      {isHighRisk && (
        <div className="bg-error/10 border-b border-error/20 p-4 text-center">
          <p className="text-error font-semibold text-sm">
            Safety Alert: This session has been paused for your wellbeing.
            Please consider reaching out to professional support.
          </p>
          <button className="text-primary text-xs underline mt-1">View Crisis Resources</button>
        </div>
      )}

      <MessageList messages={messages} bottomRef={bottomRef} />

      <MessageInput
        onSend={handleSend}
        hasAcceptedDisclaimer={hasAcceptedDisclaimer}
        setHasAcceptedDisclaimer={setHasAcceptedDisclaimer}
        hasSentFirstMessage={hasSentFirstMessage}
        isCapReached={isCapReached}
        messageCount={messages.length}
        messageCap={MESSAGE_CAP}
      />

      {chatEnded && !isHighRisk && (
        <div className="text-center text-sm text-textSecondary p-3 border-t border-borderColor">
          This peer session has ended. Take time to reflect before your next connection.
        </div>
      )}
    </div>
  );
};
export default Chat;
