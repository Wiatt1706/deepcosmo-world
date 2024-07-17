"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import useScale from "../hook/canvas/useScale";
import { drawRuler, getMouseupPixel } from "./helpers/BaseDraw";
import { useEvent } from "../utils/GeneralEvent";
import { PixelBlock } from "@/types/MapTypes";
import { Position } from "@/types/CanvasTypes";
import { useEditMapStore } from "./SocketManager";

const ShowMapCanvas = ({
  initData,
  scale,
  handleActClick,
  containerWidth,
  containerHeight,
}: {
  initData?: PixelBlock[];
  scale: number;
  handleActClick?: (pixel: PixelBlock | null) => void;
  containerWidth?: number;
  containerHeight?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  const [
    toolInfo,
    terrainInfo,
    setTerrainInfo,
    pixelBlocks,
    setPixelBlocks,
    setInitData,
  ] = useEditMapStore((state: any) => [
    state.toolInfo,
    state.terrainInfo,
    state.setTerrainInfo,
    state.pixelBlocks,
    state.setPixelBlocks,
    state.setInitData,
  ]);

  const [showCoordinates, setShowCoordinates] = useState<PixelBlock[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);

  const [mapCenter, setMapCenter] = useState<Position>({ x: 0, y: 0 });
  const dragStartRef = useRef<Position | null>(null);

  useEvent("mouseup", (e: MouseEvent) => {
    if (!isDragging) {
      handleMouseUp(e);
    }
    setIsDragging(false);
    setIsDrag(false);
    dragStartRef.current = null;
  });

  useEvent(
    "mousedown",
    (e: MouseEvent) => {
      setIsDrag(true);
      setIsDragging(false);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    },
    containerRef.current
  );

  useEvent("mousemove", (e: MouseEvent) => {
    setIsDragging(true);
    if (!isDrag || !dragStartRef.current) return;

    const deltaX = (e.clientX - dragStartRef.current.x) / scale;
    const deltaY = (e.clientY - dragStartRef.current.y) / scale;

    setMapCenter((prev) => ({
      x: prev.x - deltaX,
      y: prev.y - deltaY,
    }));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  });

  const initializeCanvasSize = useCallback(() => {
    const container = containerRef.current;
    const buffCtx = buffRef?.current?.getContext("2d");

    if (!container || !buffCtx) return;

    const dpr = window.devicePixelRatio;
    buffCtx.canvas.width = Math.round(container.clientWidth * dpr);
    buffCtx.canvas.height = Math.round(container.clientHeight * dpr);

    buffCtx.canvas.style.width = `${container.clientWidth}px`;
    buffCtx.canvas.style.height = `${container.clientHeight}px`;
    buffCtx.scale(dpr, dpr);
  }, []);

  const fetchCoordinates = async (viewport: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): Promise<PixelBlock[]> => {
    return pixelBlocks.filter(
      (coord: PixelBlock) =>
        coord.x >= viewport.x &&
        coord.x <= viewport.x + viewport.width &&
        coord.y >= viewport.y &&
        coord.y <= viewport.y + viewport.height
    );
  };

  const fetchData = async () => {
    const buffCtx = buffRef.current?.getContext("2d");
    if (!buffCtx) return;

    const viewport = {
      x: mapCenter.x - buffCtx.canvas.width / (2 * scale),
      y: mapCenter.y - buffCtx.canvas.height / (2 * scale),
      width: buffCtx.canvas.width / scale,
      height: buffCtx.canvas.height / scale,
    };

    const newCoordinates = await fetchCoordinates(viewport);

    for (const coord of newCoordinates) {
      if (coord.imgSrc && !imagesRef.current[coord.imgSrc]) {
        const img = new Image();
        img.src = coord.imgSrc;
        imagesRef.current[coord.imgSrc] = img;
      }
    }

    setShowCoordinates(newCoordinates);
  };

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

  const throttledFetchData = useCallback(throttle(fetchData, 500), [
    mapCenter,
    scale,
    pixelBlocks,
  ]);

  const render = useCallback(() => {
    const buffCtx = buffRef.current?.getContext("2d");
    if (!buffCtx) return;
    buffCtx.clearRect(0, 0, buffCtx.canvas.width, buffCtx.canvas.height);
    drawBuff();
  }, [scale, mapCenter, showCoordinates]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      initializeCanvasSize();
      throttledFetchData(); // Fetch data after resizing
      render(); // Render after fetching data
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial render
    initializeCanvasSize();
    throttledFetchData();
    render();

    return () => {
      resizeObserver.disconnect();
    };
  }, [initializeCanvasSize, throttledFetchData, render]);

  useEffect(() => {
    if (initData) {
      setInitData(initData);
      setPixelBlocks(initData);
      setShowCoordinates(initData);
    }
  }, [initData]);

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();

    const buffCanvas = buffRef.current;
    const buffCtx = buffCanvas?.getContext("2d");
    if (!buffCanvas || !buffCtx) return;

    const buffPosition = getMouseupPixel(e, buffCanvas, scale, mapCenter);

    const clickedPixelBlock = showCoordinates.find(
      (block) =>
        buffPosition.x >= block.x &&
        buffPosition.x < block.x + block.width &&
        buffPosition.y >= block.y &&
        buffPosition.y < block.y + block.height
    );

    if (clickedPixelBlock) {
      handleActClick?.(clickedPixelBlock);
    } else {
      handleActClick?.(null);
    }
  };

  const drawBuff = () => {
    const buffCanvas = buffRef.current;
    const dpr = window.devicePixelRatio;
    if (!buffCanvas) return;
    const buffCtx = buffCanvas.getContext("2d");
    if (!buffCtx) return;
    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);

    const canvasWidth = buffCtx.canvas.width / dpr;
    const canvasHeight = buffCtx.canvas.height / dpr;

    const padding = (toolInfo.pixelPadding * scale) / dpr;
    showCoordinates.forEach((coord) => {
      const scaledX =
        (coord.x - mapCenter.x) * scale + canvasWidth / 2 + padding;
      const scaledY =
        (coord.y - mapCenter.y) * scale + canvasHeight / 2 + padding;
      const scaledWidth = coord.width * scale - 2 * padding;
      const scaledHeight = coord.height * scale - 2 * padding;

      buffCtx.fillStyle = coord.color;
      buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

      if (coord.imgSrc && imagesRef.current[coord.imgSrc]) {
        const img = imagesRef.current[coord.imgSrc];
        buffCtx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
      }
    });
    if (toolInfo.isGrid) {
      drawRuler(
        buffCtx,
        mapCenter,
        scale,
        toolInfo.pixelSize,
        canvasWidth,
        canvasHeight
      );
    }
  };

  useEffect(() => {
    throttledFetchData();
  }, [mapCenter, scale, pixelBlocks, toolInfo, throttledFetchData]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [render]);

  return (
    <div
      className={styles["show-canvas-container"]}
      ref={containerRef}
      style={{
        width: containerWidth || "100%",
        height: containerHeight || "100%",
      }}
    >
      <canvas ref={buffRef} />
    </div>
  );
};

export default ShowMapCanvas;
