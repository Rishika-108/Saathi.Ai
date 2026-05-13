import { FiClock } from "react-icons/fi";

const ChatHeader = ({ timeLeft }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-borderColor surface shadow-soft">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="font-semibold text-textPrimary">
            Peer Support Session
          </h2>
          <p className="text-sm text-textSecondary">
            Structured • Confidential • 20 Message Limit
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary font-medium text-sm">
        <FiClock size={14} />
        {timeLeft || "15:00"}
      </div>
    </div>
  );
};

export default ChatHeader;