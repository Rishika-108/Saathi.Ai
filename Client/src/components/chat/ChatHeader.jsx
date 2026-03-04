// import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
//   const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 p-4 border-b border-borderColor surface shadow-soft">
      {/* <button
        onClick={() => navigate(-1)}
        className="text-textSecondary hover:text-textPrimary text-xl"
      >
        ←
      </button> */}

      <div>
        <h2 className="font-semibold text-textPrimary">
          Peer Support Session
        </h2>
        <p className="text-sm text-textSecondary">
          Structured • Confidential • 20 Message Limit
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;