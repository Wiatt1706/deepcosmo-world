"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import {
  drawAim,
  drawGrid,
  drawRuler,
  getMouseupPixel,
  getValidPixelBlocks,
} from "../../../helpers/BaseDraw";
import { useEvent } from "../../../../utils/GeneralEvent";
import { PixelBlock, PositionAndSize } from "@/types/MapTypes";
import { Position } from "@/types/CanvasTypes";
import { useCanvasSize } from "../../../../hook/canvas/useCanvasBase";
import { atom, useAtom, useSetAtom } from "jotai";

export const AddMapValidBlocksAtom = atom<PixelBlock[]>([]);
export const AddMapValidAimAtom = atom<PositionAndSize | null>(null);

const AddMapCanvas = ({
  scale,
  toolInfo,
  loadData,
  userPixelBlockData,
  rectSize,
}: {
  scale: number;
  toolInfo: any;
  loadData?: PixelBlock[] | null;
  userPixelBlockData?: PixelBlock[] | null;
  rectSize?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<Position>({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  const [flashOverlap, setFlashOverlap] = useState(false);
  const setValidBlocks = useSetAtom(AddMapValidBlocksAtom);
  const [validAim, setValidAim] = useAtom(AddMapValidAimAtom);

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
    setMousePosition({ x: e.clientX, y: e.clientY });
    if (!isDrag || !dragStartRef.current) return;

    const deltaX = (e.clientX - dragStartRef.current.x) / scale;
    const deltaY = (e.clientY - dragStartRef.current.y) / scale;

    setMapCenter((prev) => ({
      x: prev.x - deltaX,
      y: prev.y - deltaY,
    }));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  });

  const render = useCallback(() => {
    const buffCtx = buffRef.current?.getContext("2d");
    if (!buffCtx) return;
    buffCtx.clearRect(0, 0, buffCtx.canvas.width, buffCtx.canvas.height);
    drawBuff();
  }, [
    validAim,
    scale,
    mapCenter,
    toolInfo,
    mousePosition,
    flashOverlap,
    loadData,
    userPixelBlockData,
  ]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      initializeCanvasSize();
      render();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    initializeCanvasSize();
    render();

    return () => {
      resizeObserver.disconnect();
    };
  }, [initializeCanvasSize, render]);

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();

    const buffCanvas = buffRef.current;
    const buffCtx = buffCanvas?.getContext("2d");
    if (!buffCanvas || !buffCtx) return;

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

      const validBlocks = getValidPixelBlocks(
        adjustedX,
        adjustedY,
        brushSizeInPixels,
        brushSizeInPixels,
        loadData
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

      if (validBlocks && isInRectSizeRange && toolInfo.editable) {
        setValidBlocks(validBlocks);
        setValidAim({
          x: adjustedX,
          y: adjustedY,
          width: brushSizeInPixels,
          height: brushSizeInPixels,
        });
      } else {
        // Trigger flash animation
        setFlashOverlap(true);
        setTimeout(() => setFlashOverlap(false), 300);
      }
    }
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

    const drawPixelBlock = (
      data: PixelBlock[] | null | undefined,
      color: string,
      ctx: CanvasRenderingContext2D,
      padding: number
    ) => {
      if (!data) return; // 如果数据为空，则不做任何操作

      data.forEach((coord: PixelBlock) => {
        const scaledX = CONVER_X(coord.x, padding);
        const scaledY = CONVER_Y(coord.y, padding);
        const scaledWidth = CONVER_WIDTH(coord.width, padding);
        const scaledHeight = CONVER_HEIGHT(coord.height, padding);

        ctx.fillStyle = color;
        ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
      });
    };

    drawPixelBlock(loadData, "#dadddf", buffCtx, padding);
    drawPixelBlock(userPixelBlockData, "#28d3b1", buffCtx, padding);

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

      drawAim(
        buffCtx,
        toolInfo.pixelSize / 2,
        CONVER_X(adjustedX),
        CONVER_Y(adjustedY),
        CONVER_WIDTH(brushSizeInPixels),
        CONVER_HEIGHT(brushSizeInPixels)
      );

      if (validAim) {
        const scaledX = CONVER_X(validAim.x, padding);
        const scaledY = CONVER_Y(validAim.y, padding);
        const scaledWidth = CONVER_WIDTH(validAim.width, padding);
        const scaledHeight = CONVER_HEIGHT(validAim.height, padding);

        buffCtx.fillStyle = "rgba(0, 111, 239, 0.8)";
        buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
      }
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

export default AddMapCanvas;
