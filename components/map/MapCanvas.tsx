"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import useScale from "../hook/canvas/useScale";
import useDraggable from "../hook/canvas/useDraggable";
import { drawRuler, getMouseupPixel } from "./helpers/BaseDraw";
import { useEvent } from "../utils/GeneralEvent";
import { useMapStore } from "./SocketManager";
import { PixelBlock } from "@/types/MapTypes";
import algorithm from "./helpers/algorithm";
import { BottomToolView } from "./tool-layout";

const MapCanvas = () => {
  const [toolInfo, pixelBlocks] = useMapStore((state: any) => [
    state.toolInfo,
    state.pixelBlocks,
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  const [coordinates, setCoordinates] = useState<PixelBlock[]>([]);
  const [showCoordinates, setShowCoordinates] = useState<PixelBlock[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const scale = useScale(1, 0.5, 5);
  const mapCenter = useDraggable(buffRef, { x: 0, y: 0 }, scale);

  useEffect(() => {
    const initializeCanvasSize = () => {
      const container = containerRef.current;
      const buffCtx = buffRef?.current?.getContext("2d");

      if (!container || !buffCtx) return;

      const dpr = window.devicePixelRatio;
      buffCtx.canvas.width = Math.round(container.clientWidth * dpr);
      buffCtx.canvas.height = Math.round(container.clientHeight * dpr);

      buffCtx.canvas.style.width = `${container.clientWidth}px`;
      buffCtx.canvas.style.height = `${container.clientHeight}px`;
      buffCtx.scale(dpr, dpr);
    };

    initializeCanvasSize();
  }, []);

  useEvent(
    "mouseup",
    (e: MouseEvent) => {
      if (!isDragging) {
        handleMouseUp(e);
      }
      setIsDragging(false);
    },
    containerRef.current
  );

  useEvent(
    "mousedown",
    () => {
      setIsDragging(false);
    },
    containerRef.current
  );

  useEvent(
    "mousemove",
    () => {
      setIsDragging(true);
    },
    containerRef.current
  );

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    const buffCanvas = buffRef.current;
    const buffCtx = buffCanvas?.getContext("2d");
    if (!buffCanvas || !buffCtx) return;
    const buffPosition = getMouseupPixel(e, buffCanvas, scale, mapCenter);
    const coord = {
      x: Math.floor(buffPosition.x / toolInfo.pixelSize) * toolInfo.pixelSize,
      y: Math.floor(buffPosition.y / toolInfo.pixelSize) * toolInfo.pixelSize,
    };

    let width = toolInfo.pixelSize * toolInfo.brushSize;
    let height = toolInfo.pixelSize * toolInfo.brushSize;
    const pixel: PixelBlock = {
      id: `${coord.x}-${coord.y}`,
      type: "pixel",
      x: coord.x,
      y: coord.y,
      width,
      height,
      color: toolInfo.editColor,
    };
    setCoordinates((prev) => [...prev, pixel]);
  };

  // 渲染
  const render = useCallback(() => {
    const buffCtx = buffRef.current?.getContext("2d");
    if (!buffCtx) return;
    buffCtx.clearRect(0, 0, buffCtx.canvas.width, buffCtx.canvas.height);
    drawBuff();
  }, [scale, mapCenter, showCoordinates]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [render]);

  // 绘制缓冲区
  const drawBuff = () => {
    const buffCanvas = buffRef.current;
    const dpr = window.devicePixelRatio;
    if (!buffCanvas) return;
    const buffCtx = buffCanvas.getContext("2d");
    if (!buffCtx) return;
    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);

    const canvasWidth = buffCtx.canvas.width / dpr;
    const canvasHeight = buffCtx.canvas.height / dpr;

    // 绘制辅助线
    drawRuler(
      buffCtx,
      mapCenter,
      scale,
      toolInfo.pixelSize,
      canvasWidth,
      canvasHeight
    );

    // 绘制像素块
    showCoordinates.forEach((coord) => {
      const scaledX = (coord.x - mapCenter.x) * scale + canvasWidth / 2;
      const scaledY = (coord.y - mapCenter.y) * scale + canvasHeight / 2;
      const scaledWidth = coord.width * scale;
      const scaledHeight = coord.height * scale;
      buffCtx.fillStyle = coord.color;
      buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
      if (coord.imgSrc && imagesRef.current[coord.imgSrc]) {
        const img = imagesRef.current[coord.imgSrc];
        buffCtx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
      }
    });
  };

  // 节流函数，用于限制fetchData调用频率
  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function (this: any) {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  useEffect(() => {
    // throttledFetchData();
  }, [mapCenter, scale]);

  useEffect(() => {
    console.log("pixelBlocks", pixelBlocks);
    setShowCoordinates((prev) => [...prev, ...pixelBlocks]);
  }, [pixelBlocks]);

  return (
    <div className={styles["canvas-container"]} ref={containerRef}>
      <canvas ref={buffRef} />
      <BottomToolView />
    </div>
  );
};

export default MapCanvas;
