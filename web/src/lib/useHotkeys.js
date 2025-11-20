import { useEffect } from "react";

export default function useHotkeys(key, callback, deps = []) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isModifierPressed = event.ctrlKey || event.metaKey;

      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(
        event.target.tagName,
      );
      if (isTyping) {
        return;
      }

      if (event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, callback, ...deps]);
}
