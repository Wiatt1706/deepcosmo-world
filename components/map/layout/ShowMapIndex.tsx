"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import useScale from "@/components/hook/canvas/useScale";
import ShowMapCanvas from "../ShowMapCanvas";

export default function ShowMapIndex() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scale, setScale } = useScale(1, 0.2, 5, containerRef.current);
  const handleIncreaseScale = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 5));
  };

  const handleDecreaseScale = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.3));
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <ShowMapCanvas scale={scale} />
    </div>
  );
}
