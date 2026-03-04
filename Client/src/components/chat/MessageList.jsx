import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, bottomRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
