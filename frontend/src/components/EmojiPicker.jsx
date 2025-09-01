import { emojis } from "../config/config";
/**
 * EmojiPicker Component
 * ---------------------
 * - Displays a grid of emojis inside a dropdown-style picker
 * - Allows users to select an emoji by clicking on it
 * - Appears above the input box (absolute positioned)
 * 
 * Props:
 * @param {object} pickerRef - React ref to control the picker element (e.g., for closing on outside click)
 * @param {function} handleEmojiSelect - Callback triggered when an emoji is clicked, returns the selected emoji
 */
const EmojiPicker = ({ pickerRef, handleEmojiSelect }) => {
  return (
    <div
      ref={pickerRef} // Attach ref for external click detection or focus control
      className="absolute bottom-full right-0 mb-2 w-80 h-48 bg-gray-300 rounded-lg shadow-lg overflow-hidden z-50"
    >
      {/* Emoji grid: 8 columns, scrollable if too many emojis */}
      <div className="grid grid-cols-8 gap-1 p-3 overflow-y-auto h-40">
        {emojis.map((emoji, i) => (
          <button
            key={i} // Unique key for each emoji button
            onClick={() => handleEmojiSelect(emoji)} // Call parent function with selected emoji
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-300 rounded transition-colors duration-150"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
export default EmojiPicker;
