import img from "../assets/img.png";
import { CheckCheck } from "lucide-react"; 
/**
 * ChatMessage Component
 * -----------------------------------------
 * Renders a single chat message in a conversation with:
 *  - User messages: right-aligned green bubble with double-check icon
 *  - Bot messages: left-aligned gray bubble with avatar
 *  - Error messages: red-tinted bubble
 *  - Timestamp inside the bubble (bottom-right)
 *  - "Sources" section if message includes source documents
 */
const ChatMessage = ({ message, formatTime }) => {
  // Determine if this message was sent by the user
  const isUser = message.sender === "user";
  // Check if this message represents an error
  const isError = message.isError;
  return (
    // Outer container → aligns messages to left (bot) or right (user)
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2 px-2`}>
      {/* Bot avatar → only shown for bot messages */}
      {!isUser && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-300 flex items-center justify-center">
            {/* Avatar image */}
            <img 
              src={img}
              alt="Bot" 
              className="w-8 h-8 rounded-full object-cover" 
            />
          </div>
        </div>
      )}
      {/* Chat bubble container */}
      <div
        className={`relative max-w-[70%] px-3 py-2 rounded-lg text-sm leading-relaxed shadow-sm break-words
          ${isUser ? "bg-gradient-to-br from-gray-300 to-gray-300 text-black rounded-br-none" : ""}
          ${!isUser && !isError ? "bg-gray-300 text-black  rounded-bl-none" : ""}
          ${isError ? "bg-gray-800 text-red-800 border border-red-300 rounded-bl-none" : ""}
        `}
      >
        {/* Main message text */}
        <p className="mb-2 pr-12">{message.text}</p>
        {/* Sources section → only appears if message includes sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 text-xs text-black border-l-2 border-gray-400 pl-2">
            <p className="font-medium">Sources:</p>
            <ul className="list-disc list-inside">
              {message.sources.map((src, i) => (
                <li key={i} className="truncate">{src}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Timestamp + only for user messages */}
        {isUser && (
          <span className="absolute bottom-1 right-2 flex items-center text-[10px] text-black space-x-1">
            {/* Message timestamp */}
            <span>{formatTime(message.timestamp)}</span>
            {/* Double-check icon */}
            <CheckCheck className="w-4 h-4 text-black" />
          </span>
        )}
        {/* Timestamp for bot messages → positioned inside bubble (bottom-right) */}
        {!isUser && (
          <span className="absolute bottom-1 right-2 text-[10px] text-black">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};
export default ChatMessage;
