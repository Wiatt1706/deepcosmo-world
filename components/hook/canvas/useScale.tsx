import { useState, useEffect } from "react";

const useScale = (initialScale = 1.5, minScale = 0.5, maxScale = 3) => {
  const [scale, setScale] = useState(initialScale);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      setScale((prevScale) => {
        let newScale = prevScale - event.deltaY * 0.001;
        newScale = Math.min(Math.max(newScale, minScale), maxScale);
        return newScale;
      });
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [minScale, maxScale]);

  return scale;
};

export default useScale;
