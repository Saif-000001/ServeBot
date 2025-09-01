/**
 * useFormatTime Hook
 * ------------------
 * Returns a function to format Date objects as "HH:MM" (24-hour or locale-based)
 * 
 * Usage:
 * const formatTime = useFormatTime();
 * formatTime(new Date()); 
 */
export function useFormatTime() {
  return (date) =>
    // Convert the Date object to a locale-specific time string with hours and minutes
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
