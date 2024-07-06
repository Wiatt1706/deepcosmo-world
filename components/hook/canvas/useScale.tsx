import { useState, useEffect } from "react";

const useScale = (
  initialScale = 1.5,
  minScale = 0.5,
  maxScale = 3,
  target?: HTMLDivElement | null
) => {
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

    const eventTarget = target || window;
    eventTarget.addEventListener("wheel", handleWheel as EventListener);

    return () => {
      eventTarget.removeEventListener("wheel", handleWheel as EventListener);
    };
  }, [minScale, maxScale, target]);

  return scale;
};

export default useScale;
