import { useState, useRef, useEffect } from "react";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";

const MESSAGE_CAP = 20;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);

  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    if (!hasAcceptedDisclaimer && !hasSentFirstMessage) return;
    if (messages.length >= MESSAGE_CAP) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setHasSentFirstMessage(true);

    // Mock peer response
    setTimeout(() => {
      setMessages((prev) => {
        if (prev.length >= MESSAGE_CAP) return prev;
        return [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "peer",
            text: "Thank you for sharing. I’m here with you.",
            timestamp: new Date(),
          },
        ];
      });
    }, 1500);
  };

  const isCapReached = messages.length >= MESSAGE_CAP;

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />

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
    </div>
  );
};

export default Chat;