import { useEffect } from "react";

/**
 * Custom Hook: useKeyboardShortcuts
 * Adds keyboard controls for the player
 *
 * @param {Object} callbacks - Object containing callback functions
 */
function useKeyboardShortcuts({
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeUp,
  onVolumeDown,
}) {
  useEffect(() => {
    /**
     * Handle keydown events
     * @param {KeyboardEvent} e - The keyboard event
     */
    const handleKeyPress = (e) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const isTyping = ["INPUT", "TEXTAREA"].includes(e.target.tagName);
      if (isTyping) return;

      // Handle different keys
      switch (e.key) {
        case " ": // Spacebar
        case "k": // K key (YouTube style)
          e.preventDefault(); // Prevent page scroll on spacebar
          onPlayPause();
          break;

        case "ArrowRight": // Right arrow
          e.preventDefault();
          onNext();
          break;

        case "ArrowLeft": // Left arrow
          e.preventDefault();
          onPrevious();
          break;

        case "ArrowUp": // Up arrow
          e.preventDefault();
          onVolumeUp();
          break;

        case "ArrowDown": // Down arrow
          e.preventDefault();
          onVolumeDown();
          break;

        default:
          // Do nothing for other keys
          break;
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup: Remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onPlayPause, onNext, onPrevious, onVolumeUp, onVolumeDown]);

  // This hook doesn't return anything, it just sets up the listeners
}

export default useKeyboardShortcuts;
