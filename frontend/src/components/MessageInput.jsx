import { Send, Smile } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
/**
 * MessageInput Component
 * ----------------------
 * - Renders the chat input area for the user
 * - Features:
 *    • Textarea input for typing messages
 *    • Emoji picker toggle button
 *    • Send button
 * - Props:
 *    @param inputMessage {string} - Current input text
 *    @param setInputMessage {function} - Setter for input text
 *    @param sendMessage {function} - Function to send the message
 *    @param isLoading {boolean} - Disable input & buttons while processing
 *    @param handleKeyPress {function} - Handle Enter key press for sending
 *    @param showEmojiPicker {boolean} - Controls visibility of emoji picker
 *    @param setShowEmojiPicker {function} - Toggle emoji picker visibility
 *    @param pickerRef {object} - Ref for emoji picker DOM element
 *    @param handleEmojiSelect {function} - Callback when an emoji is selected
 */
const MessageInput = ({
  inputMessage,
  setInputMessage,
  sendMessage,
  isLoading,
  handleKeyPress,
  showEmojiPicker,
  setShowEmojiPicker,
  pickerRef,
  handleEmojiSelect,
}) => {
  return (
    <div className="flex items-center px-4 py-2 bg-gray-300 space-x-3 relative">
      {/* Input container */}
      <div className="flex-1 relative">
        {/* Textarea for user message */}
        <textarea
          value={inputMessage} // Controlled input value
          onChange={(e) => setInputMessage(e.target.value)} // Update value on change
          onKeyPress={handleKeyPress} // Handle Enter key
          placeholder="Ask Medical Chatbot…"
          className="w-full px-4 py-2 pr-12 text-black bg-transparent focus:outline-none resize-none"
          rows={1}
          style={{ minHeight: "40px", maxHeight: "100px" }} // Dynamic height limits
          disabled={isLoading} // Disable while loading
        />
        {/* Emoji toggle button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)} // Toggle picker
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
          disabled={isLoading} // Disable while loading
        >
          <Smile className="w-8 h-8 text-center" />
        </button>
        {/* Emoji picker dropdown */}
        {showEmojiPicker && (
          <EmojiPicker
            pickerRef={pickerRef} // Ref to detect outside clicks
            handleEmojiSelect={handleEmojiSelect} // Callback when emoji selected
          />
        )}
      </div>
      {/* Send button */}
      <button
        onClick={sendMessage} // Send the message
        disabled={!inputMessage.trim() || isLoading} // Disable if input empty or loading
        className="w-10 h-10 bg-gray-600 hover:bg-gray-500 active:bg-gray-700 rounded-full 
                   flex items-center justify-center shadow-md transition-all duration-200 
                   disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5 text-white transition-colors duration-500" />
      </button>
    </div>
  );
};
export default MessageInput;
