import { AlertCircle } from 'lucide-react';
import img from "../assets/img.png";
import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import MessageInput from '../components/MessageInput';
import { useChat } from '../hooks/useChat';
import { useEmoji } from '../hooks/useEmoji';
import { useScroll } from '../hooks/useScroll';
import { useFormatTime } from '../hooks/useFormatTime';
/**
 * MedicalChatbot Component
 * ------------------------
 * Main chat interface for the AI-powered medical assistant.
 * Features:
 *  - Header with bot avatar and title
 *  - Scrollable chat messages (user & bot)
 *  - Emoji picker integration
 *  - Message input with send button
 *  - Error handling and bot typing animation
 */
const MedicalChatbot = () => {
  // Custom hook to manage chat state and API interactions
  const { messages, isLoading, error, inputMessage, setInputMessage, sendMessage, handleKeyPress } = useChat();
  // Custom hook to manage emoji picker state
  const { showEmojiPicker, toggleEmojiPicker, pickerRef, handleEmojiSelect } = useEmoji((emoji) => {
    setInputMessage(prev => prev + emoji); // Append selected emoji to input
  });
  // Hook to auto-scroll to the latest message
  const messagesEndRef = useScroll(messages);
  // Hook to format timestamps in HH:MM format
  const formatTime = useFormatTime();
  return (
    <div className="flex flex-col h-screen relative">
      {/* Background: Radial grid pattern */}
      <div className="absolute h-full w-full 
                  bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] 
                  [background-size:16px_16px] 
                  [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      {/* Header with bot avatar and title */}
      <Header />
      {/* Error message */}
      {error && (
        <div className="bg-gray-300 border-l-4 border-red-400 p-4 m-4 flex">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="ml-3 text-sm text-red-700">{error}</p>
        </div>
      )}
      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-900">
        {messages.map((msg) =>
          // Special rendering for initial timestamp-only message
          msg.id === 1 ? (
            <div key={msg.id} className="text-center text-gray-400 text-sm">
              {formatTime(msg.timestamp)}
            </div>
          ) : (
            <ChatMessage
              key={msg.id}
              message={msg}
              formatTime={formatTime}
            />
          )
        )}
        {/* Bot typing indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2">
            {/* Bot avatar */}
            <img 
              src={img}
              alt="Bot" 
              className="w-8 h-8 rounded-full object-cover" 
            />
            {/* Chat bubble with animated dots */}
            <div className="bg-gray-300 text-white px-4 py-2 rounded-bl-none flex items-center space-x-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            </div>
          </div>
        )}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      {/* Message input with send button and emoji picker */}
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={() => sendMessage(inputMessage)}
        isLoading={isLoading}
        handleKeyPress={handleKeyPress}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={toggleEmojiPicker}
        pickerRef={pickerRef}
        handleEmojiSelect={handleEmojiSelect}
      />
    </div>
  );
};
export default MedicalChatbot;
