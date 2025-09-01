import { useState } from 'react';
import { API_BASE_URL } from '../config/config';
/**
 * useChat Hook
 * -------------
 * Custom hook to manage chat state and interactions with the backend.
 * Features:
 *  - Maintains messages list (user + bot)
 *  - Tracks loading and error states
 *  - Handles sending messages to API
 *  - Supports Enter key press to send message
 */
export function useChat() {
  // List of all chat messages (user and bot)
  const [messages, setMessages] = useState([
    {
      id: 1,
      timestamp: new Date() // Initial empty message with timestamp
    }
  ]);
  // Loading state while waiting for API response
  const [isLoading, setIsLoading] = useState(false);
  // Stores any error messages during API calls
  const [error, setError] = useState('');
  // Controlled input for the message textarea
  const [inputMessage, setInputMessage] = useState('');
  /**
   * sendMessage
   * -----------
   * Sends a message to the backend API and updates chat messages.
   * @param {string} messageText - Text input by the user
   */
  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return; // Prevent empty or concurrent sends
    // Create user message object
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    // Update messages with the user's message
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true); // Set loading state
    setError('');       // Clear previous errors
    setInputMessage(''); // Clear input field
    try {
      // Call the backend API
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });
      if (!response.ok) throw new Error("Failed to get response");
      // Parse response JSON
      const data = await response.json();
      // Create bot message object
      const botMessage = {
        id: Date.now() + 1, // Unique ID for bot message
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        sources: data.source_documents // Optional sources array
      };
      // Update messages with bot response
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err.message);
      // Append error message from bot
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };
  /**
   * handleKeyPress
   * --------------
   * Sends message when Enter key is pressed (without Shift)
   * @param {KeyboardEvent} e 
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };
  // Return all state and functions needed by chat components
  return { 
    messages, 
    setMessages, 
    isLoading, 
    error, 
    inputMessage, 
    setInputMessage, 
    sendMessage, 
    handleKeyPress 
  };
}
