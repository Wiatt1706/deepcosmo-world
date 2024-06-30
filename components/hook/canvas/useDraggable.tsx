import { Position } from "@/types/CanvasTypes";
import { useState, useEffect, useRef, MutableRefObject } from "react";


const useDraggable = (
  ref: MutableRefObject<HTMLElement | null>,
  initialPosition: Position,
  scale: number
): Position => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<Position | null>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;

      const deltaX = (e.clientX - dragStartRef.current.x) / scale;
      const deltaY = (e.clientY - dragStartRef.current.y) / scale;

      setPosition((prev) => ({
        x: prev.x - deltaX,
        y: prev.y - deltaY,
      }));

      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
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
  }, [ref, isDragging, scale]);

  return position;
};

export default useDraggable;
