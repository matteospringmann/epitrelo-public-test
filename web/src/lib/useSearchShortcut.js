// web/src/lib/useSearchShortcut.js
import { useEffect } from "react";

export default function useSearchShortcut(inputRef) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ⌘K (Mac) ou Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputRef]);
}