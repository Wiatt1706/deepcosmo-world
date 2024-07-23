"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import { drawRuler, getMouseupPixel } from "./helpers/BaseDraw";
import { useEvent } from "../utils/GeneralEvent";
import { PixelBlock } from "@/types/MapTypes";
import { Position } from "@/types/CanvasTypes";
import { useBaseStore, useEditMapStore } from "./SocketManager";

const ShowMapCanvas = ({
  initData,
  scale,
  containerWidth,
  containerHeight,
}: {
  initData?: PixelBlock[];
  scale: number;
  containerWidth?: number;
  containerHeight?: number;
  onSelectedPixelBlockChange?: (block: PixelBlock | null) => void; // Define the type
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  const [model, setModel, selectedPixelBlock, setSelectedPixelBlock] =
    useBaseStore((state: any) => [
      state.model,
      state.setModel,
      state.selectedPixelBlock,
      state.setSelectedPixelBlock,
    ]);

  const [toolInfo, pixelBlocks, setPixelBlocks, setInitData] = useEditMapStore(
    (state: any) => [
      state.toolInfo,
      state.pixelBlocks,
      state.setTerrainInfo,
      state.setPixelBlocks,
      state.setInitData,
    ]
  );

  const [showCoordinates, setShowCoordinates] = useState<PixelBlock[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<Position>({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<Position | null>(null);

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
    if (model === "EDIT") {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
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
  }, [scale, mapCenter, showCoordinates, selectedPixelBlock, mousePosition]);

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

    switch (model) {
      case "OBSERVE":
      
        break;
      case "EDIT":
        // handle EDIT mode mouse up actions here if needed
        break;

      default:
        break;
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

    const CONVER_X = (x: number) => {
      return (x - mapCenter.x) * scale + canvasWidth / 2 + padding;
    };
    const CONVER_Y = (y: number) => {
      return (y - mapCenter.y) * scale + canvasHeight / 2 + padding;
    };
    const CONVER_WIDTH = (width: number) => {
      return width * scale - 2 * padding;
    };
    const CONVER_HEIGHT = (height: number) => {
      return height * scale - 2 * padding;
    };

   

    if (model === "EDIT" && mousePosition) {
      // 计算鼠标位置所在的像素块坐标
      const mousePixel = getMouseupPixel(
        { clientX: mousePosition.x, clientY: mousePosition.y } as MouseEvent,
        buffCanvas,
        scale,
        mapCenter
      );

      // 将鼠标位置映射到像素块网格上
      const gridX =
        Math.floor(mousePixel.x / toolInfo.pixelSize) * toolInfo.pixelSize;
      const gridY =
        Math.floor(mousePixel.y / toolInfo.pixelSize) * toolInfo.pixelSize;

      // 计算辅助方格的实际绘制位置和尺寸
      const brushSizeInPixels = toolInfo.pixelSize * toolInfo.brushSize;
      const mouseScaledX = CONVER_X(gridX);
      const mouseScaledY = CONVER_Y(gridY);
      const mouseScaledWidth = CONVER_WIDTH(brushSizeInPixels);
      const mouseScaledHeight = CONVER_HEIGHT(brushSizeInPixels);

      buffCtx.save();
      buffCtx.globalAlpha = 0.5;
      buffCtx.fillStyle = "rgba(0, 111, 239, 0.5)";
      buffCtx.fillRect(
        mouseScaledX,
        mouseScaledY,
        mouseScaledWidth,
        mouseScaledHeight
      );
      buffCtx.restore();
    }

  
  };

  useEffect(() => {
    throttledFetchData();
  }, [
    mapCenter,
    scale,
    pixelBlocks,
    toolInfo,
    selectedPixelBlock,
    throttledFetchData,
  ]);

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
