/**
 * API and Emoji Configuration
 * ---------------------------
 * Centralized configuration for the app:
 * 1. API_BASE_URL → Base URL for backend API requests
 * 2. emojis → Array of emojis used in the EmojiPicker component
 */
// Base URL for API requests
// Uses Vite environment variable if available, otherwise defaults to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
// List of emojis available for the EmojiPicker component
export const emojis = [
    "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰",
    "😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🤩","🥳","😏",
    "😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😤","😠",
    "😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🤭","🤫","🤥",
    "😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐",
    "🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","👹","👺","🤡","💩","👻",
    "💀","☠️","👽","👾","🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾","❤️",
    "🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘",
    "💝","💟","👍","👎","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕",
    "👇","☝️","👋","🤚","🖐","✋","🖖","👏","🙌","🤝","🙏","✍️","💅","🤳","💪","🦾"
];
