// import { useMemo } from "react";
// const MessageBubble = ({ message }) => {
//   const isMe = message.sender === "me";
//   const formattedTime = useMemo(() => {
//     return message.timestamp.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   }, [message.timestamp]);

//   return (
//     <div
//       className={`w-full flex ${
//         isMe ? "justify-end" : "justify-start"
//       }`}
//     >
//       <div className="relative group max-w-[85%] sm:max-w-md md:max-w-lg">

//         {/* Bubble */}
//         <div
//           className={`
//             relative px-5 py-4
//             rounded-3xl
//             shadow-soft
//             border
//             break-words whitespace-pre-wrap
//             transition-all duration-300
//             hover:shadow-elevated
//             ${
//               isMe
//                 ? `
//                   bg-gradient-to-br from-primary-soft to-surface
//                   border-primary/30
//                   text-textPrimary
//                 `
//                 : `
//                   bg-surface-elevated
//                   border-borderColor
//                   text-textPrimary
//                 `
//             }
//           `}
//           role="article"
//           aria-label={`Message from ${isMe ? "you" : "peer"}`}
//         >
//           {/* Subtle Inner Glow for My Messages */}
//           {isMe && (
//             <div className="absolute inset-0 rounded-3xl bg-primary opacity-[0.03] pointer-events-none" />
//           )}

//           {/* Message Content */}
//           <p className="relative text-[15px] leading-relaxed tracking-[0.2px]">
//             {message.text}
//           </p>

//           {/* Timestamp */}
//           <div className="relative mt-3 flex justify-end">
//             <span className="text-[11px] tracking-wide text-textMuted group-hover:opacity-100 opacity-80 transition-opacity">
//               {formattedTime}
//             </span>
//           </div>
//         </div>

//         {/* Bubble Tail */}
//         <div
//           className={`
//             absolute bottom-2 w-3 h-3 rotate-45
//             ${
//               isMe
//                 ? `
//                   right-[-4px]
//                   bg-primary-soft
//                   border-r border-b border-primary/30
//                 `
//                 : `
//                   left-[-4px]
//                   bg-surface-elevated
//                   border-l border-b border-borderColor
//                 `
//             }
//           `}
//         />
//       </div>
//     </div>
//   );
// };

// export default MessageBubble;


const MessageBubble = ({ message }) => {
  const isMe = message.sender === "me";

  return (
    <div
      className={`max-w-xs px-4 py-3 rounded-lg shadow-soft break-words ${
        isMe
          ? "ml-auto bg-surface border border-borderColor text-primary"
          : "bg-surface-elevated border border-borderColor text-primary"
      }`}
    >
      <p>{message.text}</p>
      <p className="text-xs mt-1 opacity-70">
        {message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
};

export default MessageBubble;