import { useState, useEffect, useRef } from "react";

const useScale = (
  initialScale = 1,
  minScale = 1,
  maxScale = 10,
  step = 1,
  target?: HTMLDivElement | null
) => {
  const [scale, setScale] = useState(initialScale);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (requestRef.current !== null) return;

      requestRef.current = requestAnimationFrame(() => {
        setScale((prevScale) => {
          let newScale = prevScale - Math.sign(event.deltaY) * step;
          newScale = Math.min(Math.max(newScale, minScale), maxScale);
          return newScale;
        });

        requestRef.current = null;
      });
    };

    const eventTarget = target || window;

    if (eventTarget) {
      eventTarget.addEventListener("wheel", handleWheel as EventListener, {
        passive: false,
      });
    }

    return () => {
      if (eventTarget) {
        eventTarget.removeEventListener("wheel", handleWheel as EventListener);
      }
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [target, minScale, maxScale, step]);

  return { scale, setScale };
};

export default useScale;
