import { useState, useCallback } from "react";
import DisclaimerNotice from "./DisclaimerNotice";

const MessageInput = ({
  onSend,
  hasAcceptedDisclaimer,
  setHasAcceptedDisclaimer,
  hasSentFirstMessage,
  isCapReached,
  messageCount,
  messageCap,
}) => {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const isFirstBlocked =
    !hasSentFirstMessage && !hasAcceptedDisclaimer;

  const isDisabled = isCapReached || isFirstBlocked || isSending;

  const handleSend = useCallback(() => {
    if (!input.trim() || isDisabled) return;

    setIsSending(true);

    onSend(input.trim());
    setInput("");

    // Small delay to prevent accidental rapid double clicks
    setTimeout(() => {
      setIsSending(false);
    }, 250);
  }, [input, isDisabled, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const remainingMessages = messageCap - messageCount;
  const isNearLimit = remainingMessages <= 3 && !isCapReached;

  return (
    <div
      className="p-4 border-t border-borderColor surface space-y-3"
      role="region"
      aria-label="Chat input area"
    >
      {/* Disclaimer (Only before first message) */}
      {!hasSentFirstMessage && (
        <DisclaimerNotice
          hasAcceptedDisclaimer={hasAcceptedDisclaimer}
          setHasAcceptedDisclaimer={setHasAcceptedDisclaimer}
        />
      )}

      {/* Message Cap Indicator */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-textMuted">
          {messageCount} / {messageCap} messages used
        </span>

        {isNearLimit && (
          <span className="text-error">
            {remainingMessages} messages remaining
          </span>
        )}
      </div>

      {/* Cap Reached Message */}
      {isCapReached && (
        <div
          className="text-sm text-error bg-primary-soft border border-borderColor rounded-md p-3"
          role="alert"
        >
          This session has reached its message limit.
          <br />
          Take time to reflect before your next session.
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isCapReached}
          rows={1}
          placeholder="Type your message..."
          aria-label="Type your message"
          className={`
            flex-1 resize-none px-4 py-2
            rounded-lg border border-borderColor
            bg-surface
            focus:outline-none focus:ring-2 focus:ring-primary
            transition
            disabled:opacity-50
          `}
        />

        <button
          onClick={handleSend}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-label="Send message"
          className={`
            px-6 py-2 rounded-lg
            bg-primary text-white
            shadow-soft
            hover:opacity-90
            active:scale-95
            transition
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;