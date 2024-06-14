import { useEffect } from "react";

export const useBaseKeyPress = (setKeys) => {
  useEffect(() => {
    const handleKey = (event, isKeyDown) => {
      const keyMap = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
        e: "e",
        v: "v",
        " ": "space", // Add spacebar key
      };

      const key = keyMap[event.key.toLowerCase()]; // Ensure case insensitivity
      if (key) {
        setKeys((keys) => ({ ...keys, [key]: isKeyDown }));
      }
    };

    const handleKeyDown = (event) => handleKey(event, true);
    const handleKeyUp = (event) => handleKey(event, false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setKeys]);
};
