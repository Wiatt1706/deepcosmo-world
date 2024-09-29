"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import {
  drawAim,
  drawGrid,
  drawRectFrame,
  drawRuler,
  getMouseupPixel,
  throttle,
} from "./helpers/BaseDraw";
import { useEvent } from "../utils/GeneralEvent";
import { PixelBlock } from "@/types/MapTypes";
import { Position } from "@/types/CanvasTypes";
import { useBaseStore, useEditMapStore } from "./SocketManager";
import { useCanvasSize } from "../hook/canvas/useCanvasBase";
const EditMapCanvas = ({
  initData,
  scale,
  onSelectedPixelBlockChange,
  rectSize,
}: {
  initData?: PixelBlock[];
  scale: number;
  onSelectedPixelBlockChange?: (block: PixelBlock | null) => void;
  rectSize?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  const [
    toolInfo,
    landInfo,
    model,
    setModel,
    selectedPixelBlock,
    setSelectedPixelBlock,
    setInitData,
  ] = useBaseStore((state: any) => [
    state.toolInfo,
    state.landInfo,
    state.model,
    state.setModel,
    state.selectedPixelBlock,
    state.setSelectedPixelBlock,
    state.setInitData,
  ]);

  const [pixelBlocks, setPixelBlocks] = useEditMapStore((state: any) => [
    state.pixelBlocks,
    state.setPixelBlocks,
  ]);

  const [showCoordinates, setShowCoordinates] = useState<PixelBlock[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<Position>({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  const [flashOverlap, setFlashOverlap] = useState(false);

  const dragStartRef = useRef<Position | null>(null);

  const initializeCanvasSize = useCanvasSize(containerRef, buffRef);

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

  const fetchCoordinates = async (viewport: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): Promise<PixelBlock[]> => {
    // Check for pixel blocks that overlap or intersect the viewport
    return pixelBlocks.filter(
      (block: PixelBlock) =>
        block.x + block.width >= viewport.x &&
        block.x <= viewport.x + viewport.width &&
        block.y + block.height >= viewport.y &&
        block.y <= viewport.y + viewport.height
    );
  };

  const fetchData = async () => {
    const buffCtx = buffRef.current?.getContext("2d");
    if (!buffCtx) return;

    // Calculate viewport bounds based on current canvas dimensions and scale
    const halfWidth = buffCtx.canvas.width / (2 * scale);
    const halfHeight = buffCtx.canvas.height / (2 * scale);

    const viewport = {
      x: mapCenter.x - halfWidth,
      y: mapCenter.y - halfHeight,
      width: buffCtx.canvas.width / scale,
      height: buffCtx.canvas.height / scale,
    };

    // Fetch and set pixel blocks that intersect with the current viewport
    const newCoordinates = await fetchCoordinates(viewport);

    // Handle the loading of any land cover images
    for (const coord of newCoordinates) {
      if (coord.landCoverImg && !imagesRef.current[coord.landCoverImg]) {
        const img = new Image();
        img.src = coord.landCoverImg;
        imagesRef.current[coord.landCoverImg] = img;
      }
    }

    // Update the state with the new coordinates
    setShowCoordinates(newCoordinates);
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

          // Check if the position is within the rectSize range
          const isInRectSizeRange = rectSize
            ? checkInRectSizeRange(
                adjustedX,
                adjustedY,
                brushSizeInPixels,
                brushSizeInPixels,
                rectSize
              )
            : true;

          const usePixelBlocks = toolInfo.brushSize * toolInfo.brushSize;
          const checkCapacityUsedBlocks = () => {
            return (
              landInfo.capacity_size >=
              landInfo.used_pixel_blocks + usePixelBlocks
            );
          };

          if (
            !isOverlapping &&
            isInRectSizeRange &&
            checkCapacityUsedBlocks()
          ) {
            const newPixelBlock: PixelBlock = {
              id: adjustedX + "," + adjustedY,
              type: 1,
              x: adjustedX,
              y: adjustedY,
              width: brushSizeInPixels,
              height: brushSizeInPixels,
              blockCount: usePixelBlocks,
              color: toolInfo.editColor,
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

  const checkInRectSizeRange = (
    x: number,
    y: number,
    width: number,
    height: number,
    rectSize: number
  ) => {
    const leftBoundary = -rectSize / 2;
    const rightBoundary = rectSize / 2;
    const topBoundary = -rectSize / 2;
    const bottomBoundary = rectSize / 2;

    return (
      x >= leftBoundary &&
      x + width <= rightBoundary &&
      y >= topBoundary &&
      y + height <= bottomBoundary
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

    const padding = (toolInfo.pixelPadding * scale) / dpr;

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

    if (toolInfo.isGrid) {
      drawGrid(
        buffCtx,
        mapCenter,
        scale,
        toolInfo.pixelSize,
        canvasWidth,
        canvasHeight,
        rectSize
      );
    }

    showCoordinates.forEach((coord) => {
      const scaledPadding = coord.borderSize
        ? padding + coord.borderSize * scale
        : padding;
      const scaledX = CONVER_X(coord.x, scaledPadding);
      const scaledY = CONVER_Y(coord.y, scaledPadding);
      const scaledWidth = CONVER_WIDTH(coord.width, scaledPadding);
      const scaledHeight = CONVER_HEIGHT(coord.height, scaledPadding);

      buffCtx.fillStyle = coord.color;
      buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

      if (coord.landCoverImg && imagesRef.current[coord.landCoverImg]) {
        const img = imagesRef.current[coord.landCoverImg];
        buffCtx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
      }
    });

    if (selectedPixelBlock) {
      const scaledX = CONVER_X(selectedPixelBlock.x);
      const scaledY = CONVER_Y(selectedPixelBlock.y);
      const scaledWidth = CONVER_WIDTH(selectedPixelBlock.width);
      const scaledHeight = CONVER_HEIGHT(selectedPixelBlock.height);
      drawRectFrame(buffCtx, scaledX, scaledY, scaledWidth, scaledHeight, dpr);
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
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [render]);

  return (
    <div
      className={styles["show-canvas-container"] + " h-full w-full"}
      ref={containerRef}
    >
      <canvas ref={buffRef} />
    </div>
  );
};

export default EditMapCanvas;
