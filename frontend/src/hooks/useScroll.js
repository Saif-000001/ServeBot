import { useEffect, useRef } from "react";

/**
 * useScroll Hook
 * ---------------
 * Custom hook to automatically scroll a container (e.g., chat messages) to the bottom
 * whenever specified dependencies change.
 * 
 * @param {Array} deps - Dependencies that trigger the scroll when updated (e.g., messages array)
 * @returns {Object} messagesEndRef - Ref to attach to the "end" element of the scroll container
 * 
 * Usage:
 * const messagesEndRef = useScroll([messages]);
 * <div ref={messagesEndRef}></div>
 */
export const useScroll = (deps) => {
  // Ref pointing to the last element of the scrollable container
  const messagesEndRef = useRef(null);
  // Scroll to the ref whenever dependencies change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [deps]); // Re-run effect when any dependency changes
  return messagesEndRef;
};
