"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import { drawAim, drawRuler, getMouseupPixel } from "./helpers/BaseDraw";
import { useEvent } from "../utils/GeneralEvent";
import { PixelBlock } from "@/types/MapTypes";
import { Position } from "@/types/CanvasTypes";
import { useBaseStore, useEditMapStore } from "./SocketManager";

const ShowMapCanvas = ({
  initData,
  scale,
  containerWidth,
  containerHeight,
  onSelectedPixelBlockChange, // Add this prop
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
      state.setPixelBlocks,
      state.setInitData,
    ]
  );

  const [showCoordinates, setShowCoordinates] = useState<PixelBlock[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<Position>({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  const [flashOverlap, setFlashOverlap] = useState(false);

  const dragStartRef = useRef<Position | null>(null);

  useEvent("mouseup", (e: MouseEvent) => {
    if (isDrag) {
      if (!isDragging) {
        handleMouseUp(e);
      }
      setIsDragging(false);
      setIsDrag(false);
      dragStartRef.current = null;
    }
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
  }, [
    scale,
    mapCenter,
    showCoordinates,
    selectedPixelBlock,
    mousePosition,
    flashOverlap,
  ]);

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

    switch (model) {
      case "OBSERVE":
        const clickedPixelBlock = showCoordinates.find(
          (block) =>
            buffPosition.x >= block.x &&
            buffPosition.x < block.x + block.width &&
            buffPosition.y >= block.y &&
            buffPosition.y < block.y + block.height
        );

        if (onSelectedPixelBlockChange) {
          setSelectedPixelBlock(clickedPixelBlock || null);
          onSelectedPixelBlockChange(clickedPixelBlock || null); // Notify parent component
        }
        break;
      case "EDIT":
        if (mousePosition) {
          const { adjustedX, adjustedY, brushSizeInPixels } =
            calculatePixelBlockPosition(
              mousePosition,
              buffCanvas,
              scale,
              mapCenter,
              toolInfo.pixelSize,
              toolInfo.brushSize
            );

          // Check for overlap
          const isOverlapping = pixelBlocks.some((block: PixelBlock) =>
            checkOverlap(
              adjustedX,
              adjustedY,
              brushSizeInPixels,
              brushSizeInPixels,
              block
            )
          );

          if (!isOverlapping) {
            const newPixelBlock: PixelBlock = {
              id: adjustedX + "," + adjustedY,
              type: 1,
              x: adjustedX,
              y: adjustedY,
              width: brushSizeInPixels,
              height: brushSizeInPixels,
              color: toolInfo.editColor, // or any color property from toolInfo
            };
            setPixelBlocks([...pixelBlocks, newPixelBlock]);
          } else {
            // Trigger flash animation
            setFlashOverlap(true);
            setTimeout(() => setFlashOverlap(false), 300);
          }
        }
        break;
      default:
        break;
    }
  };

  const checkOverlap = (
    x: number,
    y: number,
    width: number,
    height: number,
    block: PixelBlock
  ) => {
    return (
      x < block.x + block.width &&
      x + width > block.x &&
      y < block.y + block.height &&
      y + height > block.y
    );
  };

  const calculatePixelBlockPosition = (
    mousePosition: Position,
    buffCanvas: HTMLCanvasElement,
    scale: number,
    mapCenter: Position,
    pixelSize: number,
    brushSize: number
  ): { adjustedX: number; adjustedY: number; brushSizeInPixels: number } => {
    const mousePixel = getMouseupPixel(
      {
        clientX: mousePosition.x,
        clientY: mousePosition.y,
      } as MouseEvent,
      buffCanvas,
      scale,
      mapCenter
    );

    const gridX = Math.floor(mousePixel.x / pixelSize) * pixelSize;
    const gridY = Math.floor(mousePixel.y / pixelSize) * pixelSize;
    const adjustedX = gridX - Math.floor(brushSize / 2) * pixelSize;
    const adjustedY = gridY - Math.floor(brushSize / 2) * pixelSize;
    const brushSizeInPixels = pixelSize * brushSize;

    return { adjustedX, adjustedY, brushSizeInPixels };
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

    const padding = (toolInfo.pixelPadding * scale) / dpr + 0.1;

    const CONVER_X = (x: number, p?: number) => {
      if (!p) p = padding;
      return (x - mapCenter.x) * scale + canvasWidth / 2 + p;
    };
    const CONVER_Y = (y: number, p?: number) => {
      if (!p) p = padding;
      return (y - mapCenter.y) * scale + canvasHeight / 2 + p;
    };
    const CONVER_WIDTH = (width: number, p?: number) => {
      if (!p) p = padding;
      return width * scale - 2 * p;
    };
    const CONVER_HEIGHT = (height: number, p?: number) => {
      if (!p) p = padding;
      return height * scale - 2 * p;
    };

    showCoordinates.forEach((coord) => {
      const scaledPadding = coord.borderSize
        ? padding + coord.borderSize
        : padding;
      const scaledX = CONVER_X(coord.x, scaledPadding);
      const scaledY = CONVER_Y(coord.y, scaledPadding);
      const scaledWidth = CONVER_WIDTH(coord.width, scaledPadding);
      const scaledHeight = CONVER_HEIGHT(coord.height, scaledPadding);

      buffCtx.fillStyle = coord.color;
      buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

      if (coord.imgSrc && imagesRef.current[coord.imgSrc]) {
        const img = imagesRef.current[coord.imgSrc];
        buffCtx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
      }
    });

    if (selectedPixelBlock) {
      const scaledX = CONVER_X(selectedPixelBlock.x);
      const scaledY = CONVER_Y(selectedPixelBlock.y);
      const scaledWidth = CONVER_WIDTH(selectedPixelBlock.width);
      const scaledHeight = CONVER_HEIGHT(selectedPixelBlock.height);
      // 被选中的像素块添加特殊样式，边框向内绘制
      buffCtx.save();
      buffCtx.beginPath();
      buffCtx.rect(scaledX, scaledY, scaledWidth, scaledHeight);
      buffCtx.clip();
      buffCtx.strokeStyle = "#006fef";
      buffCtx.lineWidth = 3 * dpr;
      buffCtx.strokeRect(
        scaledX + buffCtx.lineWidth / 2,
        scaledY + buffCtx.lineWidth / 2,
        scaledWidth - buffCtx.lineWidth,
        scaledHeight - buffCtx.lineWidth
      );
      buffCtx.restore();
    }

    if (model === "EDIT" && mousePosition) {
      const { adjustedX, adjustedY, brushSizeInPixels } =
        calculatePixelBlockPosition(
          mousePosition,
          buffCanvas,
          scale,
          mapCenter,
          toolInfo.pixelSize,
          toolInfo.brushSize
        );

      drawAim(
        buffCtx,
        toolInfo.pixelSize / 2,
        CONVER_X(adjustedX),
        CONVER_Y(adjustedY),
        CONVER_WIDTH(brushSizeInPixels),
        CONVER_HEIGHT(brushSizeInPixels)
      ); // 绘制辅助线

      if (flashOverlap) {
        buffCtx.strokeStyle = "red";
        buffCtx.lineWidth = 3;
        buffCtx.strokeRect(
          CONVER_X(adjustedX),
          CONVER_Y(adjustedY),
          CONVER_WIDTH(brushSizeInPixels),
          CONVER_HEIGHT(brushSizeInPixels)
        );
      }
    }

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
