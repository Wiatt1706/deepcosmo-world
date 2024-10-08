import { Position } from "@/types/CanvasTypes";
import { useState, useEffect, useRef, MutableRefObject } from "react";

const useDraggable = (
  ref: MutableRefObject<HTMLElement | null>,
  initialPosition: Position,
  scale: number
): Position => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const dragStartRef = useRef<Position | null>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDrag(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrag || !dragStartRef.current) return;

      const deltaX = (e.clientX - dragStartRef.current.x) / scale;
      const deltaY = (e.clientY - dragStartRef.current.y) / scale;

      setPosition((prev) => ({
        x: prev.x - deltaX,
        y: prev.y - deltaY,
      }));

      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDrag(false);
      dragStartRef.current = null;
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("mousedown", handleMouseDown);
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseup", handleMouseUp);
      element.addEventListener("mouseleave", handleMouseUp);
    }

    return () => {
      if (element) {
        element.removeEventListener("mousedown", handleMouseDown);
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseup", handleMouseUp);
        element.removeEventListener("mouseleave", handleMouseUp);
      }
    };
  }, [ref, isDrag, scale]);

  return position;
};

export default useDraggable;
