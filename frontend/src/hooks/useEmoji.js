import { useState, useRef, useEffect } from "react";
/**
 * useEmoji Hook
 * -------------
 * Custom hook to manage emoji picker state and interactions.
 * Features:
 *  - Tracks visibility of the emoji picker
 *  - Provides a ref for detecting clicks outside the picker
 *  - Handles emoji selection and toggling picker
 * 
 * @param {function} onEmojiSelect - Callback fired when an emoji is selected
 */
export function useEmoji(onEmojiSelect) {
  // State: whether emoji picker is visible
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // Ref: attached to emoji picker to detect outside clicks
  const pickerRef = useRef(null);
  // Toggle visibility of emoji picker
  const toggleEmojiPicker = () => setShowEmojiPicker(prev => !prev);
  /**
   * handleEmojiSelect
   * -----------------
   * Called when user selects an emoji
   * - Fires callback with selected emoji
   * - Closes the picker
   * @param {string} emoji 
   */
  const handleEmojiSelect = (emoji) => {
    if (onEmojiSelect) onEmojiSelect(emoji);
    setShowEmojiPicker(false);
  };
  /**
   * useEffect → Outside click detection
   * ----------------------------------
   * Closes emoji picker when user clicks outside of it
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    // Listen for mouse down events on the whole document
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup: remove listener when component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Return state and handlers for the component to use
  return { showEmojiPicker, toggleEmojiPicker, pickerRef, handleEmojiSelect };
}
